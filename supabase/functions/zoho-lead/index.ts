import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/http.ts'

type LeadKind = 'enquiry' | 'consultation' | 'flight'

interface RequestBody {
  kind?: LeadKind
  recordId?: string
}

const TABLES: Record<LeadKind, string> = {
  enquiry: 'enquiries',
  consultation: 'consultation_bookings',
  flight: 'flight_enquiries',
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: '', last: 'Website Enquiry' }
  if (parts.length === 1) return { first: '', last: parts[0] }
  return { first: parts.slice(0, -1).join(' '), last: parts[parts.length - 1] }
}

function descriptionFor(kind: LeadKind, record: Record<string, unknown>): string {
  const lines: string[] = [`Lead type: ${kind}`, `Reference: ${record.id}`]
  if (kind === 'enquiry') {
    lines.push(
      `Service: ${record.service_category ?? ''}`,
      `Destination: ${record.destination ?? ''}`,
      `Preferred intake: ${record.preferred_intake ?? ''}`,
      `Budget: ${record.budget_range ?? ''}`,
      `Country: ${record.country_of_residence ?? ''}`,
      `Assessment: ${JSON.stringify(record.details ?? {})}`,
    )
  }
  if (kind === 'consultation') {
    lines.push(
      `Service: ${record.service_category ?? ''}`,
      `Preferred date: ${record.preferred_date ?? ''}`,
      `Preferred time: ${record.preferred_time ?? ''}`,
      `Notes: ${record.notes ?? ''}`,
    )
  }
  if (kind === 'flight') {
    lines.push(
      `Route: ${record.departure_city ?? ''} to ${record.destination ?? ''}`,
      `Departure: ${record.departure_date ?? ''}`,
      `Return: ${record.return_date ?? ''}`,
      `Trip type: ${record.trip_type ?? ''}`,
      `Passengers: ${record.passengers ?? ''}`,
      `Cabin: ${record.cabin_class ?? ''}`,
      `Notes: ${record.notes ?? ''}`,
    )
  }
  lines.push(`Lead source: ${record.lead_source ?? 'website'}`)
  return lines.join('\n')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  if (!supabaseUrl || !serviceRoleKey) return json({ error: 'Supabase server configuration is missing.' }, 500)

  let body: RequestBody
  try {
    body = (await request.json()) as RequestBody
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const kind = body.kind
  const recordId = body.recordId
  if (!kind || !recordId || !(kind in TABLES)) return json({ error: 'A valid kind and recordId are required.' }, 400)

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  const table = TABLES[kind]

  const { data: record, error: recordError } = await admin.from(table).select('*').eq('id', recordId).maybeSingle()
  if (recordError) return json({ error: recordError.message }, 500)
  if (!record) return json({ error: 'Lead record not found.' }, 404)

  if (record.integration_status === 'synced' && record.zoho_record_id) {
    return json({ status: 'already_synced', zohoRecordId: record.zoho_record_id })
  }

  const clientId = Deno.env.get('ZOHO_CLIENT_ID') ?? ''
  const clientSecret = Deno.env.get('ZOHO_CLIENT_SECRET') ?? ''
  const refreshToken = Deno.env.get('ZOHO_REFRESH_TOKEN') ?? ''
  const accountsUrl = (Deno.env.get('ZOHO_ACCOUNTS_URL') ?? 'https://accounts.zoho.com').replace(/\/$/, '')
  const apiDomain = (Deno.env.get('ZOHO_API_DOMAIN') ?? 'https://www.zohoapis.com').replace(/\/$/, '')
  const leadSource = Deno.env.get('ZOHO_LEAD_SOURCE') ?? 'Easy Permit Website'

  if (!clientId || !clientSecret || !refreshToken) {
    await admin.from(table).update({ integration_status: 'pending_configuration' }).eq('id', recordId)
    await admin.from('integration_logs').insert({
      kind: 'zoho_lead',
      reference_id: recordId,
      status: 'pending_configuration',
      message: 'Zoho credentials are not configured.',
      payload: { leadKind: kind },
    })
    return json({ status: 'pending_configuration', message: 'Zoho credentials are not configured. The lead remains in the queue.' }, 202)
  }

  try {
    const tokenParams = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    })
    const tokenResponse = await fetch(`${accountsUrl}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams,
    })
    const tokenData = (await tokenResponse.json()) as { access_token?: string; error?: string }
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(`Zoho token refresh failed: ${tokenData.error ?? tokenResponse.status}`)
    }

    const { first, last } = splitName(String(record.full_name ?? ''))
    const lead = {
      First_Name: first,
      Last_Name: last,
      Email: record.email ?? '',
      Phone: record.phone ?? '',
      Company: 'Individual',
      Country: record.country_of_residence ?? '',
      Lead_Source: leadSource,
      Description: descriptionFor(kind, record),
    }

    const zohoResponse = await fetch(`${apiDomain}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [lead] }),
    })
    const zohoData = (await zohoResponse.json()) as {
      data?: Array<{ code?: string; message?: string; details?: { id?: string } }>
    }
    const result = zohoData.data?.[0]
    const accepted = result?.code === 'SUCCESS' || result?.code === 'DUPLICATE_DATA'
    if (!zohoResponse.ok || !accepted) {
      throw new Error(`Zoho rejected the lead: ${result?.message ?? result?.code ?? zohoResponse.status}`)
    }
    const zohoRecordId = result?.details?.id
    if (!zohoRecordId) throw new Error('Zoho accepted the request but did not return a record id.')

    await admin.from(table).update({ integration_status: 'synced', zoho_record_id: zohoRecordId }).eq('id', recordId)
    await admin.from('integration_logs').insert({
      kind: 'zoho_lead',
      reference_id: recordId,
      status: 'synced',
      message: 'Lead synced to Zoho CRM.',
      payload: { leadKind: kind, zohoRecordId },
    })

    return json({ status: 'synced', zohoRecordId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Zoho sync error.'
    await admin.from(table).update({ integration_status: 'failed' }).eq('id', recordId)
    await admin.from('integration_logs').insert({
      kind: 'zoho_lead',
      reference_id: recordId,
      status: 'failed',
      message,
      payload: { leadKind: kind },
    })
    return json({ error: 'Zoho sync failed.', message }, 502)
  }
})

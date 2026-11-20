import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, escapeHtml, json } from '../_shared/http.ts'

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

const LABELS: Record<LeadKind, string> = {
  enquiry: 'enquiry',
  consultation: 'consultation request',
  flight: 'flight request',
}

async function sendEmail(payload: Record<string, unknown>): Promise<{ ok: boolean; message: string }> {
  const apiKey = Deno.env.get('RESEND_API_KEY') ?? ''
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const text = await response.text()
    return { ok: false, message: `Resend ${response.status}: ${text.slice(0, 300)}` }
  }
  return { ok: true, message: 'sent' }
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

  const resendKey = Deno.env.get('RESEND_API_KEY') ?? ''
  const fromEmail = Deno.env.get('FROM_EMAIL') ?? ''
  const teamEmail = Deno.env.get('TEAM_EMAIL') ?? ''
  const replyTo = Deno.env.get('REPLY_TO_EMAIL') ?? fromEmail

  if (!resendKey || !fromEmail) {
    await admin.from('integration_logs').insert({
      kind: 'email',
      reference_id: recordId,
      status: 'pending_configuration',
      message: 'Resend email credentials are not configured.',
      payload: { leadKind: kind },
    })
    return json({ status: 'pending_configuration', message: 'Email credentials are not configured.' }, 202)
  }

  const name = String(record.full_name ?? 'there')
  const email = String(record.email ?? '')
  const reference = String(record.id ?? recordId).slice(0, 8)
  const label = LABELS[kind]

  const clientHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;color:#102B4D">
      <h2 style="margin:0 0 12px">We received your ${escapeHtml(label)}</h2>
      <p>Hello ${escapeHtml(name)},</p>
      <p>Thank you for contacting Easy Permit Travel Services. Your ${escapeHtml(label)} has been received and our team will review it.</p>
      <p>Reference: <strong>${escapeHtml(reference)}</strong></p>
      <p>We will follow up using the contact details you provided. If you need to add anything, reply to this email or contact us through the website.</p>
      <p style="margin-top:24px">This is an automated acknowledgement. It is not a confirmation of admission, visa approval, flight availability or any other outcome.</p>
      <p>Easy Permit Travel Services</p>
    </div>`

  const teamHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:680px;color:#102B4D">
      <h2 style="margin:0 0 12px">New ${escapeHtml(label)}</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(record.phone)}</p>
      <p><strong>Reference:</strong> ${escapeHtml(reference)}</p>
      <pre style="white-space:pre-wrap;background:#F5F7FA;padding:12px;border-radius:8px">${escapeHtml(JSON.stringify(record, null, 2))}</pre>
      <p>Review this lead in the staff dashboard.</p>
    </div>`

  const results: string[] = []
  let failed = false

  if (email) {
    const clientResult = await sendEmail({
      from: fromEmail,
      to: [email],
      reply_to: replyTo,
      subject: `We received your ${label} — Easy Permit Travel Services`,
      html: clientHtml,
    })
    results.push(clientResult.ok ? 'client_sent' : 'client_failed')
    if (!clientResult.ok) {
      failed = true
      await admin.from('integration_logs').insert({
        kind: 'email',
        reference_id: recordId,
        status: 'failed',
        message: clientResult.message,
        payload: { recipient: 'client' },
      })
    }
  }

  if (teamEmail) {
    const teamResult = await sendEmail({
      from: fromEmail,
      to: [teamEmail],
      reply_to: replyTo,
      subject: `New ${label}: ${name} (${reference})`,
      html: teamHtml,
    })
    results.push(teamResult.ok ? 'team_sent' : 'team_failed')
    if (!teamResult.ok) {
      failed = true
      await admin.from('integration_logs').insert({
        kind: 'email',
        reference_id: recordId,
        status: 'failed',
        message: teamResult.message,
        payload: { recipient: 'team' },
      })
    }
  }

  if (results.length === 0) {
    return json({ status: 'pending_configuration', message: 'No recipient email was available.' }, 202)
  }

  await admin.from('integration_logs').insert({
    kind: 'email',
    reference_id: recordId,
    status: failed ? 'failed' : 'sent',
    message: results.join(', '),
    payload: { leadKind: kind },
  })

  if (failed) return json({ error: 'One or more acknowledgement emails failed.', results }, 502)
  return json({ status: 'sent', results })
})

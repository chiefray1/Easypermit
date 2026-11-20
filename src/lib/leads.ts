import type { ConsultationInput, FlightInput, LeadBase, LeadKind, StoredLead, SubmissionResult } from '../types/leads'
import { supabase } from './supabase'

const STORAGE_KEY = 'easypermit:leads:v1'
const GUARD_KEY = 'easypermit:submit-guard:v1'
const RATE_LIMIT_MS = 30_000
const DUPLICATE_WINDOW_MS = 10 * 60_000

function readLocal(): StoredLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : []
  } catch {
    return []
  }
}

function writeLocal(records: StoredLead[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 500)))
}

function assertSubmissionAllowed(kind: LeadKind, email: string, phone: string, website?: unknown): void {
  if (typeof website === 'string' && website.trim()) {
    throw new Error('We could not verify this submission. Please reload the page and try again.')
  }

  const now = Date.now()
  const fingerprint = `${kind}:${email.trim().toLowerCase()}:${phone.replace(/\D/g, '')}`
  let records: { fingerprint: string; at: number }[] = []
  try {
    const raw = localStorage.getItem(GUARD_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (Array.isArray(parsed)) {
      records = parsed.filter(
        (item): item is { fingerprint: string; at: number } =>
          Boolean(item) &&
          typeof item === 'object' &&
          typeof (item as { fingerprint?: unknown }).fingerprint === 'string' &&
          typeof (item as { at?: unknown }).at === 'number',
      )
    }
  } catch {
    records = []
  }

  const recent = records.filter((item) => now - item.at < 24 * 60 * 60_000)
  const last = recent[recent.length - 1]
  if (last && now - last.at < RATE_LIMIT_MS) {
    throw new Error('Please wait a moment before submitting again.')
  }
  if (recent.some((item) => item.fingerprint === fingerprint && now - item.at < DUPLICATE_WINDOW_MS)) {
    throw new Error('This enquiry has already been submitted. Please wait before trying again.')
  }

  recent.push({ fingerprint, at: now })
  try {
    localStorage.setItem(GUARD_KEY, JSON.stringify(recent.slice(-100)))
  } catch {
    // Storage may be unavailable in private browsing; the server remains the source of truth.
  }
}

function saveLocal(record: StoredLead): SubmissionResult {
  const records = readLocal()
  records.unshift(record)
  writeLocal(records)
  return {
    id: record.id,
    source: 'local',
    integrationStatus: 'pending_configuration',
    message:
      'Your enquiry was saved in this browser for preview. Configure Supabase to persist enquiries and queue CRM sync.',
  }
}

function queuedIntegration(kind: LeadKind, id: string): void {
  if (!supabase) return
  void supabase.functions
    .invoke('zoho-lead', { body: { kind, recordId: id } })
    .then(({ error }) => {
      if (error) console.warn('Zoho lead queue failed', error.message)
    })
    .catch((error: unknown) => console.warn('Zoho lead queue failed', error))

  void supabase.functions
    .invoke('send-acknowledgement', { body: { kind, recordId: id } })
    .then(({ error }) => {
      if (error) console.warn('Acknowledgement email queue failed', error.message)
    })
    .catch((error: unknown) => console.warn('Acknowledgement email queue failed', error))
}

export async function submitEnquiry(input: LeadBase): Promise<SubmissionResult> {
  assertSubmissionAllowed('enquiry', input.email, input.phone, input.details.website)
  const id = crypto.randomUUID()
  const payload = {
    id,
    full_name: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    country_of_residence: input.countryOfResidence.trim(),
    service_category: input.serviceCategory,
    destination: input.destination.trim(),
    preferred_intake: input.preferredIntake.trim(),
    budget_range: input.budgetRange.trim(),
    details: input.details,
    consent: input.consent,
    consent_at: new Date().toISOString(),
    lead_source: input.leadSource,
    utm: input.utm,
    status: 'new',
    integration_status: 'pending',
  }

  if (!supabase) {
    if (!import.meta.env.DEV) {
      throw new Error('Online submission is not configured. Please contact us directly so we can assist you.')
    }
    return saveLocal({
      kind: 'enquiry',
      created_at: new Date().toISOString(),
      ...payload,
      integration_status: 'pending_configuration',
      details: input.details,
      status: 'new',
    })
  }

  const { error } = await supabase.from('enquiries').insert(payload)
  if (error) throw new Error(error.message)
  queuedIntegration('enquiry', id)
  return {
    id,
    source: 'supabase',
    integrationStatus: 'queued',
    message: 'Your enquiry has been received. Our team will review it and follow up using the contact details you provided.',
  }
}

export async function submitConsultation(input: ConsultationInput): Promise<SubmissionResult> {
  assertSubmissionAllowed('consultation', input.email, input.phone, input.website)
  const id = crypto.randomUUID()
  const payload = {
    id,
    full_name: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    service_category: input.serviceCategory,
    preferred_date: input.preferredDate || null,
    preferred_time: input.preferredTime || null,
    notes: input.notes.trim(),
    consent: input.consent,
    consent_at: new Date().toISOString(),
    lead_source: input.leadSource,
    status: 'new',
  }

  if (!supabase) {
    if (!import.meta.env.DEV) {
      throw new Error('Online booking is not configured. Please contact us directly so we can assist you.')
    }
    return saveLocal({
      id,
      kind: 'consultation',
      created_at: new Date().toISOString(),
      integration_status: 'pending_configuration',
      status: 'new',
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      service_category: payload.service_category,
      preferred_date: payload.preferred_date ?? '',
      preferred_time: payload.preferred_time ?? '',
      notes: payload.notes,
      consent: payload.consent,
      lead_source: payload.lead_source,
    })
  }

  const { error } = await supabase.from('consultation_bookings').insert(payload)
  if (error) throw new Error(error.message)
  queuedIntegration('consultation', id)
  return {
    id,
    source: 'supabase',
    integrationStatus: 'queued',
    message: 'Your consultation request has been received. We will confirm availability using your contact details.',
  }
}

export async function submitFlightEnquiry(input: FlightInput): Promise<SubmissionResult> {
  assertSubmissionAllowed('flight', input.email, input.phone, input.website)
  const id = crypto.randomUUID()
  const payload = {
    id,
    full_name: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    departure_city: input.departureCity.trim(),
    destination: input.destination.trim(),
    departure_date: input.departureDate || null,
    return_date: input.returnDate || null,
    trip_type: input.tripType,
    passengers: Number.parseInt(input.passengers, 10) || 1,
    cabin_class: input.cabinClass,
    notes: input.notes.trim(),
    consent: input.consent,
    consent_at: new Date().toISOString(),
    lead_source: input.leadSource,
    status: 'new',
    integration_status: 'pending',
  }

  if (!supabase) {
    if (!import.meta.env.DEV) {
      throw new Error('Online flight enquiries are not configured. Please contact us directly so we can assist you.')
    }
    return saveLocal({
      id,
      kind: 'flight',
      created_at: new Date().toISOString(),
      integration_status: 'pending_configuration',
      status: 'new',
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      departure_city: payload.departure_city,
      destination: payload.destination,
      departure_date: payload.departure_date ?? '',
      return_date: payload.return_date ?? '',
      trip_type: payload.trip_type,
      passengers: String(payload.passengers),
      cabin_class: payload.cabin_class,
      notes: payload.notes,
      consent: payload.consent,
      lead_source: payload.lead_source,
    })
  }

  const { error } = await supabase.from('flight_enquiries').insert(payload)
  if (error) throw new Error(error.message)
  queuedIntegration('flight', id)
  return {
    id,
    source: 'supabase',
    integrationStatus: 'queued',
    message: 'Your flight request has been received. We will review the route and follow up with options.',
  }
}

export function getLocalLeads(): StoredLead[] {
  return readLocal()
}

export function updateLocalLeadStatus(id: string, status: string): void {
  const records = readLocal().map((record) => (record.id === id ? { ...record, status } : record))
  writeLocal(records)
}

export function clearLocalLeads(): void {
  localStorage.removeItem(STORAGE_KEY)
}

import { useCallback, useEffect, useState } from 'react'
import { getLocalLeads, updateLocalLeadStatus } from '../lib/leads'
import { supabase } from '../lib/supabase'
import type { LeadKind } from '../types/leads'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'

export interface AdminLead {
  id: string
  kind: LeadKind
  createdAt: string
  fullName: string
  email: string
  phone: string
  country: string
  serviceCategory: string
  destination: string
  preferredDate: string
  preferredTime: string
  budget: string
  intake: string
  notes: string
  details: Record<string, unknown>
  status: LeadStatus
  integrationStatus: string
  consent: boolean
  origin: 'supabase' | 'local'
}

type Row = Record<string, unknown>

function text(row: Row, key: string): string {
  const value = row[key]
  return typeof value === 'string' ? value : ''
}

function bool(row: Row, key: string): boolean {
  return row[key] === true
}

function detailsOf(row: Row): Record<string, unknown> {
  const value = row.details
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function asStatus(value: string): LeadStatus {
  return value === 'contacted' || value === 'qualified' || value === 'converted' || value === 'closed' ? value : 'new'
}

function mapLead(row: Row, kind: LeadKind, origin: 'supabase' | 'local'): AdminLead {
  const details = detailsOf(row)
  const notes =
    text(row, 'notes') ||
    (typeof details.notes === 'string' ? details.notes : '') ||
    (typeof details.refusalDetails === 'string' ? details.refusalDetails : '')

  const enrichedDetails =
    kind === 'flight'
      ? {
          ...details,
          tripType: text(row, 'trip_type'),
          passengers: row.passengers,
          cabinClass: text(row, 'cabin_class'),
          departureDate: text(row, 'departure_date'),
          returnDate: text(row, 'return_date'),
        }
      : details

  return {
    id: text(row, 'id'),
    kind,
    createdAt: text(row, 'created_at'),
    fullName: text(row, 'full_name'),
    email: text(row, 'email'),
    phone: text(row, 'phone'),
    country: text(row, 'country_of_residence'),
    serviceCategory: text(row, 'service_category') || (kind === 'flight' ? 'flight-booking' : ''),
    destination: text(row, 'destination'),
    preferredDate: text(row, 'preferred_date') || text(row, 'departure_date'),
    preferredTime: text(row, 'preferred_time'),
    budget: text(row, 'budget_range'),
    intake: text(row, 'preferred_intake'),
    notes,
    details: enrichedDetails,
    status: asStatus(text(row, 'status')),
    integrationStatus: text(row, 'integration_status') || 'pending_configuration',
    consent: bool(row, 'consent'),
    origin,
  }
}

function localLeads(): AdminLead[] {
  return getLocalLeads().map((lead) => {
    const row: Row = { ...lead } as Row
    return mapLead(row, lead.kind, 'local')
  })
}

export function useLeads() {
  const [leads, setLeads] = useState<AdminLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick((value) => value + 1), [])

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      if (!supabase) {
        if (active) {
          setLeads(localLeads().sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
          setLoading(false)
        }
        return
      }

      const [enquiries, consultations, flights] = await Promise.all([
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(250),
        supabase.from('consultation_bookings').select('*').order('created_at', { ascending: false }).limit(250),
        supabase.from('flight_enquiries').select('*').order('created_at', { ascending: false }).limit(250),
      ])

      if (!active) return
      const firstError = enquiries.error || consultations.error || flights.error
      if (firstError) {
        setError(firstError.message)
        setLoading(false)
        return
      }

      const merged = [
        ...(enquiries.data ?? []).map((row) => mapLead(row as Row, 'enquiry', 'supabase')),
        ...(consultations.data ?? []).map((row) => mapLead(row as Row, 'consultation', 'supabase')),
        ...(flights.data ?? []).map((row) => mapLead(row as Row, 'flight', 'supabase')),
      ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

      setLeads(merged)
      setLoading(false)
    }

    void load()
    return () => {
      active = false
    }
  }, [tick])

  const updateStatus = useCallback(
    async (lead: AdminLead, status: LeadStatus) => {
      if (!supabase) {
        updateLocalLeadStatus(lead.id, status)
        setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status } : item)))
        return
      }
      const table = lead.kind === 'consultation' ? 'consultation_bookings' : lead.kind === 'flight' ? 'flight_enquiries' : 'enquiries'
      const { error: updateError } = await supabase.from(table).update({ status }).eq('id', lead.id)
      if (updateError) throw new Error(updateError.message)
      setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status } : item)))
    },
    [],
  )

  return { leads, loading, error, refresh, updateStatus }
}

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Download, Mail, MessageCircle, Phone, RefreshCw, Search, X } from 'lucide-react'
import { AdminPageHeader, AccessDenied } from './AdminLayout'
import { KindBadge, STATUS_LABELS, StatusBadge } from './AdminBits'
import { useAuth } from '../store/auth'
import { useLeads, type AdminLead, type LeadStatus } from './useLeads'
import { cn, formatDateTime } from '../lib/utils'
import type { LeadKind } from '../types/leads'

const KIND_OPTIONS: { value: 'all' | LeadKind; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'enquiry', label: 'Enquiries' },
  { value: 'consultation', label: 'Consultations' },
  { value: 'flight', label: 'Flights' },
]

const STATUS_OPTIONS: { value: 'all' | LeadStatus; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
]

function valueText(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  if (value && typeof value === 'object') return JSON.stringify(value)
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function csvCell(value: unknown): string {
  return `"${valueText(value).replace(/"/g, '""')}"`
}

export function AdminEnquiriesPage() {
  const { can } = useAuth()
  const { leads, loading, error, refresh, updateStatus } = useLeads()
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'all' | LeadKind>('all')
  const [status, setStatus] = useState<'all' | LeadStatus>('all')
  const [selected, setSelected] = useState<AdminLead | null>(null)
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    return leads.filter((lead) => {
      const matchesKind = kind === 'all' || lead.kind === kind
      const matchesStatus = status === 'all' || lead.status === status
      const matchesSearch =
        !search ||
        `${lead.fullName} ${lead.email} ${lead.phone} ${lead.serviceCategory} ${lead.destination} ${lead.notes}`
          .toLowerCase()
          .includes(search)
      return matchesKind && matchesStatus && matchesSearch
    })
  }, [leads, kind, status, query])

  if (!can('enquiries')) return <AccessDenied />

  async function changeStatus(lead: AdminLead, nextStatus: LeadStatus) {
    setUpdating(true)
    setUpdateError('')
    try {
      await updateStatus(lead, nextStatus)
      setSelected((current) => (current && current.id === lead.id ? { ...current, status: nextStatus } : current))
    } catch (statusError) {
      setUpdateError(statusError instanceof Error ? statusError.message : 'Could not update status.')
    } finally {
      setUpdating(false)
    }
  }

  function exportCsv() {
    const headers = [
      'Received',
      'Type',
      'Status',
      'Name',
      'Email',
      'Phone',
      'Country',
      'Service',
      'Destination',
      'Preferred date',
      'Budget',
      'Notes',
      'Consent',
      'Integration status',
    ]
    const rows = filtered.map((lead) => [
      lead.createdAt,
      lead.kind,
      lead.status,
      lead.fullName,
      lead.email,
      lead.phone,
      lead.country,
      lead.serviceCategory,
      lead.destination,
      lead.preferredDate || lead.intake,
      lead.budget,
      lead.notes,
      lead.consent ? 'Yes' : 'No',
      lead.integrationStatus,
    ])
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `easypermit-leads-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <AdminPageHeader
        title="Enquiries"
        description="Review and action enquiries, consultation requests and flight requests. Update the status as your team follows up."
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={refresh} className="btn-outline">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button type="button" onClick={exportCsv} className="btn-primary" disabled={filtered.length === 0}>
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-[12px] text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field pl-10"
            placeholder="Search name, email, phone, destination or notes"
            aria-label="Search leads"
          />
        </div>
        <select value={kind} onChange={(event) => setKind(event.target.value as 'all' | LeadKind)} className="field sm:max-w-[170px]" aria-label="Filter by type">
          {KIND_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as 'all' | LeadStatus)} className="field sm:max-w-[170px]" aria-label="Filter by status">
          {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <span className="shrink-0 text-[11px] font-semibold text-navy-400">{filtered.length} shown</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
        {loading ? (
          <p className="py-16 text-center text-sm text-navy-400">Loading leads…</p>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-navy-700">No leads match this view</p>
            <p className="mt-1 text-[12px] text-navy-400">Try clearing filters or wait for new submissions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-navy-100 bg-navy-50/50 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="cursor-pointer text-[12px] transition hover:bg-navy-50/50"
                    onClick={() => setSelected(lead)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy-900">{lead.fullName}</p>
                      <p className="text-[10.5px] text-navy-400">{lead.email || lead.phone || 'No contact details'}</p>
                    </td>
                    <td className="px-4 py-3"><KindBadge kind={lead.kind} /></td>
                    <td className="px-4 py-3">
                      <p className="text-navy-700">{lead.serviceCategory || '—'}</p>
                      <p className="text-[10.5px] text-navy-400">{lead.destination || 'No destination'}</p>
                    </td>
                    <td className="px-4 py-3 text-navy-500">{formatDateTime(lead.createdAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide',
                        lead.integrationStatus.startsWith('synced') || lead.integrationStatus === 'sent'
                          ? 'bg-emerald-50 text-emerald-700'
                          : lead.integrationStatus.startsWith('failed')
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700',
                      )}>
                        {lead.integrationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/45" onClick={() => setSelected(null)} role="presentation">
          <aside
            className="h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Lead details for ${selected.fullName}`}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-navy-100 bg-white px-5 py-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <KindBadge kind={selected.kind} />
                  <StatusBadge status={selected.status} />
                </div>
                <h2 className="mt-2 font-display text-xl font-bold text-navy-900">{selected.fullName}</h2>
                <p className="text-[11px] text-navy-400">Received {formatDateTime(selected.createdAt)}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-lg text-navy-400 hover:bg-navy-50" aria-label="Close details">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-3">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 rounded-xl border border-navy-100 p-3 text-[12px] font-semibold text-navy-700 hover:bg-navy-50">
                  <Mail className="h-4 w-4 text-gold-600" /> Email
                </a>
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2 rounded-xl border border-navy-100 p-3 text-[12px] font-semibold text-navy-700 hover:bg-navy-50">
                  <Phone className="h-4 w-4 text-gold-600" /> Call
                </a>
                <a
                  href={`https://wa.me/${selected.phone.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-2 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  <MessageCircle className="h-4 w-4" /> Open WhatsApp
                </a>
              </div>

              <div className="rounded-xl border border-navy-100 p-4">
                <label className="label" htmlFor="lead-status">Follow-up status</label>
                <select
                  id="lead-status"
                  value={selected.status}
                  onChange={(event) => void changeStatus(selected, event.target.value as LeadStatus)}
                  disabled={updating}
                  className="field"
                >
                  {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((value) => (
                    <option key={value} value={value}>{STATUS_LABELS[value]}</option>
                  ))}
                </select>
                {updating && <p className="mt-1 text-[10.5px] text-navy-400">Saving…</p>}
                {updateError && <p className="mt-1 text-[10.5px] text-red-600">{updateError}</p>}
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-400">Contact</h3>
                <dl className="mt-2 grid gap-2 text-[12px] sm:grid-cols-2">
                  {[
                    ['Email', selected.email],
                    ['Phone', selected.phone],
                    ['Country', selected.country],
                    ['Consent', selected.consent ? 'Confirmed' : 'Not recorded'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-mist p-2.5">
                      <dt className="text-[9.5px] font-bold uppercase tracking-wide text-navy-400">{label}</dt>
                      <dd className="mt-0.5 break-words text-navy-700">{value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-400">Lead details</h3>
                <dl className="mt-2 space-y-2 text-[12px]">
                  {[
                    ['Service', selected.serviceCategory],
                    ['Destination', selected.destination],
                    ['Preferred date or intake', selected.preferredDate || selected.intake],
                    ['Budget', selected.budget],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-navy-50 pb-2">
                      <dt className="text-navy-400">{label}</dt>
                      <dd className="text-right font-medium text-navy-800">{value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {selected.notes && (
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-400">Notes</h3>
                  <p className="mt-2 whitespace-pre-wrap rounded-xl bg-mist p-3 text-[12px] leading-relaxed text-navy-700">{selected.notes}</p>
                </div>
              )}

              {Object.entries(selected.details).filter(([, value]) => value !== '' && value !== null && value !== undefined).length > 0 && (
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-400">Assessment answers</h3>
                  <dl className="mt-2 space-y-2 text-[12px]">
                    {Object.entries(selected.details)
                      .filter(([, value]) => value !== '' && value !== null && value !== undefined)
                      .map(([key, value]) => (
                        <div key={key} className="grid grid-cols-[0.9fr_1.1fr] gap-3 border-b border-navy-50 pb-2">
                          <dt className="capitalize text-navy-400">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</dt>
                          <dd className="break-words text-right text-navy-700">{valueText(value)}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                <strong className="font-bold">Integration status:</strong> {selected.integrationStatus.replace(/_/g, ' ')}.
                This reflects the CRM/email queue, not the client outcome. Do not treat a queued status as a successful CRM
                submission.
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

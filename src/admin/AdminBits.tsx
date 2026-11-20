import type { ReactNode } from 'react'
import { cn } from '../lib/utils'
import type { LeadKind } from '../types/leads'
import type { LeadStatus } from './useLeads'

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  closed: 'Closed',
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const styles: Record<LeadStatus, string> = {
    new: 'bg-blue-50 text-blue-700 border-blue-100',
    contacted: 'bg-amber-50 text-amber-700 border-amber-100',
    qualified: 'bg-purple-50 text-purple-700 border-purple-100',
    converted: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    closed: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return (
    <span className={cn('inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide', styles[status])}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function KindBadge({ kind }: { kind: LeadKind }) {
  const styles: Record<LeadKind, string> = {
    enquiry: 'bg-navy-50 text-navy-700',
    consultation: 'bg-gold-50 text-gold-800',
    flight: 'bg-sky-50 text-sky-700',
  }
  const labels: Record<LeadKind, string> = {
    enquiry: 'Enquiry',
    consultation: 'Consultation',
    flight: 'Flight',
  }
  return <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold', styles[kind])}>{labels[kind]}</span>
}

export function AdminStat({
  label,
  value,
  hint,
  icon,
  tone = 'default',
}: {
  label: string
  value: string | number
  hint?: string
  icon?: ReactNode
  tone?: 'default' | 'gold' | 'green' | 'amber'
}) {
  const tones = {
    default: 'bg-navy-50 text-navy-700',
    gold: 'bg-gold-50 text-gold-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  }
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-navy-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-navy-900">{value}</p>
          {hint && <p className="mt-1 text-[11px] text-navy-400">{hint}</p>}
        </div>
        {icon && <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', tones[tone])}>{icon}</span>}
      </div>
    </div>
  )
}

export function AdminPanel({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-navy-100 bg-white">
      <div className="flex flex-col gap-2 border-b border-navy-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-navy-900">{title}</h2>
          {description && <p className="mt-0.5 text-[11.5px] text-navy-400">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

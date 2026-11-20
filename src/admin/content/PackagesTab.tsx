import { useState, type FormEvent } from 'react'
import { Edit3, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useContent } from '../../store/content'
import type { HolidayPackage } from '../../data/types'
import { AdminModal, AdminFormActions, CheckboxRow } from '../AdminModal'
import { TextField, TextareaField, SelectField } from '../../components/forms/FormBits'
import { uid } from '../../lib/utils'

interface PackageForm {
  id: string
  title: string
  destination: string
  duration: string
  groupType: string
  departurePeriod: string
  inclusions: string
  exclusions: string
  indicativePrice: string
  currency: string
  priceNote: string
  published: boolean
  createdAt: string
}

function blankPackage(): PackageForm {
  return {
    id: uid('package'),
    title: '',
    destination: '',
    duration: '',
    groupType: 'Private',
    departurePeriod: '',
    inclusions: '',
    exclusions: '',
    indicativePrice: '',
    currency: 'NGN',
    priceNote: 'Final price, availability and terms are confirmed in writing.',
    published: false,
    createdAt: new Date().toISOString(),
  }
}

function toForm(holidayPackage: HolidayPackage): PackageForm {
  return {
    id: holidayPackage.id,
    title: holidayPackage.title,
    destination: holidayPackage.destination,
    duration: holidayPackage.duration,
    groupType: holidayPackage.groupType,
    departurePeriod: holidayPackage.departurePeriod,
    inclusions: holidayPackage.inclusions.join('\n'),
    exclusions: holidayPackage.exclusions.join('\n'),
    indicativePrice: holidayPackage.indicativePrice,
    currency: holidayPackage.currency,
    priceNote: holidayPackage.priceNote,
    published: holidayPackage.published,
    createdAt: holidayPackage.createdAt,
  }
}

function lines(value: string): string[] {
  return value.split('\n').map((line) => line.trim()).filter(Boolean)
}

export function PackagesTab() {
  const { packages, savePackage, deletePackage } = useContent()
  const [editing, setEditing] = useState<PackageForm | null>(null)
  const [error, setError] = useState('')

  function save(event: FormEvent) {
    event.preventDefault()
    if (!editing) return
    if (!editing.title.trim() || !editing.destination.trim() || !editing.duration.trim()) {
      setError('Title, destination and duration are required.')
      return
    }
    if (editing.indicativePrice.trim() && !editing.priceNote.trim()) {
      setError('Add a price note whenever an indicative price is shown.')
      return
    }
    savePackage({
      id: editing.id,
      title: editing.title.trim(),
      destination: editing.destination.trim(),
      duration: editing.duration.trim(),
      groupType: editing.groupType.trim() || 'Private',
      departurePeriod: editing.departurePeriod.trim(),
      inclusions: lines(editing.inclusions),
      exclusions: lines(editing.exclusions),
      indicativePrice: editing.indicativePrice.trim(),
      currency: editing.currency,
      priceNote: editing.priceNote.trim() || 'Final price and availability confirmed in writing.',
      published: editing.published,
      createdAt: editing.createdAt,
    })
    setEditing(null)
  }

  function remove(holidayPackage: HolidayPackage) {
    if (!window.confirm(`Delete “${holidayPackage.title}”?`)) return
    deletePackage(holidayPackage.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-navy-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-relaxed text-navy-500">
          Only publish verified packages with clear inclusions, exclusions and price conditions. Use “price on request” when
          the price is not confirmed.
        </p>
        <button type="button" onClick={() => { setEditing(blankPackage()); setError('') }} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Add package
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white py-12 text-center">
          <p className="text-sm font-semibold text-navy-700">No packages published</p>
          <p className="mt-1 text-[12px] text-navy-400">The public holiday page shows a request-driven empty state until packages are added.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {packages.map((holidayPackage) => (
            <article key={holidayPackage.id} className="rounded-2xl border border-navy-100 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="chip bg-navy-50 text-navy-600">{holidayPackage.destination}</span>
                  <h3 className="mt-2 font-display text-base font-bold text-navy-900">{holidayPackage.title}</h3>
                  <p className="text-[10.5px] text-navy-400">{holidayPackage.duration} • {holidayPackage.groupType}</p>
                </div>
                <span className={`chip ${holidayPackage.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {holidayPackage.published ? 'Published' : <><EyeOff className="h-3 w-3" /> Draft</>}
                </span>
              </div>
              <p className="mt-2 text-[12px] font-semibold text-navy-800">
                {holidayPackage.indicativePrice ? `${holidayPackage.currency} ${holidayPackage.indicativePrice}` : 'Price on request'}
              </p>
              <p className="mt-0.5 text-[10.5px] text-navy-400">{holidayPackage.priceNote}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => { setEditing(toForm(holidayPackage)); setError('') }} className="btn-outline px-3 py-1.5 text-[11px]">
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button type="button" onClick={() => remove(holidayPackage)} className="btn-ghost px-2.5 py-1.5 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <AdminModal title="Holiday package" description="Do not invent prices, availability or inclusions." onClose={() => setEditing(null)} size="wide">
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <TextField name="package-title" label="Title" value={editing.title} onChange={(value) => setEditing({ ...editing, title: value })} className="sm:col-span-2" required />
            <TextField name="package-destination" label="Destination" value={editing.destination} onChange={(value) => setEditing({ ...editing, destination: value })} required />
            <TextField name="package-duration" label="Duration" value={editing.duration} onChange={(value) => setEditing({ ...editing, duration: value })} placeholder="e.g. 5 days / 4 nights" required />
            <TextField name="package-group" label="Group type" value={editing.groupType} onChange={(value) => setEditing({ ...editing, groupType: value })} />
            <TextField name="package-departure" label="Departure period" value={editing.departurePeriod} onChange={(value) => setEditing({ ...editing, departurePeriod: value })} placeholder="e.g. Selected dates in July" />
            <TextareaField name="package-inclusions" label="Inclusions" value={editing.inclusions} onChange={(value) => setEditing({ ...editing, inclusions: value })} hint="One per line" />
            <TextareaField name="package-exclusions" label="Exclusions" value={editing.exclusions} onChange={(value) => setEditing({ ...editing, exclusions: value })} hint="One per line" />
            <TextField name="package-price" label="Indicative price" value={editing.indicativePrice} onChange={(value) => setEditing({ ...editing, indicativePrice: value })} placeholder="Leave blank for price on request" />
            <SelectField name="package-currency" label="Currency" value={editing.currency} onChange={(value) => setEditing({ ...editing, currency: value })} options={['NGN', 'USD', 'GBP', 'EUR']} />
            <TextareaField name="package-price-note" label="Price note" value={editing.priceNote} onChange={(value) => setEditing({ ...editing, priceNote: value })} rows={2} className="sm:col-span-2" required />
            <div className="sm:col-span-2">
              <CheckboxRow label="Published" description="Show this package on the tours and holidays page." checked={editing.published} onChange={(checked) => setEditing({ ...editing, published: checked })} />
            </div>
            {error && <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-[11.5px] text-red-700">{error}</p>}
            <div className="sm:col-span-2">
              <AdminFormActions onCancel={() => setEditing(null)} />
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  )
}

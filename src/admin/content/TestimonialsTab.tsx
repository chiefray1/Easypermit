import { useState, type FormEvent } from 'react'
import { Edit3, EyeOff, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useContent } from '../../store/content'
import type { Testimonial } from '../../data/types'
import { AdminModal, AdminFormActions, CheckboxRow } from '../AdminModal'
import { TextField, TextareaField, SelectField } from '../../components/forms/FormBits'
import { formatDate, uid } from '../../lib/utils'

interface TestimonialForm {
  id: string
  clientName: string
  service: string
  destination: string
  quote: string
  outcome: string
  storyDate: string
  permissionConfirmed: boolean
  published: boolean
  createdAt: string
}

function blankTestimonial(): TestimonialForm {
  return {
    id: uid('testimonial'),
    clientName: '',
    service: 'Study Abroad',
    destination: '',
    quote: '',
    outcome: '',
    storyDate: new Date().toISOString().slice(0, 10),
    permissionConfirmed: false,
    published: false,
    createdAt: new Date().toISOString(),
  }
}

function toForm(testimonial: Testimonial): TestimonialForm {
  return {
    id: testimonial.id,
    clientName: testimonial.clientName,
    service: testimonial.service,
    destination: testimonial.destination ?? '',
    quote: testimonial.quote,
    outcome: testimonial.outcome ?? '',
    storyDate: testimonial.storyDate ?? '',
    permissionConfirmed: testimonial.permissionConfirmed,
    published: testimonial.published,
    createdAt: testimonial.createdAt,
  }
}

export function TestimonialsTab() {
  const { testimonials, saveTestimonial, deleteTestimonial } = useContent()
  const [editing, setEditing] = useState<TestimonialForm | null>(null)
  const [error, setError] = useState('')

  function save(event: FormEvent) {
    event.preventDefault()
    if (!editing) return
    if (!editing.clientName.trim() || !editing.quote.trim()) {
      setError('Client name and quote are required.')
      return
    }
    if (editing.published && !editing.permissionConfirmed) {
      setError('Written permission must be confirmed before a testimonial can be published.')
      return
    }
    saveTestimonial({
      id: editing.id,
      clientName: editing.clientName.trim(),
      service: editing.service,
      destination: editing.destination.trim() || undefined,
      quote: editing.quote.trim(),
      outcome: editing.outcome.trim() || undefined,
      storyDate: editing.storyDate || undefined,
      permissionConfirmed: editing.permissionConfirmed,
      published: editing.published,
      createdAt: editing.createdAt,
    })
    setEditing(null)
  }

  function remove(testimonial: Testimonial) {
    if (!window.confirm(`Delete the testimonial from ${testimonial.clientName}?`)) return
    deleteTestimonial(testimonial.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-relaxed text-amber-900">
          <strong className="font-bold">Never invent a client story.</strong> Record written permission before publishing. A
          published story must not imply that future clients will get the same outcome.
        </p>
        <button type="button" onClick={() => { setEditing(blankTestimonial()); setError('') }} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Add testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white py-12 text-center">
          <p className="text-sm font-semibold text-navy-700">No testimonials recorded</p>
          <p className="mt-1 text-[12px] text-navy-400">The public site shows a verification notice until a story is published.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="rounded-2xl border border-navy-100 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip bg-gold-50 text-gold-700">{testimonial.service}</span>
                    {testimonial.destination && <span className="text-[10.5px] text-navy-400">{testimonial.destination}</span>}
                    <span className={`chip ${testimonial.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {testimonial.published ? 'Published' : <><EyeOff className="h-3 w-3" /> Draft</>}
                    </span>
                    {testimonial.permissionConfirmed ? (
                      <span className="chip bg-emerald-50 text-emerald-700"><ShieldCheck className="h-3 w-3" /> Permission</span>
                    ) : (
                      <span className="chip bg-amber-50 text-amber-700">Permission missing</span>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-navy-900">{testimonial.clientName}</h3>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-body/65">“{testimonial.quote}”</p>
                  <p className="mt-1 text-[10.5px] text-navy-400">{formatDate(testimonial.storyDate)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => { setEditing(toForm(testimonial)); setError('') }} className="btn-outline px-3 py-1.5 text-[11px]">
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button type="button" onClick={() => remove(testimonial)} className="btn-ghost px-2.5 py-1.5 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <AdminModal title="Testimonial" description="Only publish with verified written permission." onClose={() => setEditing(null)}>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <TextField name="testimonial-name" label="Client name as approved" value={editing.clientName} onChange={(value) => setEditing({ ...editing, clientName: value })} required />
            <SelectField name="testimonial-service" label="Service" value={editing.service} onChange={(value) => setEditing({ ...editing, service: value })} options={['Study Abroad', 'Visa Services', 'Flight Booking', 'Tours & Holidays']} required />
            <TextField name="testimonial-destination" label="Destination (optional)" value={editing.destination} onChange={(value) => setEditing({ ...editing, destination: value })} />
            <TextField name="testimonial-date" label="Story date" type="date" value={editing.storyDate} onChange={(value) => setEditing({ ...editing, storyDate: value })} />
            <TextareaField name="testimonial-quote" label="Quote" value={editing.quote} onChange={(value) => setEditing({ ...editing, quote: value })} rows={4} className="sm:col-span-2" required />
            <TextareaField name="testimonial-outcome" label="Outcome context" value={editing.outcome} onChange={(value) => setEditing({ ...editing, outcome: value })} rows={2} className="sm:col-span-2" hint="Describe the outcome factually. Do not imply a guarantee." />
            <div className="sm:col-span-2 space-y-2">
              <CheckboxRow label="Written permission confirmed" description="The client agreed to this wording and the use of their name or initials." checked={editing.permissionConfirmed} onChange={(checked) => setEditing({ ...editing, permissionConfirmed: checked })} />
              <CheckboxRow label="Published" description="Show this story on the public success stories page." checked={editing.published} onChange={(checked) => setEditing({ ...editing, published: checked })} />
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

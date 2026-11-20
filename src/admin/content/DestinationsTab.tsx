import { useState, type FormEvent } from 'react'
import { CheckCircle2, Edit3, EyeOff } from 'lucide-react'
import { useContent } from '../../store/content'
import type { Destination } from '../../data/types'
import { AdminModal, AdminFormActions, CheckboxRow } from '../AdminModal'
import { TextField, TextareaField } from '../../components/forms/FormBits'

interface DestinationForm {
  slug: string
  country: string
  flag: string
  image: string
  intro: string
  highlights: string
  reasons: string
  courses: string
  studyLevels: string
  requirements: string
  expensesNote: string
  scholarships: string
  intakes: string
  visaSteps: string
  lastVerified: string
  published: boolean
}

function toForm(destination: Destination): DestinationForm {
  return {
    slug: destination.slug,
    country: destination.country,
    flag: destination.flag,
    image: destination.image,
    intro: destination.intro,
    highlights: destination.highlights.join('\n'),
    reasons: destination.reasons.join('\n'),
    courses: destination.courses.join('\n'),
    studyLevels: destination.studyLevels.join('\n'),
    requirements: destination.requirements.join('\n'),
    expensesNote: destination.expensesNote,
    scholarships: destination.scholarships.join('\n'),
    intakes: destination.intakes.join('\n'),
    visaSteps: destination.visaSteps.join('\n'),
    lastVerified: destination.lastVerified ?? '',
    published: destination.published,
  }
}

function lines(value: string): string[] {
  return value.split('\n').map((line) => line.trim()).filter(Boolean)
}

export function DestinationsTab() {
  const { destinations, saveDestination } = useContent()
  const [editing, setEditing] = useState<DestinationForm | null>(null)
  const [error, setError] = useState('')

  function open(destination: Destination) {
    setEditing(toForm(destination))
    setError('')
  }

  function save(event: FormEvent) {
    event.preventDefault()
    if (!editing) return
    if (!editing.country.trim() || !editing.intro.trim()) {
      setError('Country and introduction are required.')
      return
    }
    const destination: Destination = {
      slug: editing.slug,
      country: editing.country.trim(),
      flag: editing.flag.trim() || '🌍',
      image: editing.image.trim(),
      intro: editing.intro.trim(),
      highlights: lines(editing.highlights),
      reasons: lines(editing.reasons),
      courses: lines(editing.courses),
      studyLevels: lines(editing.studyLevels),
      requirements: lines(editing.requirements),
      expensesNote: editing.expensesNote.trim(),
      scholarships: lines(editing.scholarships),
      intakes: lines(editing.intakes),
      visaSteps: lines(editing.visaSteps),
      lastVerified: editing.lastVerified.trim() || null,
      published: editing.published,
    }
    saveDestination(destination)
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-navy-100 bg-white p-4 text-[12px] leading-relaxed text-navy-500">
        Edit the six destination guides. Keep expense content as guidance, not invented prices. Add a review date only when
        the content has actually been checked against official sources.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {destinations.map((destination) => (
          <article key={destination.slug} className="rounded-2xl border border-navy-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{destination.flag}</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-900">{destination.country}</h3>
                  <p className="text-[10.5px] text-navy-400">/study-abroad/destinations/{destination.slug}</p>
                </div>
              </div>
              <span className={`chip ${destination.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {destination.published ? <><CheckCircle2 className="h-3 w-3" /> Published</> : <><EyeOff className="h-3 w-3" /> Hidden</>}
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-body/65">{destination.intro}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10.5px] text-navy-400">
                {destination.lastVerified ? `Reviewed ${destination.lastVerified}` : 'Review date pending'}
              </span>
              <button type="button" onClick={() => open(destination)} className="btn-outline px-3 py-1.5 text-[11px]">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <AdminModal
          title={`Edit ${editing.country}`}
          description="Update the public destination guide. Use one item per line for lists."
          onClose={() => setEditing(null)}
          size="wide"
        >
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <TextField name="dest-country" label="Country" value={editing.country} onChange={(value) => setEditing({ ...editing, country: value })} required />
            <TextField name="dest-flag" label="Flag emoji" value={editing.flag} onChange={(value) => setEditing({ ...editing, flag: value })} />
            <TextField name="dest-slug" label="URL slug" value={editing.slug} onChange={() => undefined} hint="Slug changes are disabled to avoid breaking links." />
            <TextField name="dest-image" label="Cover image URL" value={editing.image} onChange={(value) => setEditing({ ...editing, image: value })} />
            <TextareaField name="dest-intro" label="Introduction" value={editing.intro} onChange={(value) => setEditing({ ...editing, intro: value })} rows={4} className="sm:col-span-2" required />
            <TextareaField name="dest-highlights" label="Highlights" value={editing.highlights} onChange={(value) => setEditing({ ...editing, highlights: value })} hint="One per line" />
            <TextareaField name="dest-reasons" label="Why students consider it" value={editing.reasons} onChange={(value) => setEditing({ ...editing, reasons: value })} hint="One per line" />
            <TextareaField name="dest-courses" label="Course areas" value={editing.courses} onChange={(value) => setEditing({ ...editing, courses: value })} hint="One per line" />
            <TextareaField name="dest-levels" label="Study levels" value={editing.studyLevels} onChange={(value) => setEditing({ ...editing, studyLevels: value })} hint="One per line" />
            <TextareaField name="dest-requirements" label="Requirements" value={editing.requirements} onChange={(value) => setEditing({ ...editing, requirements: value })} hint="One per line" />
            <TextareaField name="dest-scholarships" label="Scholarships" value={editing.scholarships} onChange={(value) => setEditing({ ...editing, scholarships: value })} hint="One per line" />
            <TextareaField name="dest-intakes" label="Intakes" value={editing.intakes} onChange={(value) => setEditing({ ...editing, intakes: value })} hint="One per line" />
            <TextareaField name="dest-steps" label="Visa steps" value={editing.visaSteps} onChange={(value) => setEditing({ ...editing, visaSteps: value })} hint="One per line" />
            <TextareaField name="dest-expenses" label="Tuition and living costs guidance" value={editing.expensesNote} onChange={(value) => setEditing({ ...editing, expensesNote: value })} rows={3} className="sm:col-span-2" />
            <TextField name="dest-reviewed" label="Last reviewed" value={editing.lastVerified} onChange={(value) => setEditing({ ...editing, lastVerified: value })} placeholder="e.g. 19 November 2026" hint="Leave blank until verified." />
            <div className="sm:col-span-2">
              <CheckboxRow label="Published" description="Show this destination on the public website." checked={editing.published} onChange={(checked) => setEditing({ ...editing, published: checked })} />
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

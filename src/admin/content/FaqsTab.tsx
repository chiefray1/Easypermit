import { useState, type FormEvent } from 'react'
import { Edit3, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useContent } from '../../store/content'
import type { Faq } from '../../data/types'
import { AdminModal, AdminFormActions, CheckboxRow } from '../AdminModal'
import { TextField, TextareaField, SelectField } from '../../components/forms/FormBits'
import { uid } from '../../lib/utils'

const CATEGORIES: Faq['category'][] = ['General', 'Study Abroad', 'Visas', 'Flights & Travel', 'Fees & Payments']

interface FaqForm {
  id: string
  question: string
  answer: string
  category: Faq['category']
  published: boolean
  createdAt: string
}

function blankFaq(): FaqForm {
  return {
    id: uid('faq'),
    question: '',
    answer: '',
    category: 'General',
    published: false,
    createdAt: new Date().toISOString(),
  }
}

export function FaqsTab() {
  const { faqs, saveFaq, deleteFaq } = useContent()
  const [editing, setEditing] = useState<FaqForm | null>(null)
  const [error, setError] = useState('')

  function save(event: FormEvent) {
    event.preventDefault()
    if (!editing) return
    if (!editing.question.trim() || !editing.answer.trim()) {
      setError('Question and answer are required.')
      return
    }
    saveFaq({
      id: editing.id,
      question: editing.question.trim(),
      answer: editing.answer.trim(),
      category: editing.category,
      published: editing.published,
      createdAt: editing.createdAt,
    })
    setEditing(null)
  }

  function remove(faq: Faq) {
    if (!window.confirm('Delete this FAQ?')) return
    deleteFaq(faq.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-navy-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-relaxed text-navy-500">
          Keep answers accurate and direct. Do not promise outcomes or invent fees. Update answers when official rules change.
        </p>
        <button type="button" onClick={() => { setEditing(blankFaq()); setError('') }} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> New FAQ
        </button>
      </div>

      <div className="space-y-2">
        {faqs.map((faq) => (
          <article key={faq.id} className="flex flex-col gap-3 rounded-xl border border-navy-100 bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip bg-navy-50 text-navy-600">{faq.category}</span>
                <span className={`chip ${faq.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {faq.published ? 'Published' : <><EyeOff className="h-3 w-3" /> Draft</>}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-navy-900">{faq.question}</h3>
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-body/65">{faq.answer}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => { setEditing({ id: faq.id, question: faq.question, answer: faq.answer, category: faq.category, published: Boolean(faq.published), createdAt: faq.createdAt ?? new Date().toISOString() }); setError('') }} className="btn-outline px-3 py-1.5 text-[11px]">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button type="button" onClick={() => remove(faq)} className="btn-ghost px-2.5 py-1.5 text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <AdminModal title={editing.question ? 'Edit FAQ' : 'New FAQ'} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="grid gap-4">
            <TextField name="faq-question" label="Question" value={editing.question} onChange={(value) => setEditing({ ...editing, question: value })} required />
            <TextareaField name="faq-answer" label="Answer" value={editing.answer} onChange={(value) => setEditing({ ...editing, answer: value })} rows={5} required />
            <SelectField name="faq-category" label="Category" value={editing.category} onChange={(value) => setEditing({ ...editing, category: value as Faq['category'] })} options={CATEGORIES} required />
            <CheckboxRow label="Published" checked={editing.published} onChange={(checked) => setEditing({ ...editing, published: checked })} />
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[11.5px] text-red-700">{error}</p>}
            <AdminFormActions onCancel={() => setEditing(null)} />
          </form>
        </AdminModal>
      )}
    </div>
  )
}

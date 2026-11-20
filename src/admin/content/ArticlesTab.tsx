import { useState, type FormEvent } from 'react'
import { Edit3, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useContent } from '../../store/content'
import type { Article } from '../../data/types'
import { AdminModal, AdminFormActions, CheckboxRow } from '../AdminModal'
import { TextField, TextareaField } from '../../components/forms/FormBits'
import { formatDate, slugify } from '../../lib/utils'

interface SectionForm {
  heading: string
  paragraphs: string
  bullets: string
}

interface ArticleForm {
  title: string
  slug: string
  excerpt: string
  category: string
  readMinutes: string
  publishedAt: string
  image: string
  published: boolean
  sections: SectionForm[]
}

function blankArticle(): ArticleForm {
  return {
    title: '',
    slug: '',
    excerpt: '',
    category: 'Study Abroad',
    readMinutes: '5',
    publishedAt: new Date().toISOString().slice(0, 10),
    image: '',
    published: false,
    sections: [{ heading: '', paragraphs: '', bullets: '' }],
  }
}

function toForm(article: Article): ArticleForm {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    readMinutes: String(article.readMinutes),
    publishedAt: article.publishedAt,
    image: article.image,
    published: article.published,
    sections: article.sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs.join('\n\n'),
      bullets: (section.bullets ?? []).join('\n'),
    })),
  }
}

function splitParagraphs(value: string): string[] {
  return value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
}

export function ArticlesTab() {
  const { articles, saveArticle, deleteArticle } = useContent()
  const [editing, setEditing] = useState<ArticleForm | null>(null)
  const [originalSlug, setOriginalSlug] = useState<string | null>(null)
  const [error, setError] = useState('')

  function create() {
    setEditing(blankArticle())
    setOriginalSlug(null)
    setError('')
  }

  function open(article: Article) {
    setEditing(toForm(article))
    setOriginalSlug(article.slug)
    setError('')
  }

  function updateSection(index: number, patch: Partial<SectionForm>) {
    if (!editing) return
    const sections = editing.sections.map((section, sectionIndex) => (sectionIndex === index ? { ...section, ...patch } : section))
    setEditing({ ...editing, sections })
  }

  function save(event: FormEvent) {
    event.preventDefault()
    if (!editing) return
    const slug = editing.slug.trim() || slugify(editing.title)
    if (!editing.title.trim() || !slug || !editing.excerpt.trim()) {
      setError('Title, slug and excerpt are required.')
      return
    }
    if (articles.some((article) => article.slug === slug && article.slug !== originalSlug)) {
      setError('That slug is already in use. Choose another.')
      return
    }
    const sections = editing.sections
      .map((section) => ({
        heading: section.heading.trim(),
        paragraphs: splitParagraphs(section.paragraphs),
        bullets: section.bullets.split('\n').map((bullet) => bullet.trim()).filter(Boolean),
      }))
      .filter((section) => section.heading && section.paragraphs.length > 0)
    if (sections.length === 0) {
      setError('Add at least one section with a heading and paragraph.')
      return
    }
    const article: Article = {
      slug,
      title: editing.title.trim(),
      excerpt: editing.excerpt.trim(),
      category: editing.category.trim() || 'General',
      readMinutes: Math.max(1, Number.parseInt(editing.readMinutes, 10) || 5),
      publishedAt: editing.publishedAt,
      image: editing.image.trim(),
      published: editing.published,
      sections,
    }
    if (originalSlug && originalSlug !== slug) deleteArticle(originalSlug)
    saveArticle(article)
    setEditing(null)
  }

  function remove(article: Article) {
    if (!window.confirm(`Delete “${article.title}”? This cannot be undone.`)) return
    deleteArticle(article.slug)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-navy-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-relaxed text-navy-500">
          Publish practical guidance only. Do not present estimates as confirmed prices or imply guaranteed outcomes.
        </p>
        <button type="button" onClick={create} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> New article
        </button>
      </div>

      <div className="space-y-3">
        {articles.map((article) => (
          <article key={article.slug} className="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip bg-gold-50 text-gold-700">{article.category}</span>
                <span className={`chip ${article.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {article.published ? 'Published' : <><EyeOff className="h-3 w-3" /> Draft</>}
                </span>
              </div>
              <h3 className="mt-2 truncate font-display text-base font-bold text-navy-900">{article.title}</h3>
              <p className="text-[10.5px] text-navy-400">/resources/{article.slug} • {formatDate(article.publishedAt)} • {article.readMinutes} min read</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => open(article)} className="btn-outline px-3 py-1.5 text-[11px]">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button type="button" onClick={() => remove(article)} className="btn-ghost px-2.5 py-1.5 text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <AdminModal
          title={originalSlug ? 'Edit article' : 'New article'}
          description="Only publish content that has been reviewed for accuracy."
          onClose={() => setEditing(null)}
          size="wide"
        >
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="article-title"
              label="Title"
              value={editing.title}
              onChange={(value) => setEditing({ ...editing, title: value, slug: originalSlug ? editing.slug : editing.slug || slugify(value) })}
              className="sm:col-span-2"
              required
            />
            <TextField name="article-slug" label="Slug" value={editing.slug} onChange={(value) => setEditing({ ...editing, slug: slugify(value) })} hint={originalSlug ? 'Changing the slug creates a new URL. Existing links will break.' : 'Used in the article URL.'} required />
            <TextField name="article-category" label="Category" value={editing.category} onChange={(value) => setEditing({ ...editing, category: value })} required />
            <TextField name="article-date" label="Published date" type="date" value={editing.publishedAt} onChange={(value) => setEditing({ ...editing, publishedAt: value })} />
            <TextField name="article-read" label="Read time (minutes)" type="number" value={editing.readMinutes} onChange={(value) => setEditing({ ...editing, readMinutes: value })} />
            <TextField name="article-image" label="Cover image URL" value={editing.image} onChange={(value) => setEditing({ ...editing, image: value })} className="sm:col-span-2" />
            <TextareaField name="article-excerpt" label="Excerpt" value={editing.excerpt} onChange={(value) => setEditing({ ...editing, excerpt: value })} rows={2} className="sm:col-span-2" required />

            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-900">Sections</h3>
                <button type="button" onClick={() => setEditing({ ...editing, sections: [...editing.sections, { heading: '', paragraphs: '', bullets: '' }] })} className="btn-outline px-2.5 py-1.5 text-[11px]">
                  <Plus className="h-3.5 w-3.5" /> Add section
                </button>
              </div>
              <div className="space-y-4">
                {editing.sections.map((section, index) => (
                  <div key={index} className="rounded-xl border border-navy-100 bg-navy-50/40 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-navy-400">Section {index + 1}</span>
                      {editing.sections.length > 1 && (
                        <button type="button" onClick={() => setEditing({ ...editing, sections: editing.sections.filter((_, sectionIndex) => sectionIndex !== index) })} className="text-[11px] font-semibold text-red-600 hover:text-red-700">
                          Remove
                        </button>
                      )}
                    </div>
                    <TextField name={`section-heading-${index}`} label="Heading" value={section.heading} onChange={(value) => updateSection(index, { heading: value })} />
                    <TextareaField name={`section-paragraphs-${index}`} label="Paragraphs" value={section.paragraphs} onChange={(value) => updateSection(index, { paragraphs: value })} hint="Separate paragraphs with a blank line." rows={4} className="mt-3" />
                    <TextareaField name={`section-bullets-${index}`} label="Bullets (optional)" value={section.bullets} onChange={(value) => updateSection(index, { bullets: value })} hint="One per line." rows={3} className="mt-3" />
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <CheckboxRow label="Published" description="Show this article in the resource library." checked={editing.published} onChange={(checked) => setEditing({ ...editing, published: checked })} />
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

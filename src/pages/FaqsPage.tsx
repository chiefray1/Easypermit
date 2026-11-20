import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState, PageHero } from '../components/LayoutParts'
import { FaqAccordion } from '../components/FaqAccordion'
import { useContent } from '../store/content'
import { cn } from '../lib/utils'

const ORDER = ['General', 'Study Abroad', 'Visas', 'Flights & Travel', 'Fees & Payments']

export function FaqsPage() {
  const { faqs } = useContent()
  const published = faqs.filter((faq) => faq.published)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = useMemo(
    () => ['All', ...ORDER.filter((item) => published.some((faq) => faq.category === item))],
    [published],
  )
  const filtered = published.filter((faq) => {
    const matchesCategory = category === 'All' || faq.category === category
    const search = query.trim().toLowerCase()
    const matchesSearch = !search || `${faq.question} ${faq.answer}`.toLowerCase().includes(search)
    return matchesCategory && matchesSearch
  })
  const grouped = ORDER.map((group) => ({ group, items: filtered.filter((faq) => faq.category === group) })).filter(
    (entry) => entry.items.length > 0,
  )

  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Answers about study abroad, visa preparation, flights, holidays, fees and working with Easy Permit."
        path="/faqs"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: published.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <PageHero
        eyebrow="FAQs"
        title="Answers before you commit"
        intro="Clear answers about our services, limits and process. If your question is not covered, send it to us."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]}
      />

      <section className="py-14 sm:py-20">
        <div className="container-x">
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search FAQs"
                className="field pl-10"
                aria-label="Search FAQs"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition',
                    category === item ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {grouped.length > 0 ? (
            <div className="space-y-10">
              {grouped.map((group) => (
                <div key={group.group}>
                  <h2 className="mb-4 font-display text-xl font-extrabold text-navy-900">{group.group}</h2>
                  <FaqAccordion items={group.items} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching questions"
              description="Try a different keyword or category. You can also send your question directly to our team."
              icon={<Search className="h-6 w-6" />}
              action={<Link to="/contact" className="btn-primary">Ask us</Link>}
            />
          )}

          <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900">Still unsure?</h2>
              <p className="mt-1 text-[12.5px] text-body/70">Tell us what you are planning and we will point you to the right next step.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
              <Link to="/contact" className="btn-primary">Contact us</Link>
              <Link to="/get-started" className="btn-outline">Start assessment</Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

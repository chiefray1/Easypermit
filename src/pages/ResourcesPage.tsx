import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState, PageHero } from '../components/LayoutParts'
import { ArticleCard } from '../components/Cards'
import { useContent } from '../store/content'
import { cn } from '../lib/utils'

export function ResourcesPage() {
  const { articles } = useContent()
  const published = articles.filter((article) => article.published)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = useMemo(() => ['All', ...Array.from(new Set(published.map((article) => article.category)))], [published])
  const filtered = published.filter((article) => {
    const matchesCategory = category === 'All' || article.category === category
    const search = query.trim().toLowerCase()
    const matchesSearch = !search || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(search)
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Seo
        title="Study, Visa & Travel Resources"
        description="Practical guides on study destinations, visa documents, proof of funds, flights, arrival and holiday planning."
        path="/resources"
        image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Resources"
        title="Better questions lead to better decisions"
        intro="General guidance on study applications, visa preparation, funding and travel. Always verify current rules with official sources."
        image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
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
                placeholder="Search articles"
                className="field pl-10"
                aria-label="Search articles"
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

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No articles match that search"
              description="Try a different keyword or category. You can also ask us your question directly."
              action={<Link to="/contact" className="btn-primary">Ask an adviser</Link>}
              icon={<Search className="h-6 w-6" />}
            />
          )}

          <div className="mt-10 rounded-xl border border-gold-200 bg-gold-50 p-4 text-[12px] leading-relaxed text-gold-900">
            <strong className="font-bold">General information only:</strong> rules, fees and processes change. Verify
            current requirements with the relevant institution, immigration authority or travel provider before acting.
          </div>
        </div>
      </section>

      <CtaBand title="Have a question the articles do not answer?" intro="Send it to us. We will point you to the right next step." />
    </>
  )
}

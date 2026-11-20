import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Share2 } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState } from '../components/LayoutParts'
import { ArticleCard } from '../components/Cards'
import { useContent } from '../store/content'
import { formatDate } from '../lib/utils'
import { useState } from 'react'
import { track } from '../lib/analytics'

export function ArticlePage() {
  const { slug } = useParams()
  const { articles } = useContent()
  const article = articles.find((item) => item.slug === slug && item.published)
  const [copied, setCopied] = useState(false)

  if (!article) {
    return (
      <div className="container-x py-24">
        <EmptyState
          title="Article not found"
          description="This article may have moved or is under review. Browse the resource library for current guides."
          action={<Link to="/resources" className="btn-primary">Back to resources</Link>}
        />
      </div>
    )
  }

  const related = articles.filter((item) => item.published && item.slug !== article.slug).slice(0, 3)

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: article?.title ?? '', url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }
      track('article_share', { slug: article?.slug })
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <Seo
        title={article.title}
        description={article.excerpt}
        path={`/resources/${article.slug}`}
        image={article.image}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          image: article.image,
          author: { '@type': 'Organization', name: 'Easy Permit Travel Services' },
          publisher: { '@type': 'Organization', name: 'Easy Permit Travel Services' },
        }}
      />

      <article>
        <header className="relative overflow-hidden bg-navy-950 pb-14 pt-10 sm:pb-20 sm:pt-14">
          <div className="absolute inset-0">
            <img src={article.image} alt="" className="h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/95 to-navy-900/50" />
          </div>
          <div className="container-x relative">
            <Link to="/resources" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/55 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> All resources
            </Link>
            <div className="mt-5 max-w-3xl">
              <span className="eyebrow-dark mb-4">{article.category}</span>
              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">{article.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-white/45">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(article.publishedAt)}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {article.readMinutes} min read</span>
                <button type="button" onClick={share} className="inline-flex items-center gap-1.5 font-semibold text-gold-300 hover:text-gold-200">
                  <Share2 className="h-3.5 w-3.5" /> {copied ? 'Link copied' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container-x py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-9">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl font-extrabold text-navy-900">{section.heading}</h2>
                  <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-body/80">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2.5 text-[14px] leading-relaxed text-body/75">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-gold-200 bg-gold-50 p-5 text-[12.5px] leading-relaxed text-gold-900">
              <strong className="font-bold">Verify before you act.</strong> This article is general guidance, not legal,
              immigration or financial advice. Requirements change, so confirm current details with official sources or a
              qualified professional.
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-navy-900 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-bold text-white">Want to apply this to your own plan?</p>
                <p className="mt-1 text-[12px] text-white/55">Start a short assessment or book a consultation.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/get-started" className="btn-gold">Start assessment</Link>
                <Link to="/contact" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-x">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="section-title">Continue reading</h2>
              <Link to="/resources" className="hidden items-center gap-1 text-xs font-bold text-navy-700 sm:inline-flex">
                All resources <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((item) => <ArticleCard key={item.slug} article={item} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  )
}

import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, CheckCircle2, GraduationCap, Info, Landmark, ScrollText, Wallet } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState, PageHero } from '../components/LayoutParts'
import { DestinationCard } from '../components/Cards'
import { FaqAccordion } from '../components/FaqAccordion'
import { AssessmentForm } from '../components/forms/AssessmentForm'
import { useContent } from '../store/content'

export function DestinationDetailPage() {
  const { slug } = useParams()
  const { destinations, faqs } = useContent()
  const destination = destinations.find((item) => item.slug === slug && item.published)

  if (!destination) {
    return (
      <div className="container-x py-24">
        <EmptyState
          title="Destination guide not found"
          description="This guide may have been moved or is under review. Browse the available study destinations instead."
          icon={<GraduationCap className="h-6 w-6" />}
          action={<Link to="/study-abroad/destinations" className="btn-primary">View destinations</Link>}
        />
      </div>
    )
  }

  const related = destinations.filter((item) => item.published && item.slug !== destination.slug).slice(0, 3)
  const studyFaqs = faqs.filter((faq) => faq.published && faq.category === 'Study Abroad').slice(0, 4)

  return (
    <>
      <Seo
        title={`Study in ${destination.country} | Courses, Requirements & Visa Steps`}
        description={`${destination.intro} Explore study levels, requirements, intakes and visa preparation for ${destination.country}.`}
        path={`/study-abroad/destinations/${destination.slug}`}
        image={destination.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `Study in ${destination.country}`,
          description: destination.intro,
          about: destination.country,
        }}
      />
      <PageHero
        eyebrow={`Study in ${destination.country}`}
        title={`${destination.flag} Study in ${destination.country}`}
        intro={destination.intro}
        image={destination.image}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Study Abroad', href: '/study-abroad' },
          { label: 'Destinations', href: '/study-abroad/destinations' },
          { label: destination.country },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/get-started" className="btn-gold">Check my options</Link>
          <Link to="/contact" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
            Ask a question
          </Link>
        </div>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <div className="space-y-10">
            <div>
              <div className="flex flex-wrap gap-2">
                {destination.highlights.map((highlight) => (
                  <span key={highlight} className="chip bg-gold-50 text-gold-800">{highlight}</span>
                ))}
              </div>
              <h2 className="mt-6 font-display text-2xl font-extrabold text-navy-900">Why students consider {destination.country}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {destination.reasons.map((reason) => (
                  <div key={reason} className="flex gap-2.5 text-[13px] leading-relaxed text-body/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gold-600" />
                <h2 className="font-display text-xl font-bold text-navy-900">Popular course areas</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {destination.courses.map((course) => (
                  <span key={course} className="rounded-lg bg-navy-50 px-3 py-1.5 text-[12px] font-medium text-navy-700">{course}</span>
                ))}
              </div>
              <h3 className="mt-6 text-sm font-bold text-navy-900">Study levels</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {destination.studyLevels.map((level) => (
                  <span key={level} className="chip border border-navy-100 bg-white text-navy-600">{level}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-gold-600" />
                <h2 className="font-display text-2xl font-extrabold text-navy-900">Typical requirements</h2>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-body/70">
                Requirements vary by institution, programme and your nationality. Treat this as a preparation checklist,
                not a final list.
              </p>
              <ul className="mt-4 space-y-2.5">
                {destination.requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-2.5 text-[13px] leading-relaxed text-body/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gold-200 bg-gold-50 p-6">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-gold-700" />
                <h2 className="font-display text-xl font-bold text-navy-900">Tuition and living costs</h2>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-gold-900/85">{destination.expensesNote}</p>
              <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-gold-800/75">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                We do not publish unverified price figures. Current costs are confirmed from official sources during your
                planning.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="card p-6">
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-gold-600" />
                  <h2 className="font-display text-lg font-bold text-navy-900">Scholarships and funding</h2>
                </div>
                <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-body/75">
                  {destination.scholarships.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-gold-600" />
                  <h2 className="font-display text-lg font-bold text-navy-900">Intakes</h2>
                </div>
                <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-body/75">
                  {destination.intakes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] text-navy-400">Deadlines are often earlier than teaching start dates.</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-navy-900">Visa preparation steps</h2>
              <ol className="mt-4 space-y-3">
                {destination.visaSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-xl border border-navy-100 bg-white p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900 text-[11px] font-bold text-gold-300">
                      {index + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-body/75">{step}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-[11px] leading-relaxed text-navy-400">
                Visa rules, fees and processing times change. Confirm current requirements with the official immigration
                authority before submitting.
              </p>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-mist p-3 sm:p-4">
              <div className="px-2 pb-3 pt-1">
                <h2 className="font-display text-xl font-bold text-navy-900">Check your options for {destination.country}</h2>
                <p className="mt-1 text-[12.5px] text-body/70">A short assessment helps us understand your profile and next step.</p>
              </div>
              <AssessmentForm service="study-abroad" source={`destination_${destination.slug}`} />
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-navy-900">At a glance</h2>
              <dl className="mt-4 space-y-3 text-[12.5px]">
                <div className="flex justify-between gap-3 border-b border-navy-50 pb-3">
                  <dt className="text-navy-400">Destination</dt>
                  <dd className="font-semibold text-navy-800">{destination.flag} {destination.country}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-navy-50 pb-3">
                  <dt className="text-navy-400">Main intake</dt>
                  <dd className="max-w-[60%] text-right font-semibold text-navy-800">{destination.intakes[0]}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-navy-50 pb-3">
                  <dt className="text-navy-400">Study levels</dt>
                  <dd className="max-w-[60%] text-right font-semibold text-navy-800">{destination.studyLevels.length} options</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy-400">Content review</dt>
                  <dd className="font-semibold text-navy-800">{destination.lastVerified ?? 'Pending'}</dd>
                </div>
              </dl>
              <Link to="/get-started" className="btn-primary mt-5 w-full">Start assessment</Link>
              <Link to="/contact" className="btn-outline mt-2 w-full">Talk to an adviser</Link>
            </div>
            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-300">Important</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/65">
                This guide is general information. Course availability, fees, work rights and visa rules must be verified
                with the institution and official authorities.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {studyFaqs.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-x">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="eyebrow mb-3">Study FAQs</span>
                <h2 className="section-title">Questions to ask before applying</h2>
              </div>
              <Link to="/faqs" className="btn-outline">All FAQs</Link>
            </div>
            <FaqAccordion items={studyFaqs} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-x">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="section-title">Compare another destination</h2>
              <Link to="/study-abroad/destinations" className="hidden items-center gap-1 text-xs font-bold text-navy-700 sm:inline-flex">
                All guides <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => <DestinationCard key={item.slug} destination={item} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={`Planning to study in ${destination.country}?`} />
    </>
  )
}

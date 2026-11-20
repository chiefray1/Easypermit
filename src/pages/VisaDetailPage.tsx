import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock3, FileText, Info, ShieldCheck, Stamp } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState, PageHero } from '../components/LayoutParts'
import { AssessmentForm } from '../components/forms/AssessmentForm'
import { VISA_SERVICES } from '../data/visas'

export function VisaDetailPage() {
  const { slug } = useParams()
  const service = VISA_SERVICES.find((item) => item.slug === slug)

  if (!service) {
    return (
      <div className="container-x py-24">
        <EmptyState
          title="Visa service not found"
          description="The page may have moved. Browse the visa categories or contact us for help identifying the right route."
          icon={<Stamp className="h-6 w-6" />}
          action={<Link to="/visa-services" className="btn-primary">View visa services</Link>}
        />
      </div>
    )
  }

  const related = VISA_SERVICES.filter((item) => item.slug !== service.slug).slice(0, 4)

  return (
    <>
      <Seo
        title={`${service.name} | Requirements & Preparation`}
        description={service.summary}
        path={`/visa-services/${service.slug}`}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: service.summary,
          provider: { '@type': 'Organization', name: 'Easy Permit Travel Services' },
        }}
      />
      <PageHero
        eyebrow="Visa support"
        title={service.name}
        intro={service.summary}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Visas', href: '/visa-services' },
          { label: service.shortName },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/get-started" className="btn-gold">Start visa assessment</Link>
          <Link to="/contact" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
            Ask about my case
          </Link>
        </div>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div className="space-y-9">
            <div>
              <p className="text-[15px] leading-relaxed text-body/80">{service.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.forWho.map((item) => (
                  <span key={item} className="chip bg-navy-50 text-navy-700">{item}</span>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold-600" />
                <h2 className="font-display text-xl font-bold text-navy-900">Documents usually prepared</h2>
              </div>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {service.documents.map((document) => (
                  <li key={document} className="flex gap-2.5 text-[12.5px] leading-relaxed text-body/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {document}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] leading-relaxed text-navy-400">
                This is a preparation guide, not an official checklist. Confirm the exact documents required for your
                nationality, destination and purpose.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-navy-900">How the process works</h2>
              <ol className="mt-4 space-y-3">
                {service.process.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-xl border border-navy-100 bg-white p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900 text-[11px] font-bold text-gold-300">
                      {index + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-body/75">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-2 text-amber-800">
                  <Info className="h-4 w-4" />
                  <h2 className="text-sm font-bold">Important notes</h2>
                </div>
                <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-amber-900/80">
                  {service.notes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-navy-100 bg-white p-5">
                <div className="flex items-center gap-2 text-navy-800">
                  <Clock3 className="h-4 w-4 text-gold-600" />
                  <h2 className="text-sm font-bold">Timing</h2>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-body/75">{service.timeline}</p>
                <Link to="/resources" className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-navy-700 hover:text-gold-700">
                  Read visa guides <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-mist p-3 sm:p-4">
              <div className="px-2 pb-3 pt-1">
                <h2 className="font-display text-xl font-bold text-navy-900">Tell us about your {service.shortName.toLowerCase()} plan</h2>
                <p className="mt-1 text-[12.5px] text-body/70">We will review your answers and explain the most useful next step.</p>
              </div>
              <AssessmentForm service="visa-services" source={`visa_${service.slug}`} />
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold-600" />
                <h2 className="font-display text-lg font-bold text-navy-900">At a glance</h2>
              </div>
              <dl className="mt-4 space-y-3 text-[12.5px]">
                <div className="flex justify-between gap-3 border-b border-navy-50 pb-3">
                  <dt className="text-navy-400">Category</dt>
                  <dd className="font-semibold text-navy-800">Visa support</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-navy-50 pb-3">
                  <dt className="text-navy-400">Decision maker</dt>
                  <dd className="max-w-[55%] text-right font-semibold text-navy-800">Relevant authority</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy-400">Guaranteed?</dt>
                  <dd className="font-semibold text-red-600">No</dd>
                </div>
              </dl>
              <Link to="/contact" className="btn-primary mt-5 w-full">Book a consultation</Link>
            </div>
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-navy-900">Other visa services</h2>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/visa-services/${item.slug}`} className="flex items-center justify-between gap-3 rounded-lg px-1 py-2 text-[12.5px] font-medium text-navy-600 hover:text-navy-900">
                      {item.shortName} <ArrowRight className="h-3.5 w-3.5 text-navy-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand title={`Need help with your ${service.shortName.toLowerCase()} application?`} />
    </>
  )
}

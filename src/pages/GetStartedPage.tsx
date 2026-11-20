import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarCheck, GraduationCap, Plane, ShieldCheck, Stamp, Sun } from 'lucide-react'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/LayoutParts'
import { AssessmentForm } from '../components/forms/AssessmentForm'
import { FlightForm } from '../components/forms/FlightForm'
import { cn } from '../lib/utils'

type TabKey = 'study' | 'visa' | 'flight' | 'holiday'

const TABS: { key: TabKey; label: string; icon: typeof GraduationCap }[] = [
  { key: 'study', label: 'Study abroad', icon: GraduationCap },
  { key: 'visa', label: 'Visa', icon: Stamp },
  { key: 'flight', label: 'Flights', icon: Plane },
  { key: 'holiday', label: 'Holiday', icon: Sun },
]

const PARAM_MAP: Record<string, TabKey> = {
  study: 'study',
  'study-abroad': 'study',
  visa: 'visa',
  'visa-services': 'visa',
  flight: 'flight',
  'flight-booking': 'flight',
  holiday: 'holiday',
  'tours-holidays': 'holiday',
}

export function GetStartedPage() {
  const [params, setParams] = useSearchParams()
  const initial = PARAM_MAP[params.get('service') ?? ''] ?? 'study'
  const [tab, setTab] = useState<TabKey>(initial)

  function choose(next: TabKey) {
    setTab(next)
    const nextParams = new URLSearchParams(params)
    nextParams.set('service', next)
    setParams(nextParams, { replace: true })
  }

  return (
    <>
      <Seo
        title="Start Your Free Assessment"
        description="Choose study abroad, visa, flight or holiday support and complete a short assessment. No payment required to start."
        path="/get-started"
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Free assessment"
        title="What are you planning?"
        intro="Choose the closest option and answer a few structured questions. We will use your answers to recommend the most useful next step."
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Get Started' }]}
        size="compact"
      />

      <section className="py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-navy-100 bg-white p-2 shadow-card sm:grid-cols-4">
              {TABS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => choose(item.key)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl px-3 py-3 text-[11.5px] font-semibold transition sm:flex-row sm:justify-center',
                    tab === item.key ? 'bg-navy-900 text-white shadow-sm' : 'text-navy-600 hover:bg-navy-50',
                  )}
                  aria-pressed={tab === item.key}
                >
                  <item.icon className={cn('h-4 w-4', tab === item.key ? 'text-gold-300' : 'text-gold-600')} />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-navy-100 bg-mist p-3 sm:p-4">
              {tab === 'study' && <AssessmentForm service="study-abroad" source="get_started_study" />}
              {tab === 'visa' && <AssessmentForm service="visa-services" source="get_started_visa" />}
              {tab === 'holiday' && <AssessmentForm service="tours-holidays" source="get_started_holiday" />}
              {tab === 'flight' && (
                <div className="rounded-2xl border border-navy-100 bg-white p-5 sm:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-300">
                      <Plane className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-bold text-navy-900">Request flight options</h2>
                      <p className="text-[11.5px] text-navy-400">Share your route, dates and priorities.</p>
                    </div>
                  </div>
                  <FlightForm source="get_started_flight" />
                </div>
              )}
            </div>
            <p className="mt-4 text-center text-[11px] text-navy-400">
              Prefer to speak first? <Link to="/contact" className="font-semibold text-navy-700 underline decoration-gold-400 underline-offset-2">Book a consultation</Link>.
            </p>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card p-6">
              <span className="eyebrow mb-3">What happens next</span>
              <h2 className="font-display text-xl font-bold text-navy-900">From answers to a clear next step</h2>
              <div className="mt-4 space-y-4">
                {[
                  { icon: CalendarCheck, title: 'We review your answers', text: 'A team member checks your goal, timeline and support needs.' },
                  { icon: ShieldCheck, title: 'We confirm scope', text: 'If we can help, we explain the service, fees and documents required.' },
                  { icon: GraduationCap, title: 'You decide', text: 'No payment is required to submit an assessment. You choose whether to proceed.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-[13px] font-bold text-navy-900">{item.title}</h3>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-body/70">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-300">Good to know</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/65">
                We do not guarantee admission, visa approval, flight availability or travel outcomes. We help you prepare
                and make informed decisions.
              </p>
              <Link to="/resources" className="mt-4 inline-block text-xs font-bold text-gold-300 hover:text-gold-200">
                Read the resource library →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

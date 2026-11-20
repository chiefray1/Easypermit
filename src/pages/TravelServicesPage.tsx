import { Link } from 'react-router-dom'
import { ArrowRight, BaggageClaim, CalendarDays, MapPin, Plane, Sun } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, PageHero, SectionHeading } from '../components/LayoutParts'
import { FaqAccordion } from '../components/FaqAccordion'
import { useContent } from '../store/content'
import { PROCESS_STEPS } from '../data/site'

export function TravelServicesPage() {
  const { faqs } = useContent()
  const travelFaqs = faqs.filter((faq) => faq.published && faq.category === 'Flights & Travel').slice(0, 5)

  return (
    <>
      <Seo
        title="Flight Booking, Tours & Holiday Planning"
        description="Flight reservations and personalised holiday planning for students, families, business travellers and groups."
        path="/travel-services"
        image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Travel services"
        title="The flight and the trip, planned with context"
        intro="Whether you are flying to university, visiting family or planning a holiday, the details matter: baggage, connections, dates, documents and flexibility."
        image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Travel Services' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/flight-booking" className="btn-gold">Request flight options</Link>
          <Link to="/tours-holidays" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
            Plan a holiday
          </Link>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Two ways to travel"
            title="Choose the support that fits the trip"
            intro="Flights can be booked on their own or coordinated with a holiday plan. Both start with a clear brief."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <Link to="/flight-booking" className="group relative overflow-hidden rounded-3xl bg-navy-950 p-7 text-white sm:p-9">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold-500/15 blur-2xl" />
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-gold-300">
                <Plane className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-extrabold">Flight booking</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                Compare route, fare flexibility, baggage and connection details before you commit. Useful for students,
                family visits and business travel.
              </p>
              <ul className="mt-5 space-y-2 text-[12.5px] text-white/65">
                <li className="flex items-center gap-2"><BaggageClaim className="h-4 w-4 text-gold-400" /> Baggage and connection guidance</li>
                <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold-400" /> Flexible-date comparison</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-400" /> Airport and transfer context</li>
              </ul>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-gold-300">
                Request options <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link to="/tours-holidays" className="group relative overflow-hidden rounded-3xl bg-gold-500 p-7 text-navy-950 sm:p-9">
              <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-950 text-gold-300">
                <Sun className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-extrabold">Tours & holidays</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-900/75">
                Share your dates, travellers and travel style. We shape a proposal around what you actually want, not a
                fixed catalogue.
              </p>
              <ul className="mt-5 space-y-2 text-[12.5px] text-navy-900/70">
                <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Dates and duration planning</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Destination and pace fit</li>
                <li className="flex items-center gap-2"><Plane className="h-4 w-4" /> Flights and stays coordinated</li>
              </ul>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-navy-950">
                Start a holiday brief <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title="A simple travel brief, then options" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="card p-6">
                <span className="font-display text-3xl font-extrabold text-gold-300">0{index + 1}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-body/70">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-navy-100 bg-navy-50 p-4 text-[12px] leading-relaxed text-navy-600">
            <strong className="font-bold text-navy-800">Before you book:</strong> check passport validity, visa or entry
            requirements, baggage rules and fare conditions. Airline and immigration rules can change.
          </div>
        </div>
      </section>

      {travelFaqs.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="eyebrow mb-4">Travel FAQs</span>
              <h2 className="section-title">Practical questions</h2>
              <Link to="/faqs" className="btn-outline mt-6">All FAQs</Link>
            </div>
            <FaqAccordion items={travelFaqs} />
          </div>
        </section>
      )}

      <CtaBand title="Tell us about the trip you are planning" intro="Flights, family visits or a holiday — start with the dates and destination." />
    </>
  )
}

import { Link } from 'react-router-dom'
import { BadgeCheck, Clock3, Luggage, Plane, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, PageHero } from '../components/LayoutParts'
import { FaqAccordion } from '../components/FaqAccordion'
import { FlightForm } from '../components/forms/FlightForm'
import { useContent } from '../store/content'

export function FlightBookingPage() {
  const { faqs } = useContent()
  const flightFaqs = faqs.filter((faq) => faq.published && faq.category === 'Flights & Travel').slice(0, 4)

  return (
    <>
      <Seo
        title="Flight Booking & Route Guidance"
        description="Request flight options for study, family visits or business travel, with guidance on baggage, connections and fare flexibility."
        path="/flight-booking"
        image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Flight booking"
        title="A fare is only useful if the trip actually works"
        intro="We help you compare the route, timing, baggage and flexibility behind the price — so you can choose with fewer surprises."
        image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Travel', href: '/travel-services' },
          { label: 'Flight Booking' },
        ]}
      />

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-6">
            <div>
              <span className="eyebrow mb-4">What we check</span>
              <h2 className="section-title">Practical details before price</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-body/75">
                Send us your route and dates. We will review the options and flag the details that often matter more than
                the headline fare.
              </p>
            </div>
            {[
              { icon: Luggage, title: 'Baggage allowance', text: 'Checked and cabin limits, plus the cost of adding a bag later.' },
              { icon: Clock3, title: 'Connection time', text: 'Terminal changes, immigration and realistic transfer buffers.' },
              { icon: ShieldCheck, title: 'Fare conditions', text: 'Change, cancellation and refund rules before you pay.' },
              { icon: BadgeCheck, title: 'Arrival logistics', text: 'Airport distance and how it affects your onward travel.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-body/70">{item.text}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-gold-200 bg-gold-50 p-4 text-[12px] leading-relaxed text-gold-900">
              For visa applications, check whether the destination accepts a reservation or requires a paid ticket before
              you make a non-refundable purchase.
            </div>
            <Link to="/tours-holidays" className="inline-flex items-center gap-1 text-xs font-bold text-navy-700 hover:text-gold-700">
              Planning a holiday instead? See holiday support →
            </Link>
          </div>

          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-300">
                <Plane className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-navy-900">Request flight options</h2>
                <p className="text-[11.5px] text-navy-400">Share your route and priorities. No payment to enquire.</p>
              </div>
            </div>
            <FlightForm source="flight_booking_page" />
          </div>
        </div>
      </section>

      {flightFaqs.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="eyebrow mb-4">Flight FAQs</span>
              <h2 className="section-title">Before you book</h2>
              <Link to="/faqs" className="btn-outline mt-6">All FAQs</Link>
            </div>
            <FaqAccordion items={flightFaqs} />
          </div>
        </section>
      )}

      <CtaBand title="Have your route and dates ready?" intro="Send the details and we will follow up with practical options." />
    </>
  )
}

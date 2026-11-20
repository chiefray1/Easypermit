import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Sun } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState, PageHero, SectionHeading } from '../components/LayoutParts'
import { PackageCard } from '../components/Cards'
import { AssessmentForm } from '../components/forms/AssessmentForm'
import { FaqAccordion } from '../components/FaqAccordion'
import { useContent } from '../store/content'

export function ToursHolidaysPage() {
  const { packages, faqs } = useContent()
  const publishedPackages = packages.filter((holidayPackage) => holidayPackage.published)
  const travelFaqs = faqs.filter((faq) => faq.published && faq.category === 'Flights & Travel').slice(0, 4)

  return (
    <>
      <Seo
        title="Tours & Holiday Planning"
        description="Personalised holiday planning for individuals, couples, families and groups, with flights, stays and activities coordinated around your brief."
        path="/tours-holidays"
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Tours & holidays"
        title="A holiday proposal shaped around your brief"
        intro="Tell us who is travelling, when, and what you want from the trip. We will help turn that into a practical plan with clear pricing and conditions."
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Travel', href: '/travel-services' },
          { label: 'Tours & Holidays' },
        ]}
      >
        <Link to="/get-started" className="btn-gold">Start holiday assessment</Link>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Curated options"
            title="Published packages, when they are ready"
            intro="We only publish holiday packages with verified details and clear terms. If nothing is listed, we can still build a personalised proposal."
          />
          {publishedPackages.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedPackages.map((holidayPackage) => (
                <PackageCard key={holidayPackage.id} holidayPackage={holidayPackage} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No public packages are listed right now"
              description="Rather than show unverified prices, we prepare holiday proposals individually. Share your dates and travel style and we will respond with options."
              icon={<Sun className="h-6 w-6" />}
              action={<Link to="/get-started" className="btn-primary">Request a holiday proposal</Link>}
            />
          )}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="eyebrow mb-4">Holiday brief</span>
            <h2 className="section-title">Start with how you want the trip to feel</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body/75">
              A good holiday is not just a list of attractions. Tell us whether you want rest, adventure, family time,
              celebration or a mix, and we will shape the pace around that.
            </p>
            <div className="mt-7 space-y-4">
              {[
                { title: 'Dates and flexibility', text: 'We check whether shifting your dates opens better value or a calmer itinerary.' },
                { title: 'Travellers and needs', text: 'Adults, children, accessibility needs and group dynamics all affect the plan.' },
                { title: 'Budget and priorities', text: 'We clarify what the budget must cover and where it is worth spending more.' },
                { title: 'Documents and entry rules', text: 'Passport, visa and health requirements are checked before you commit.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-body/70">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-xl border border-navy-100 bg-navy-50 p-4 text-[12px] leading-relaxed text-navy-600">
              Package prices, availability and inclusions are confirmed in a written proposal. We do not display invented
              prices or unverified offers.
            </div>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-mist p-3 sm:p-4">
            <AssessmentForm service="tours-holidays" source="tours_holidays_page" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
              alt="Beach holiday destination"
              className="h-[360px] w-full object-cover"
            />
          </div>
          <div>
            <span className="eyebrow mb-4">What happens next</span>
            <h2 className="section-title">A proposal, not pressure</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body/75">
              After your assessment, we review your brief and come back with questions or options. You decide whether to
              proceed. Any fees, deposits and cancellation terms are confirmed before payment.
            </p>
            <Link to="/contact" className="btn-outline mt-6">
              Ask a holiday question <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {travelFaqs.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="eyebrow mb-4">Travel FAQs</span>
              <h2 className="section-title">Planning questions</h2>
              <Link to="/faqs" className="btn-outline mt-6">All FAQs</Link>
            </div>
            <FaqAccordion items={travelFaqs} />
          </div>
        </section>
      )}

      <CtaBand title="Where would you like to go?" intro="Tell us the dream and the constraints. We will help with the practical version." />
    </>
  )
}

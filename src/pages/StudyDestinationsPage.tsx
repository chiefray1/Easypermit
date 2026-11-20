import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, GraduationCap } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState, PageHero, SectionHeading } from '../components/LayoutParts'
import { DestinationCard } from '../components/Cards'
import { useContent } from '../store/content'

export function StudyDestinationsPage() {
  const { destinations } = useContent()
  const published = destinations.filter((destination) => destination.published)

  return (
    <>
      <Seo
        title="Study Destinations | Compare the UK, Germany, Canada, USA, Malaysia & Ireland"
        description="Compare study destinations by study levels, intakes, requirements and visa steps, with practical guidance from Easy Permit."
        path="/study-abroad/destinations"
        image="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Study destinations"
        title="Compare countries with the full picture in view"
        intro="Use these guides to understand the shape of each destination: study levels, typical requirements, intakes and visa preparation. Details change — confirm current rules before you commit."
        image="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Study Abroad', href: '/study-abroad' }, { label: 'Destinations' }]}
      >
        <Link to="/get-started" className="btn-gold">Get a personalised shortlist</Link>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          {published.length > 0 ? (
            <>
              <SectionHeading
                eyebrow="Country guides"
                title="Where would you like to study?"
                intro="Open a guide for requirements, course areas, intakes and the questions to resolve before applying."
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {published.map((destination) => (
                  <DestinationCard key={destination.slug} destination={destination} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Destination guides are being updated"
              description="Our destination content is under review. Contact us and we will share current guidance for your preferred country."
              action={<Link to="/contact" className="btn-primary">Contact an adviser</Link>}
              icon={<GraduationCap className="h-6 w-6" />}
            />
          )}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="At a glance"
            title="A starting comparison"
            intro="This table is a planning aid, not a substitute for official requirements. Confirm every detail with the institution and immigration authority."
          />
          <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-navy-950 text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">Destination</th>
                  <th className="px-5 py-4 font-semibold">Study levels</th>
                  <th className="px-5 py-4 font-semibold">Typical intakes</th>
                  <th className="px-5 py-4 font-semibold">Guide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {published.map((destination) => (
                  <tr key={destination.slug} className="align-top hover:bg-navy-50/40">
                    <td className="px-5 py-4">
                      <p className="font-bold text-navy-900">{destination.flag} {destination.country}</p>
                      <p className="mt-1 text-[11px] text-navy-400">Review date pending</p>
                    </td>
                    <td className="px-5 py-4 text-[12.5px] text-body/75">{destination.studyLevels.slice(0, 3).join(' • ')}</td>
                    <td className="px-5 py-4 text-[12.5px] text-body/75">
                      <span className="inline-flex items-start gap-1.5">
                        <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                        {destination.intakes[0]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link to={`/study-abroad/destinations/${destination.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-navy-800 hover:text-gold-700">
                        Read guide <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-navy-400">
            Course availability, tuition, living costs, work rules and visa requirements change. Always verify current
            information from official sources.
          </p>
        </div>
      </section>

      <CtaBand
        title="Not sure which destination fits?"
        intro="Tell us your budget, grades and goals. We will help you compare realistic options."
      />
    </>
  )
}

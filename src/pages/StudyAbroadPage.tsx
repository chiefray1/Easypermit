import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, GraduationCap, Plane, Wallet } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, PageHero, SectionHeading } from '../components/LayoutParts'
import { DestinationCard } from '../components/Cards'
import { FaqAccordion } from '../components/FaqAccordion'
import { AssessmentForm } from '../components/forms/AssessmentForm'
import { useContent } from '../store/content'
import { PROCESS_STEPS } from '../data/site'

export function StudyAbroadPage() {
  const { destinations, faqs } = useContent()
  const publishedDestinations = destinations.filter((destination) => destination.published)
  const studyFaqs = faqs.filter((faq) => faq.published && faq.category === 'Study Abroad').slice(0, 5)

  return (
    <>
      <Seo
        title="Study Abroad Guidance, Applications & Pre-departure Support"
        description="Compare study destinations, shortlist courses, prepare applications and plan your move abroad with structured guidance from Easy Permit."
        path="/study-abroad"
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Study abroad"
        title="A study plan that starts with your reality"
        intro="Country, course, cost and timing all matter. We help you compare options, prepare a credible application and understand what happens after the offer."
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Study Abroad' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/get-started" className="btn-gold">Start study assessment</Link>
          <Link to="/study-abroad/destinations" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
            Compare destinations
          </Link>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="eyebrow mb-4">What support looks like</span>
            <h2 className="section-title">From “I think I want to study abroad” to a clear application plan</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body/75">
              We do not start with a university list. We start with your qualifications, budget, preferred start date and
              what you want the qualification to do for you.
            </p>
            <div className="mt-7 space-y-5">
              {[
                {
                  icon: GraduationCap,
                  title: 'Course and institution shortlisting',
                  text: 'Compare programmes against your academic profile, budget and career direction, including realistic backups.',
                },
                {
                  icon: CheckCircle2,
                  title: 'Application preparation',
                  text: 'Organise transcripts, statements, references and institution forms with a checklist and consistency review.',
                },
                {
                  icon: Plane,
                  title: 'Offer to arrival',
                  text: 'Plan acceptance, deposit, visa evidence, accommodation questions and pre-departure tasks.',
                },
                {
                  icon: Wallet,
                  title: 'Funding and cost planning',
                  text: 'Understand the full cost picture and where scholarships or sponsors may fit — without promising awards.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-body/70">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-gold-200 bg-gold-50 p-4 text-[12.5px] leading-relaxed text-gold-900">
              <strong className="font-bold">No guarantees:</strong> admission decisions belong to institutions and visa
              decisions belong to immigration authorities. We help you prepare well; we do not control the outcome.
            </div>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-mist p-3 sm:p-4">
            <AssessmentForm service="study-abroad" source="study_abroad_page" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Destinations"
            title="Study destinations we currently cover"
            intro="Each guide explains study levels, typical requirements, intakes and visa steps. Confirm current rules before applying."
            action={<Link to="/study-abroad/destinations" className="btn-outline">View all guides</Link>}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {publishedDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="The process" title="Four stages, fewer surprises" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="card p-6">
                <span className="font-display text-3xl font-extrabold text-gold-300">0{index + 1}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-body/70">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/get-started" className="btn-primary">
              Start with your study goal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {studyFaqs.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="eyebrow mb-4">Study FAQs</span>
              <h2 className="section-title">Questions students ask first</h2>
              <Link to="/faqs" className="btn-outline mt-6">All FAQs</Link>
            </div>
            <FaqAccordion items={studyFaqs} />
          </div>
        </section>
      )}

      <CtaBand
        title="Let’s build a study shortlist around your profile"
        intro="Complete the study assessment and we will review your goals, timing and support needs."
      />
    </>
  )
}

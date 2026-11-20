import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, GraduationCap, HeartHandshake, Plane, ShieldCheck, Stamp, Stethoscope, UserRound } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, PageHero, SectionHeading } from '../components/LayoutParts'
import { FaqAccordion } from '../components/FaqAccordion'
import { AssessmentForm } from '../components/forms/AssessmentForm'
import { VISA_SERVICES } from '../data/visas'
import { useContent } from '../store/content'
import { PROCESS_STEPS } from '../data/site'

const ICONS = {
  'student-visa': GraduationCap,
  'visitor-visa': UserRound,
  'family-visit': HeartHandshake,
  'medical-visa': Stethoscope,
  'tourist-visa': Plane,
  'business-visa': Briefcase,
  'work-visa': Stamp,
}

export function VisaServicesPage() {
  const { faqs } = useContent()
  const visaFaqs = faqs.filter((faq) => faq.published && faq.category === 'Visas').slice(0, 5)

  return (
    <>
      <Seo
        title="Visa Consultancy & Application Preparation"
        description="Structured support for student, tourist, business, family visit, medical and visitor visa applications, with document checks and honest guidance."
        path="/visa-services"
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Visa consultancy"
        title="Prepare a coherent application, not just a folder of documents"
        intro="Visa decisions are made by authorities. Our role is to help you understand the requirements, prepare credible evidence and avoid avoidable inconsistencies."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Visas' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/get-started" className="btn-gold">Start visa assessment</Link>
          <Link to="/contact" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
            Ask about your case
          </Link>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Visa categories"
            title="Support for the route you are taking"
            intro="Requirements vary by destination, nationality and purpose. Choose the closest category and we will confirm whether it fits."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {VISA_SERVICES.map((service) => {
              const Icon = ICONS[service.slug as keyof typeof ICONS] ?? ShieldCheck
              return (
                <Link
                  key={service.slug}
                  to={`/visa-services/${service.slug}`}
                  className="group card flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50 text-navy-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{service.name}</h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-body/70">{service.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-gold-700">
                    View details <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
            <div className="card flex flex-col justify-between bg-navy-900 p-6 text-white">
              <div>
                <ShieldCheck className="h-6 w-6 text-gold-300" />
                <h3 className="mt-4 font-display text-lg font-bold">Not sure which visa?</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                  Tell us your purpose and destination. We will point you to the closest route and explain what to check.
                </p>
              </div>
              <Link to="/contact" className="btn-gold mt-5 w-full">Ask an adviser</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="eyebrow mb-4">How we help</span>
            <h2 className="section-title">A disciplined approach to a high-stakes application</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body/75">
              A visa application is a structured argument: purpose, ability, funding and intent must line up. We help you
              review that story before you pay official fees or attend an appointment.
            </p>
            <div className="mt-7 space-y-4">
              {PROCESS_STEPS.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-gold-300">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">{step.title}</h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-body/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-xl border border-red-100 bg-red-50 p-4 text-[12px] leading-relaxed text-red-800">
              <strong className="font-bold">No guarantees:</strong> We do not sell visas, influence decisions or promise
              approval. Complex immigration matters may require a qualified immigration lawyer.
            </div>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-mist p-3 sm:p-4">
            <AssessmentForm service="visa-services" source="visa_services_page" />
          </div>
        </div>
      </section>

      {visaFaqs.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="eyebrow mb-4">Visa FAQs</span>
              <h2 className="section-title">Before you apply</h2>
              <Link to="/faqs" className="btn-outline mt-6">All FAQs</Link>
            </div>
            <FaqAccordion items={visaFaqs} />
          </div>
        </section>
      )}

      <CtaBand title="Get a second pair of eyes on your visa plan" intro="Share your destination, purpose and timeline. We will explain the next useful step." />
    </>
  )
}

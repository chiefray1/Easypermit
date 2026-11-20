import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState, SectionHeading } from '../components/LayoutParts'
import { ArticleCard, DestinationCard, TestimonialCard } from '../components/Cards'
import { FaqAccordion } from '../components/FaqAccordion'
import { AssessmentForm } from '../components/forms/AssessmentForm'
import { useContent } from '../store/content'
import { PROCESS_STEPS, SERVICES, WHY_US } from '../data/site'
import { ImageWithFallback } from '../components/ImageWithFallback'

const SERVICE_ICONS = {
  graduation: GraduationCap,
  passport: BookOpenCheck,
  plane: Plane,
  palm: Sun,
}

export function HomePage() {
  const { destinations, articles, faqs, testimonials } = useContent()
  const publishedDestinations = destinations.filter((destination) => destination.published)
  const publishedArticles = articles.filter((article) => article.published).slice(0, 3)
  const publishedFaqs = faqs.filter((faq) => faq.published).slice(0, 5)
  const publishedTestimonials = testimonials.filter((testimonial) => testimonial.published).slice(0, 3)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Easy Permit Travel Services',
      description:
        'International education and travel consultancy for study abroad, visas, flights and holidays.',
      areaServed: 'Worldwide',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Easy Permit Travel Services',
      url: import.meta.env.VITE_SITE_URL || undefined,
    },
  ]

  return (
    <>
      <Seo
        title="Easy Permit Travel Services | Study Abroad, Visas & Travel"
        description="Practical study abroad, visa, flight and holiday support for students and travellers. Start with a free assessment and get a clear next step."
        path="/"
        image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
        jsonLd={jsonLd}
      />

      <section className="relative overflow-hidden bg-navy-950 pb-28">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1900&q=80"
            alt=""
            className="h-full w-full object-cover opacity-30"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/94 to-navy-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/35" />
        </div>
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />

        <div className="container-x relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="eyebrow-dark mb-5">
              <Sparkles className="h-3.5 w-3.5" /> International education & travel consultancy
            </span>
            <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[4rem]">
              Your global journey.
              <span className="block text-gold-300">Made easier.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Clear guidance for students and travellers — from choosing a course and preparing a visa application to
              booking the flight and planning the trip.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/get-started" className="btn-gold">
                Start free assessment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
                Book a consultation
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-medium text-white/55">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold-400" /> No payment to start
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold-400" /> Human follow-up
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold-400" /> Honest, documented advice
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="ml-auto max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-500 text-navy-950">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-200">Start here</p>
                  <p className="text-lg font-bold text-white">A plan before a promise</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/65">
                Tell us what you are planning. We will help you understand the options, documents and realistic next
                steps.
              </p>
              <ul className="mt-5 space-y-3 border-t border-white/10 pt-5">
                {['Study abroad and course guidance', 'Visa document preparation', 'Flights and holiday planning'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-white/75">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-gold-400" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/get-started" className="btn-gold mt-6 w-full">
                Get my next step
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x relative z-10 -mt-14">
        <div className="grid gap-2 rounded-2xl border border-navy-100 bg-white p-2 shadow-lift sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.icon]
            const href =
              service.slug === 'study-abroad'
                ? '/study-abroad'
                : service.slug === 'visa-services'
                  ? '/visa-services'
                  : service.slug === 'flight-booking'
                    ? '/flight-booking'
                    : '/tours-holidays'
            return (
              <Link
                key={service.slug}
                to={href}
                className="group flex items-center gap-3 rounded-xl p-4 transition hover:bg-navy-50"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-300 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-navy-900">{service.name}</span>
                  <span className="mt-0.5 block text-[11px] text-navy-400">Explore support</span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-gold-600" />
              </Link>
            )
          })}
        </div>
      </div>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we do"
            title="Support for the journey you are actually planning"
            intro="Study, visas and travel are connected. We help you move between them without losing track of the details."
            action={<Link to="/get-started" className="btn-outline">Find the right service</Link>}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.icon]
              return (
                <article key={service.slug} className="card flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-50 text-navy-700">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-navy-900">{service.name}</h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-body/70">{service.summary}</p>
                  <Link
                    to={
                      service.slug === 'study-abroad'
                        ? '/study-abroad'
                        : service.slug === 'visa-services'
                          ? '/visa-services'
                          : service.slug === 'flight-booking'
                            ? '/flight-booking'
                            : '/tours-holidays'
                    }
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-gold-700"
                  >
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                alt="Consultation discussion"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-4 max-w-[230px] rounded-2xl border border-navy-100 bg-white p-4 shadow-lift sm:right-8">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gold-700">
                <FileCheck2 className="h-4 w-4" /> Clear next steps
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-body/75">
                Checklists, timelines and written fee confirmation before work begins.
              </p>
            </div>
          </div>
          <div>
            <span className="eyebrow mb-4">Why Easy Permit</span>
            <h2 className="section-title">Advice that respects the decision you are making</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body/75">
              A visa, a university place or a family holiday is not a small purchase. Our role is to make the process
              clearer, not to make promises we cannot control.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {WHY_US.map((item) => (
                <div key={item.title}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gold-600" />
                    <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-body/70">{item.description}</p>
                </div>
              ))}
            </div>
            <Link to="/about-us" className="btn-outline mt-8">
              How we work <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Study destinations"
            title="Compare the place, not just the ranking"
            intro="Our destination guides cover study levels, requirements, intakes and the questions to ask before you apply."
            action={<Link to="/study-abroad/destinations" className="btn-outline">All destinations</Link>}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {publishedDestinations.slice(0, 6).map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <span className="eyebrow mb-4">Free assessment</span>
            <h2 className="section-title">A better first step than a generic enquiry form</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body/75">
              Answer a few structured questions so we can understand your goal, timeline and the support you need. It
              takes about two minutes and there is no payment to start.
            </p>
            <div className="mt-7 space-y-4">
              {PROCESS_STEPS.slice(0, 3).map((step, index) => (
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
            <div className="mt-7 flex items-center gap-2 rounded-xl bg-mist p-4 text-[12px] text-body/70">
              <MessageCircle className="h-4 w-4 shrink-0 text-gold-600" />
              Prefer to talk first? <Link to="/contact" className="font-semibold text-navy-800 underline decoration-gold-400 underline-offset-2">Book a consultation</Link>.
            </div>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-mist p-3 sm:p-4">
            <AssessmentForm service="study-abroad" source="homepage_assessment" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-navy-900 p-7 text-white lg:col-span-1">
            <span className="eyebrow-dark mb-4">Visas</span>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">Prepare the evidence, not just the form</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Student, visitor, tourist, business and work visa support with document checks and honest guidance.
            </p>
            <Link to="/visa-services" className="btn-gold mt-6 w-full">Explore visa support</Link>
            <div className="mt-6 border-t border-white/10 pt-5 text-[11px] leading-relaxed text-white/40">
              We do not sell visas or guarantee approvals. Decisions rest with the relevant authorities.
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {[
              { title: 'Flight booking', text: 'Compare routes, baggage and connection details before you book.', href: '/flight-booking' },
              { title: 'Tours & holidays', text: 'Shape a trip around your dates, budget and travel style.', href: '/tours-holidays' },
              { title: 'Resource library', text: 'Practical guides for applications, funding and arrival.', href: '/resources' },
              { title: 'Success stories', text: 'Real stories are published only with permission and verification.', href: '/success-stories' },
            ].map((item) => (
              <Link key={item.title} to={item.href} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lift">
                <h3 className="font-display text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-body/70">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-gold-700">
                  Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Resources"
            title="Useful reading before you apply or book"
            intro="General guidance to help you ask better questions and avoid avoidable mistakes."
            action={<Link to="/resources" className="btn-outline">Browse all articles</Link>}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {publishedArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Client stories"
            title="Stories worth telling — with permission"
            intro="We publish outcomes only after verification and consent. No invented testimonials, no guaranteed results."
          />
          {publishedTestimonials.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {publishedTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Verified client stories are being prepared"
              description="We are collecting stories with written permission. In the meantime, you can read how our process works or speak with us directly."
              icon={<BadgeCheck className="h-6 w-6" />}
              action={<Link to="/success-stories" className="btn-outline">Learn about our approach</Link>}
            />
          )}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="eyebrow mb-4">Common questions</span>
            <h2 className="section-title">Straight answers before you start</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body/75">
              If your question is not here, send it to us. We will answer honestly, including when something is outside
              our control.
            </p>
            <Link to="/faqs" className="btn-outline mt-6">All FAQs</Link>
          </div>
          <FaqAccordion items={publishedFaqs} />
        </div>
      </section>

      <CtaBand
        title="Ready to turn the idea into a plan?"
        intro="Start with a short assessment. We will use your answers to recommend the most useful next step."
      />
    </>
  )
}

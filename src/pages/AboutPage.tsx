import { Link } from 'react-router-dom'
import { ArrowRight, Globe2, HeartHandshake, MessageCircle, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, PageHero, SectionHeading } from '../components/LayoutParts'
import { PROCESS_STEPS } from '../data/site'

export function AboutPage() {
  return (
    <>
      <Seo
        title="About Easy Permit Travel Services"
        description="Learn how Easy Permit approaches study abroad, visa and travel support with clear guidance, document discipline and honest expectations."
        path="/about-us"
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="About us"
        title="A consultancy built around clarity, not hype"
        intro="Easy Permit Travel Services supports students and travellers with practical guidance for study abroad, visas, flights and holidays."
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className="btn-gold">Talk to us</Link>
          <Link to="/success-stories" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
            Our client stories
          </Link>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <span className="eyebrow mb-4">Our approach</span>
            <h2 className="section-title">The journey is personal. The process should still be clear.</h2>
            <div className="prose-copy mt-5 space-y-4 text-[15px]">
              <p>
                Study, visa and travel decisions carry real consequences: money, time, family expectations and future
                plans. We believe the right support starts with understanding your situation before recommending anything.
              </p>
              <p>
                That means asking about your qualifications, budget, timeline and priorities. It means explaining what we
                can help with and what depends on institutions, immigration authorities or airlines. It also means putting
                fees and scope in writing before work begins.
              </p>
              <p>
                Our role is not to create false certainty. It is to help you prepare a stronger application, compare
                practical travel options and understand the next step.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-navy-100 bg-white p-5">
                <Globe2 className="h-5 w-5 text-gold-600" />
                <h3 className="mt-3 text-sm font-bold text-navy-900">Our mission</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-body/70">
                  To make international study and travel planning more understandable, better organised and more honest.
                </p>
              </div>
              <div className="rounded-2xl border border-navy-100 bg-white p-5">
                <HeartHandshake className="h-5 w-5 text-gold-600" />
                <h3 className="mt-3 text-sm font-bold text-navy-900">Our standard</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-body/70">
                  Clear scope, documented advice, respectful follow-up and no promises we cannot control.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
                alt="Team working together"
                className="h-72 w-full object-cover"
              />
            </div>
            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-300">Our promise</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                We will tell you what we know, what we need to verify and what is outside our control. If we are not the
                right fit for your case, we will say so.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-white/45">
                <ShieldCheck className="h-4 w-4 text-gold-400" /> Guidance, not guarantees
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our team"
            title="Small enough to know your case"
            intro="Your support is organised around the service you need. Names and photos are published only with team consent."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                role: 'Study adviser',
                text: 'Course and destination shortlisting, application documents, offer follow-up and pre-departure planning.',
              },
              {
                role: 'Visa support',
                text: 'Requirement reviews, document consistency checks, appointment preparation and application tracking.',
              },
              {
                role: 'Travel desk',
                text: 'Flight comparisons, baggage and connection guidance, holiday proposals and itinerary coordination.',
              },
            ].map((member) => (
              <div key={member.role} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50 text-navy-700">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{member.role}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-body/70">{member.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[11px] text-navy-400">
            Team profiles are added after consent and verification. This section is intentionally not populated with
            invented names or photographs.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="How we work" title="Four stages, one clear handover" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="card p-6">
                <span className="font-display text-3xl font-extrabold text-gold-300">0{index + 1}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-body/70">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
              <div>
                <h3 className="text-sm font-bold text-navy-900">Independence and limitations</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-body/70">
                  Easy Permit is a consultancy. We are not a university, embassy, immigration authority or airline. We do
                  not guarantee admission, visa approval, flight availability or travel outcomes. Where a case requires
                  regulated legal advice, we will recommend that you consult a qualified professional.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-7 text-center">
            <Link to="/contact" className="btn-primary">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand title="Tell us what you are planning" intro="We will help you identify the most useful next step, even if that step is simply waiting for a better time." />
    </>
  )
}

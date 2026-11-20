import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, FileCheck2, Quote, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CtaBand, EmptyState, PageHero, SectionHeading } from '../components/LayoutParts'
import { TestimonialCard } from '../components/Cards'
import { useContent } from '../store/content'

export function SuccessStoriesPage() {
  const { testimonials } = useContent()
  const published = testimonials.filter((testimonial) => testimonial.published && testimonial.permissionConfirmed)
  const [filter, setFilter] = useState('All')
  const services = useMemo(() => ['All', ...Array.from(new Set(published.map((testimonial) => testimonial.service)))], [published])
  const filtered = filter === 'All' ? published : published.filter((testimonial) => testimonial.service === filter)

  return (
    <>
      <Seo
        title="Client Success Stories"
        description="Verified client stories published with permission, plus the standards we use before sharing an outcome."
        path="/success-stories"
        image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Success stories"
        title="Real stories, published responsibly"
        intro="We share client experiences only after verification and written permission. No invented testimonials, no implied guarantees."
        image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about-us' }, { label: 'Success Stories' }]}
      />

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our verification standard"
            title="Before a story appears here"
            intro="A polished quote is not enough. We check the context and obtain permission before publishing."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: FileCheck2, title: 'Outcome confirmed', text: 'We verify the service provided and the outcome described, without exposing private documents.' },
              { icon: ShieldCheck, title: 'Permission recorded', text: 'The client confirms what may be shared and how their name or details should appear.' },
              { icon: BadgeCheck, title: 'No guarantee implied', text: 'Each story is personal. It is not a promise that another client will get the same result.' },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <item.icon className="h-5 w-5 text-gold-600" />
                <h3 className="mt-3 font-display text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-body/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          {published.length > 0 ? (
            <>
              <SectionHeading
                eyebrow="Published stories"
                title="Client experiences"
                action={
                  services.length > 2 ? (
                    <div className="flex flex-wrap gap-2">
                      {services.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => setFilter(service)}
                          className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                            filter === service ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  ) : undefined
                }
              />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Verified stories will appear here"
              description="We are collecting stories with written permission. In the meantime, you can review our approach and process, or speak with us about your own plans."
              icon={<Quote className="h-6 w-6" />}
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/about-us" className="btn-outline">How we work</Link>
                  <Link to="/contact" className="btn-primary">Talk to an adviser</Link>
                </div>
              }
            />
          )}
          <p className="mt-8 text-center text-[11px] leading-relaxed text-navy-400">
            Outcomes depend on individual circumstances and decisions made by institutions, authorities and travel
            providers. A published story is not a guarantee of similar results.
          </p>
        </div>
      </section>

      <CtaBand title="Want to write your own next chapter?" intro="Start with an assessment and a realistic conversation about your plans." />
    </>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, GraduationCap, Plane, Stamp, Sun } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { cn } from '../lib/utils'

const SLIDES = [
  {
    eyebrow: 'Study abroad',
    title: 'Education that starts with the right guidance.',
    description:
      'From course and country shortlisting to applications, funding evidence and pre-departure planning, we help students build a realistic plan around their profile.',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    alt: 'Students walking through a university campus',
    points: ['Academic profile and course shortlisting', 'Application and document support', 'Student visa and pre-departure preparation'],
    cta: 'Explore study abroad',
    href: '/study-abroad',
  },
  {
    eyebrow: 'Visa services',
    title: 'Visa preparation with document discipline.',
    description:
      'We support tourist, business, family visit, medical and student visa applications with clear checklists, consistency reviews and honest guidance on what the authorities decide.',
    icon: Stamp,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80',
    alt: 'Passport and travel documents on a desk',
    points: ['Requirement and eligibility review', 'Consistent document preparation', 'Appointment and interview guidance'],
    cta: 'View visa services',
    href: '/visa-services',
  },
  {
    eyebrow: 'Flight reservations',
    title: 'Flights chosen for the whole journey.',
    description:
      'Share your route, dates and priorities. We compare practical flight options, baggage rules and connection details before you commit to a ticket.',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',
    alt: 'Aircraft wing above clouds during an international flight',
    points: ['Route and airline comparison', 'Baggage and connection checks', 'A written quotation before booking'],
    cta: 'Request flight options',
    href: '/flight-booking',
  },
  {
    eyebrow: 'Tours & holidays',
    title: 'Travel plans with room to breathe.',
    description:
      'For individuals, couples, families and groups, we shape holidays around your dates, budget and travel style, then coordinate the practical details before you go.',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    alt: 'Bright tropical beach and clear blue water',
    points: ['Personalised itinerary planning', 'Accommodation and activity options', 'Group and family travel coordination'],
    cta: 'Plan a holiday',
    href: '/tours-holidays',
  },
]

export function HomeSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), 6500)
    return () => window.clearInterval(timer)
  }, [paused])

  const slide = SLIDES[index]
  const Icon = slide.icon

  return (
    <section className="bg-mist py-12 sm:py-16" aria-label="Study, visa and travel support">
      <div className="container-x">
        <div
          className="overflow-hidden rounded-3xl border border-navy-100 bg-navy-950 shadow-lift"
          aria-roledescription="carousel"
          aria-label="Easy Permit services"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 p-6 sm:p-9 lg:p-12">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300">
                  <Icon className="h-3.5 w-3.5" /> {slide.eyebrow}
                </span>
                <span className="text-[11px] font-semibold tabular-nums text-white/40">
                  0{index + 1} / 0{SLIDES.length}
                </span>
              </div>

              <h2 className="mt-6 max-w-xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/65 sm:text-[15px]">{slide.description}</p>

              <ul className="mt-6 grid gap-2.5">
                {slide.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[12.5px] text-white/75">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" /> {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to={slide.href} className="btn-gold">
                  {slide.cta} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/get-started" className="btn border border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Start free assessment
                </Link>
              </div>
            </div>

            <div className="relative min-h-[280px] lg:min-h-[500px]">
              <ImageWithFallback
                key={slide.image}
                src={slide.image}
                alt={slide.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-950/20 lg:to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300">Easy Permit Travel Services</p>
                <p className="mt-1.5 font-display text-xl font-extrabold text-white">Your Global Journey. Made Easier.</p>
                <p className="mt-1 text-[11px] text-white/55">Study abroad, visas, flights and holidays — connected in one place.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {SLIDES.map((item, itemIndex) => (
                <button
                  key={item.eyebrow}
                  type="button"
                  onClick={() => setIndex(itemIndex)}
                  aria-label={`Show slide: ${item.eyebrow}`}
                  aria-current={itemIndex === index}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    itemIndex === index ? 'w-8 bg-gold-400' : 'w-4 bg-white/20 hover:bg-white/40',
                  )}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="text-[11px] text-white/35">Use the controls to explore each service.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:text-white"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((current) => (current + 1) % SLIDES.length)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:text-white"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

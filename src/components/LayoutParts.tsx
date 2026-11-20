import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-white/60">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/35" />}
          {item.href ? (
            <Link to={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-white/85">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

interface PageHeroProps {
  eyebrow?: string
  title: string
  intro?: string
  image?: string
  breadcrumbs?: { label: string; href?: string }[]
  children?: ReactNode
  size?: 'default' | 'compact'
}

export function PageHero({ eyebrow, title, intro, image, breadcrumbs, children, size = 'default' }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/95 to-navy-900/60" />
        </div>
      )}
      <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className={cn('container-x relative', size === 'compact' ? 'py-12 sm:py-16' : 'py-16 sm:py-24')}>
        <div className="max-w-3xl">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          {eyebrow && <span className="eyebrow-dark mb-4">{eyebrow}</span>}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.07]">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  action,
  dark = false,
}: {
  eyebrow?: string
  title: string
  intro?: string
  align?: 'left' | 'center'
  action?: ReactNode
  dark?: boolean
}) {
  return (
    <div
      className={cn(
        'mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <span className={dark ? 'eyebrow-dark mb-3' : 'eyebrow mb-3'}>{eyebrow}</span>}
        <h2 className={cn('section-title', dark && 'text-white')}>{title}</h2>
        {intro && <p className={cn('mt-3 text-[15px] leading-relaxed', dark ? 'text-white/65' : 'text-body/80')}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CtaBand({ title, intro }: { title?: string; intro?: string }) {
  return (
    <section className="py-14 sm:py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 sm:px-12 sm:py-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-navy-500/20 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <span className="eyebrow-dark mb-4">Take the next step</span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {title ?? 'Not sure where to start? Tell us what you are planning.'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                {intro ??
                  'A short assessment helps us understand your goal, destination and timeline so we can point you to the right next step.'}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link to="/get-started" className="btn-gold">
                Start free assessment
              </Link>
              <Link to="/contact" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
                Book a consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-12 text-center">
      {icon && <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-500">{icon}</div>}
      <h3 className="font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-body/70">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

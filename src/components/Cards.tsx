import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarDays, MapPin, Plane, Quote, ShieldCheck } from 'lucide-react'
import type { Article, Destination, HolidayPackage, Testimonial } from '../data/types'
import { formatDate } from '../lib/utils'
import { ImageWithFallback } from './ImageWithFallback'

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      to={`/study-abroad/destinations/${destination.slug}`}
      className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-44 overflow-hidden">
        <ImageWithFallback
          src={destination.image}
          alt={`Study in ${destination.country}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy-900">
          {destination.flag} {destination.country}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-navy-900">Study in {destination.country}</h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-body/70">{destination.intro}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="chip bg-navy-50 text-navy-600">{destination.studyLevels[0]}</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-700">
            Explore <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/resources/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="h-44 overflow-hidden">
        <ImageWithFallback
          src={article.image}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="chip bg-gold-50 text-gold-700">{article.category}</span>
          <span className="text-navy-300">•</span>
          <span className="text-navy-500">{article.readMinutes} min read</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy-900 transition group-hover:text-navy-700">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-body/70">{article.excerpt}</p>
        <span className="mt-auto pt-4 text-xs font-semibold text-navy-400">{formatDate(article.publishedAt)}</span>
      </div>
    </Link>
  )
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
      <Quote className="h-6 w-6 text-gold-400" />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-body">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-5 border-t border-navy-100 pt-4">
        <p className="text-sm font-bold text-navy-900">{testimonial.clientName}</p>
        <p className="mt-0.5 text-xs text-navy-500">
          {testimonial.service}
          {testimonial.destination ? ` • ${testimonial.destination}` : ''}
        </p>
        {testimonial.permissionConfirmed && (
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-success">
            <ShieldCheck className="h-3 w-3" /> Permission confirmed
          </span>
        )}
      </figcaption>
    </figure>
  )
}

export function PackageCard({ holidayPackage }: { holidayPackage: HolidayPackage }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="chip bg-navy-50 text-navy-600">
            <MapPin className="h-3 w-3" /> {holidayPackage.destination}
          </span>
          <h3 className="mt-3 font-display text-xl font-bold text-navy-900">{holidayPackage.title}</h3>
        </div>
        <Plane className="h-5 w-5 shrink-0 text-gold-500" />
      </div>
      <p className="mt-3 text-sm text-body/75">{holidayPackage.duration} • {holidayPackage.groupType}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-navy-500">
        <CalendarDays className="h-4 w-4" /> {holidayPackage.departurePeriod}
      </div>
      <ul className="mt-4 space-y-1.5 text-[13px] text-body/75">
        {holidayPackage.inclusions.slice(0, 4).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <p className="text-lg font-bold text-navy-900">
          {holidayPackage.indicativePrice ? `${holidayPackage.currency} ${holidayPackage.indicativePrice}` : 'Price on request'}
        </p>
        <p className="mt-1 text-[11px] text-navy-400">{holidayPackage.priceNote}</p>
        <Link to="/contact" className="btn-outline mt-4 w-full">
          Request this trip
        </Link>
      </div>
    </article>
  )
}

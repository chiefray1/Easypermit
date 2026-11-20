import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Seo } from '../components/Seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="The page you are looking for could not be found." path="/404" noIndex />
      <section className="relative overflow-hidden bg-navy-950 py-24 sm:py-32">
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-gold-300">
            <Compass className="h-7 w-7" />
          </span>
          <p className="mt-6 font-display text-6xl font-extrabold text-gold-300">404</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">This page took a different route</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
            The link may be outdated or the page may have moved. Start from the homepage or explore our services.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-gold">Back to homepage</Link>
            <Link to="/contact" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

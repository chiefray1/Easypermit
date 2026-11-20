import { Link } from 'react-router-dom'
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { DESTINATIONS } from '../data/destinations'
import { useContent } from '../store/content'
import { buildWhatsAppLink } from '../lib/utils'
import { Logo } from './Logo'

export function Footer() {
  const { site } = useContent()
  const year = new Date().getFullYear()
  const whatsappNumber = site.contact.whatsappE164 || import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const whatsapp = buildWhatsAppLink(whatsappNumber, 'Hello Easy Permit, I would like help with my travel plans.')
  const email = site.contact.email || import.meta.env.VITE_CONTACT_EMAIL || ''
  const phone = site.contact.phoneDisplay || import.meta.env.VITE_CONTACT_PHONE || ''

  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-x py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              International education and travel consultancy supporting students and travellers with clear,
              practical guidance from first question to next step.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/60">
                Study Abroad
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/60">
                Visas
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/60">
                Flights & Holidays
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li><Link className="hover:text-white" to="/study-abroad">Study Abroad</Link></li>
              <li><Link className="hover:text-white" to="/visa-services">Visa Consultancy</Link></li>
              <li><Link className="hover:text-white" to="/flight-booking">Flight Booking</Link></li>
              <li><Link className="hover:text-white" to="/tours-holidays">Tours & Holidays</Link></li>
              <li><Link className="hover:text-white" to="/success-stories">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300">Study destinations</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              {DESTINATIONS.map((destination) => (
                <li key={destination.slug}>
                  <Link className="hover:text-white" to={`/study-abroad/destinations/${destination.slug}`}>
                    Study in {destination.country}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              {phone && (
                <li>
                  <a className="inline-flex items-start gap-2.5 hover:text-white" href={`tel:${site.contact.phoneE164 || phone}`}>
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a className="inline-flex items-start gap-2.5 hover:text-white" href={`mailto:${email}`}>
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    {email}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a className="inline-flex items-start gap-2.5 hover:text-white" href={whatsapp} target="_blank" rel="noreferrer">
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    Chat on WhatsApp
                  </a>
                </li>
              )}
              {site.contact.address && (
                <li className="inline-flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  {site.contact.address}
                </li>
              )}
              <li className="inline-flex items-start gap-2.5">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                {site.contact.hours}
              </li>
              {!phone && !email && !whatsapp && (
                <li>
                  <Link to="/contact" className="font-semibold text-gold-300 hover:text-gold-200">
                    Send us a message
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link className="hover:text-white/70" to="/privacy-policy">Privacy policy</Link>
            <Link className="hover:text-white/70" to="/terms-and-conditions">Terms of service</Link>
            <Link className="hover:text-white/70" to="/faqs">FAQs</Link>
            <Link className="hover:text-white/70" to="/admin">Staff login</Link>
          </div>
        </div>
        <p className="mt-4 max-w-4xl text-[11px] leading-relaxed text-white/30">
          Easy Permit Travel Services provides guidance and application support. Admission, visa, flight and travel
          outcomes are decided by the relevant institutions, authorities and providers. Information on this website is
          general and should be verified against current official sources.
        </p>
      </div>
    </footer>
  )
}

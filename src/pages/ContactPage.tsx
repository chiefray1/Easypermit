import { Link } from 'react-router-dom'
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/LayoutParts'
import { ConsultationForm } from '../components/forms/ConsultationForm'
import { FaqAccordion } from '../components/FaqAccordion'
import { useContent } from '../store/content'
import { buildWhatsAppLink } from '../lib/utils'
import { track } from '../lib/analytics'

export function ContactPage() {
  const { site, faqs } = useContent()
  const phone = site.contact.phoneDisplay || import.meta.env.VITE_CONTACT_PHONE || ''
  const email = site.contact.email || import.meta.env.VITE_CONTACT_EMAIL || ''
  const number = site.contact.whatsappE164 || import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const whatsapp = buildWhatsAppLink(number, 'Hello Easy Permit, I would like help with my plans.')
  const quickFaqs = faqs.filter((faq) => faq.published && faq.category === 'General').slice(0, 4)

  return (
    <>
      <Seo
        title="Contact Easy Permit Travel Services"
        description="Book a consultation or send an enquiry about study abroad, visas, flights or holiday planning."
        path="/contact"
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
      />
      <PageHero
        eyebrow="Contact"
        title="Start with a conversation"
        intro="Tell us what you are planning, where you are in the process and what you need help with. We will respond with a practical next step."
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <aside className="space-y-4">
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-navy-900">Ways to reach us</h2>
              <div className="mt-4 space-y-3 text-sm">
                {phone && (
                  <a href={`tel:${site.contact.phoneE164 || phone}`} className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-navy-50">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Phone</span>
                      <span className="font-medium text-navy-800">{phone}</span>
                    </span>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-navy-50">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Email</span>
                      <span className="font-medium text-navy-800">{email}</span>
                    </span>
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track('whatsapp_click', { placement: 'contact_page' })}
                    className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-navy-50"
                  >
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-navy-400">WhatsApp</span>
                      <span className="font-medium text-navy-800">Chat with our team</span>
                    </span>
                  </a>
                )}
                {site.contact.address && (
                  <div className="flex items-start gap-3 p-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Office</span>
                      <span className="font-medium text-navy-800">{site.contact.address}</span>
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3 p-2">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Hours</span>
                    <span className="font-medium text-navy-800">{site.contact.hours}</span>
                  </span>
                </div>
              </div>
              {!phone && !email && !whatsapp && (
                <p className="mt-3 rounded-lg bg-mist p-3 text-[11px] leading-relaxed text-navy-500">
                  Contact channels are being configured. The form is the best way to reach us right now.
                </p>
              )}
              <p className="mt-4 border-t border-navy-100 pt-4 text-[11px] leading-relaxed text-navy-400">
                We aim to respond within one business day. Urgent travel requests should include your dates and route so we
                can prioritise them.
              </p>
            </div>

            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <h2 className="font-display text-lg font-bold">Before your consultation</h2>
              <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-white/65">
                <li>• Your goal and preferred destination</li>
                <li>• Relevant academic or travel history</li>
                <li>• Intended dates and a realistic budget</li>
                <li>• Any previous visa refusal or application issue</li>
              </ul>
              <Link to="/get-started" className="btn-gold mt-5 w-full">Start free assessment</Link>
            </div>

            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-navy-900">Quick answers</h2>
              <div className="mt-3">
                <FaqAccordion items={quickFaqs} />
              </div>
              <Link to="/faqs" className="mt-4 inline-block text-xs font-bold text-navy-700 hover:text-gold-700">
                See all FAQs →
              </Link>
            </div>
          </aside>

          <div className="card p-5 sm:p-7">
            <div className="mb-6">
              <span className="eyebrow mb-3">Consultation request</span>
              <h2 className="font-display text-2xl font-extrabold text-navy-900">Book a conversation</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-body/70">
                Share your preferred date and time. We will confirm availability and the format by email or WhatsApp.
              </p>
            </div>
            <ConsultationForm source="contact_page" />
          </div>
        </div>
      </section>
    </>
  )
}

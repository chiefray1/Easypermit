import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/LayoutParts'
import { useContent } from '../store/content'

const LAST_UPDATED = '19 November 2026'

const PRIVACY_SECTIONS = [
  {
    title: 'Who we are',
    body: [
      'Easy Permit Travel Services provides international education and travel consultancy services. This policy explains how we collect, use and protect personal information when you use this website, submit an enquiry or engage our services.',
    ],
  },
  {
    title: 'Information we collect',
    body: [
      'We collect information you provide directly, including your name, email address, phone or WhatsApp number, country of residence, service interest, destination, travel dates, budget range and details about your enquiry.',
      'For study and visa enquiries, you may choose to share academic history, language test information, passport status, previous refusal information and supporting documents. Please share only what is necessary for the service.',
      'We also collect limited technical information such as browser type, device information, referring pages and analytics events where analytics is enabled.',
    ],
  },
  {
    title: 'How we use your information',
    body: [
      'We use your information to respond to enquiries, assess your needs, provide services, prepare applications or travel options, communicate with you, maintain records, improve our website and comply with legal obligations.',
      'We do not sell your personal information. We do not use your information to make automated decisions that produce legal or similarly significant effects without human involvement.',
    ],
  },
  {
    title: 'Lawful basis',
    body: [
      'Depending on your location and the context, we rely on your consent, the performance of a contract or steps taken at your request before entering a contract, compliance with legal obligations, and our legitimate interests in operating and improving our services. Where we rely on consent, you may withdraw it at any time.',
    ],
  },
  {
    title: 'Sharing and service providers',
    body: [
      'We may share information with service providers that help us operate, such as database hosting, CRM, email delivery, analytics and communication platforms. These providers process information on our behalf and are expected to protect it.',
      'We may also share information with professional advisers, institutions or travel providers where necessary to deliver a service you requested, or with authorities where required by law. We do not authorise providers to use your information for their own marketing.',
    ],
  },
  {
    title: 'International transfers',
    body: [
      'Some service providers may process information in countries other than your own. Where required, we use appropriate safeguards for international transfers. Contact us if you would like more information about the safeguards relevant to your data.',
    ],
  },
  {
    title: 'Retention',
    body: [
      'We keep personal information only for as long as necessary for the purposes described in this policy, including responding to your enquiry, providing services, maintaining business records and meeting legal or regulatory requirements. Retention periods depend on the type of information and the service involved.',
    ],
  },
  {
    title: 'Security',
    body: [
      'We use reasonable technical and organisational measures to protect personal information. No method of transmission or storage is completely secure, so you should avoid sending sensitive documents through unsecured channels unless we have agreed a suitable method.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'Depending on applicable law, you may have the right to access, correct, delete or restrict the use of your personal information, to object to certain processing, to withdraw consent and to request a copy of your information. You may also have the right to complain to a data protection authority.',
      'To exercise a right, contact us using the details below. We may need to verify your identity before responding.',
    ],
  },
  {
    title: 'Cookies and analytics',
    body: [
      'This website may use cookies or similar technologies for essential functionality and, where enabled, analytics and advertising measurement. You can control cookies through your browser settings. Blocking some cookies may affect how the site works.',
    ],
  },
  {
    title: 'Children',
    body: [
      'Our services are intended for people who can enter into their own enquiries or have a parent or guardian act for them. We do not knowingly collect personal information from children without appropriate involvement of a parent or guardian.',
    ],
  },
  {
    title: 'Changes',
    body: [
      'We may update this policy from time to time. The latest version will be published on this page with the updated date. Material changes will be communicated where appropriate.',
    ],
  },
]

const TERMS_SECTIONS = [
  {
    title: 'About these terms',
    body: [
      'These terms govern your use of the Easy Permit Travel Services website and the consultancy services you engage through us. By using the website or engaging our services, you agree to these terms. If you do not agree, please do not use the website or services.',
    ],
  },
  {
    title: 'Scope of services',
    body: [
      'We provide guidance and support for study abroad, visa preparation, flight enquiries and holiday planning. The exact scope, deliverables, fees and timelines for paid work are confirmed in writing before work begins.',
      'We are a consultancy. We are not a university, embassy, immigration authority, airline or travel provider unless expressly stated.',
    ],
  },
  {
    title: 'No guarantee of outcomes',
    body: [
      'Admission, visa, flight, accommodation and travel decisions are made by third parties. We do not guarantee admission, visa approval, processing times, flight availability, prices or any other outcome. Any examples, guides or stories on this website are general information or individual experiences, not promises of similar results.',
    ],
  },
  {
    title: 'Fees and payments',
    body: [
      'Our fees are separate from third-party costs such as application fees, visa fees, tuition, deposits, airline tickets, insurance and accommodation. Applicable fees and payment terms are confirmed in writing before work begins. Unless agreed otherwise, third-party payments are made directly to the relevant provider.',
    ],
  },
  {
    title: 'Your responsibilities',
    body: [
      'You are responsible for providing accurate, complete and timely information and documents. You must disclose relevant facts, including previous refusals or issues that may affect an application. We are not responsible for decisions or delays caused by inaccurate or withheld information.',
      'You must review documents before submission and comply with the requirements and deadlines of institutions, authorities and providers.',
    ],
  },
  {
    title: 'Applications and documents',
    body: [
      'We may review documents for completeness and consistency, but we do not verify the authenticity of every document and do not provide legal advice. You are responsible for the truth and authenticity of the information you provide.',
      'For complex immigration matters, we may recommend that you consult a qualified immigration lawyer. Nothing on this website creates a lawyer-client relationship.',
    ],
  },
  {
    title: 'Flights, holidays and third-party bookings',
    body: [
      'Flight and holiday arrangements are subject to the terms of the relevant airline, hotel, tour operator or insurer. Prices and availability can change until a booking is confirmed and paid. Cancellation, change and refund rules are set by the provider.',
      'You are responsible for checking passport validity, visa and entry requirements, health requirements, baggage allowances and travel insurance cover before travelling.',
    ],
  },
  {
    title: 'Intellectual property',
    body: [
      'The content, branding, design and materials on this website are owned by or licensed to Easy Permit Travel Services and are protected by applicable intellectual property laws. You may not copy, republish or commercialise them without written permission, except for personal, non-commercial use.',
    ],
  },
  {
    title: 'Limitation of liability',
    body: [
      'To the fullest extent permitted by law, we are not liable for indirect, incidental or consequential losses, or for losses caused by third-party decisions, delays, service failures or events outside our reasonable control. Nothing in these terms excludes liability that cannot legally be excluded.',
    ],
  },
  {
    title: 'Privacy',
    body: [
      'Our privacy policy explains how we handle personal information. It forms part of these terms.',
    ],
  },
  {
    title: 'Governing law and disputes',
    body: [
      'These terms are governed by the laws applicable in the jurisdiction where Easy Permit Travel Services is registered, without affecting any mandatory consumer protections available to you. We encourage you to contact us first so we can try to resolve any concern.',
    ],
  },
  {
    title: 'Changes',
    body: [
      'We may update these terms from time to time. The latest version will be published on this page with the updated date. Continued use of the website or services after an update means you accept the revised terms.',
    ],
  },
]

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { site } = useContent()
  const isPrivacy = kind === 'privacy'
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service'
  const intro = isPrivacy
    ? 'How we handle personal information when you use this website or engage our services.'
    : 'The basis on which we provide our website and consultancy services.'
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS
  const email = site.contact.email || import.meta.env.VITE_CONTACT_EMAIL || ''

  return (
    <>
      <Seo
        title={title}
        description={`${title} for Easy Permit Travel Services.`}
        path={isPrivacy ? '/privacy-policy' : '/terms-and-conditions'}
      />
      <PageHero
        eyebrow="Legal"
        title={title}
        intro={intro}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]}
        size="compact"
      />
      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="rounded-2xl border border-navy-100 bg-white p-4 text-[12.5px]">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-navy-400">Related</p>
              <Link to="/privacy-policy" className={isPrivacy ? 'block rounded-lg bg-navy-50 px-3 py-2 font-semibold text-navy-900' : 'block rounded-lg px-3 py-2 text-navy-600 hover:bg-navy-50'}>
                Privacy policy
              </Link>
              <Link to="/terms-and-conditions" className={!isPrivacy ? 'block rounded-lg bg-navy-50 px-3 py-2 font-semibold text-navy-900' : 'block rounded-lg px-3 py-2 text-navy-600 hover:bg-navy-50'}>
                Terms of service
              </Link>
              <p className="mt-4 border-t border-navy-100 px-3 pt-4 text-[11px] text-navy-400">Last updated: {LAST_UPDATED}</p>
            </nav>
          </aside>
          <div className="max-w-3xl">
            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-display text-xl font-extrabold text-navy-900">{section.title}</h2>
                  <div className="mt-2 space-y-3 text-[14px] leading-relaxed text-body/80">
                    {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
              <section>
                <h2 className="font-display text-xl font-extrabold text-navy-900">Contact</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-body/80">
                  For questions about {isPrivacy ? 'this policy or your personal information' : 'these terms'}, contact us at{' '}
                  {email ? <a href={`mailto:${email}`} className="font-semibold text-navy-800 underline decoration-gold-400 underline-offset-2">{email}</a> : <Link to="/contact" className="font-semibold text-navy-800 underline decoration-gold-400 underline-offset-2">our contact page</Link>}.
                </p>
              </section>
            </div>
            <div className="mt-10 rounded-xl border border-navy-100 bg-navy-50 p-4 text-[11px] leading-relaxed text-navy-500">
              This document is a general website template and not legal advice. Have it reviewed by a qualified legal
              professional for your jurisdiction before publication.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function PrivacyPage() {
  return <LegalPage kind="privacy" />
}

export function TermsPage() {
  return <LegalPage kind="terms" />
}

import type { Faq, NavItem, ProcessStep, Service, SiteConfig } from './types'

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  name: 'Easy Permit Travel Services',
  shortName: 'Easy Permit',
  tagline: 'Your Global Journey. Made Easier.',
  legalName: 'Easy Permit Travel Services',
  description:
    'International education and travel consultancy supporting students and travellers with study abroad guidance, visa preparation, flight reservations and holiday planning.',
  contact: {
    phoneDisplay: import.meta.env.VITE_CONTACT_PHONE?.trim() ?? '',
    phoneE164: import.meta.env.VITE_CONTACT_PHONE?.trim() ?? '',
    whatsappE164: import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '',
    email: import.meta.env.VITE_CONTACT_EMAIL?.trim() ?? '',
    address: '',
    hours: 'Monday–Friday, 9:00–17:00 (WAT)',
  },
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
    linkedin: '',
  },
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Study Abroad',
    href: '/study-abroad',
    children: [
      { label: 'Study Destinations', href: '/study-abroad/destinations' },
      { label: 'United Kingdom', href: '/study-abroad/destinations/uk' },
      { label: 'Germany', href: '/study-abroad/destinations/germany' },
      { label: 'Canada', href: '/study-abroad/destinations/canada' },
      { label: 'United States', href: '/study-abroad/destinations/usa' },
      { label: 'Malaysia', href: '/study-abroad/destinations/malaysia' },
      { label: 'Ireland', href: '/study-abroad/destinations/ireland' },
    ],
  },
  {
    label: 'Visa Services',
    href: '/visa-services',
    children: [
      { label: 'All Visa Services', href: '/visa-services' },
      { label: 'Tourist Visa', href: '/visa-services/tourist-visa' },
      { label: 'Business Visa', href: '/visa-services/business-visa' },
      { label: 'Family Visit Visa', href: '/visa-services/family-visit' },
      { label: 'Medical Visa', href: '/visa-services/medical-visa' },
      { label: 'Student Visa', href: '/visa-services/student-visa' },
    ],
  },
  {
    label: 'Travel Services',
    href: '/travel-services',
    children: [
      { label: 'Travel Services', href: '/travel-services' },
      { label: 'Flight Reservations', href: '/flight-booking' },
      { label: 'Tours & Holidays', href: '/tours-holidays' },
    ],
  },
  { label: 'Destinations', href: '/study-abroad/destinations' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact Us', href: '/contact' },
]

export const SERVICES: Service[] = [
  {
    slug: 'study-abroad',
    name: 'Study Abroad',
    shortName: 'Study Abroad',
    icon: 'graduation',
    summary: 'Course and country guidance, application support and pre-departure planning.',
    description:
      'We help prospective students compare study destinations, shortlist courses and institutions, prepare application documents and plan the practical steps from offer to arrival.',
    outcomes: [
      'A shortlist matched to your goals and budget',
      'Application document checklist and review',
      'Offer, acceptance and pre-departure guidance',
    ],
  },
  {
    slug: 'visa-services',
    name: 'Visa Consultancy',
    shortName: 'Visas',
    icon: 'passport',
    summary: 'Structured preparation for student, visitor, tourist, business and work visa applications.',
    description:
      'Our visa support focuses on understanding the requirements, preparing a coherent document set and submitting an application that accurately represents your circumstances. Outcomes remain with the relevant authorities.',
    outcomes: [
      'Requirement and eligibility review',
      'Document checklist and consistency checks',
      'Application, appointment and interview preparation',
    ],
  },
  {
    slug: 'flight-booking',
    name: 'Flight Reservations',
    shortName: 'Flights',
    icon: 'plane',
    summary: 'Flight options for students, families and business travellers, with itinerary guidance.',
    description:
      'Share your route, dates and priorities and we will help you compare practical flight options, baggage rules and connection details before you book.',
    outcomes: [
      'Route and airline comparison',
      'Baggage and connection guidance',
      'Booking and itinerary support',
    ],
  },
  {
    slug: 'tours-holidays',
    name: 'Tours & Holidays',
    shortName: 'Holidays',
    icon: 'palm',
    summary: 'Curated holiday planning for individuals, couples, families and groups.',
    description:
      'Tell us how you like to travel and we will shape a holiday proposal around your dates, budget and priorities, including flights, stays and activities.',
    outcomes: [
      'A personalised holiday proposal',
      'Accommodation and activity options',
      'Practical travel and document guidance',
    ],
  },
]

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: 'Start with your goal',
    description:
      'Complete a short assessment or book a consultation. Tell us whether you are studying, visiting, travelling for business or planning a holiday.',
  },
  {
    title: 'Get a clear plan',
    description:
      'We review your information, explain realistic options and set out the documents and decisions required. Any fees are confirmed in writing before work starts.',
  },
  {
    title: 'Prepare and submit',
    description:
      'We support application preparation, flight options or holiday planning, with checks for consistency and completeness before anything is submitted.',
  },
  {
    title: 'Move forward confidently',
    description:
      'You receive practical next steps for interviews, travel, arrival or your trip. We remain available for follow-up questions within the agreed scope.',
  },
]

export const WHY_US = [
  {
    title: 'Advice before promises',
    description:
      'We explain what is realistic for your profile and avoid guaranteeing outcomes that depend on universities, embassies or airlines.',
  },
  {
    title: 'One journey, joined up',
    description:
      'Study, visa and travel support can be coordinated in one place, reducing gaps between admission, documentation and departure.',
  },
  {
    title: 'Document discipline',
    description:
      'Checklists, consistency reviews and clear timelines help you avoid avoidable errors and last-minute surprises.',
  },
  {
    title: 'Human support',
    description:
      'You deal with people who can explain the next step, not an automated queue. WhatsApp and email updates keep you informed.',
  },
]

export const DEFAULT_FAQS: Faq[] = [
  {
    id: 'faq-1',
    question: 'Do you guarantee admission or visa approval?',
    answer:
      'No. Admission decisions belong to institutions and visa decisions belong to the relevant authorities. We provide guidance, document support and preparation, but we cannot guarantee an outcome.',
    category: 'General',
    published: true,
  },
  {
    id: 'faq-2',
    question: 'How much do your services cost?',
    answer:
      'Fees depend on the service and scope of support. After your assessment or consultation, we confirm the applicable fees and what is included in writing before work begins. Third-party costs such as application, visa, tuition or airline fees are separate.',
    category: 'Fees & Payments',
    published: true,
  },
  {
    id: 'faq-3',
    question: 'Which study destinations do you support?',
    answer:
      'Our current destination pages cover the United Kingdom, Germany, Canada, the United States, Malaysia and Ireland. If your preferred destination is not listed, contact us and we will confirm whether we can support it.',
    category: 'Study Abroad',
    published: true,
  },
  {
    id: 'faq-4',
    question: 'Can you help if I have a previous visa refusal?',
    answer:
      'Yes, we can review your history and help you understand what may need to change in a new application. A previous refusal does not automatically prevent approval, but it must be addressed honestly and consistently.',
    category: 'Visas',
    published: true,
  },
  {
    id: 'faq-5',
    question: 'Do you help with scholarships?',
    answer:
      'We can point you toward scholarship sources and help you organise supporting documents. We do not award scholarships and cannot guarantee that you will receive one.',
    category: 'Study Abroad',
    published: true,
  },
  {
    id: 'faq-6',
    question: 'How early should I start my application?',
    answer:
      'Start as early as practical. University deadlines, visa processing and travel arrangements can take months. A useful target is six to twelve months before your intended intake, though timelines vary by destination and institution.',
    category: 'Study Abroad',
    published: true,
  },
  {
    id: 'faq-7',
    question: 'Can you book flights after my visa is approved?',
    answer:
      'Yes. We can compare flight options at any stage, but we recommend checking the visa and travel conditions before purchasing a restrictive ticket. Some destinations require proof of travel as part of the application.',
    category: 'Flights & Travel',
    published: true,
  },
  {
    id: 'faq-8',
    question: 'Do you arrange accommodation?',
    answer:
      'Accommodation support depends on the destination and the service you choose. Tell us what you need in your assessment and we will confirm what can be included in your plan.',
    category: 'Flights & Travel',
    published: true,
  },
  {
    id: 'faq-9',
    question: 'How will you contact me?',
    answer:
      'We use the contact details you provide, normally by email and WhatsApp. We only contact you about your enquiry and related services, and you can ask us to stop at any time.',
    category: 'General',
    published: true,
  },
  {
    id: 'faq-10',
    question: 'What information should I prepare before a consultation?',
    answer:
      'Bring your academic results, English test results if available, passport details, intended intake, preferred destinations and a realistic budget. For visa enquiries, include your travel purpose, dates and any previous refusal history.',
    category: 'General',
    published: true,
  },
]

export const SERVICE_LABELS: Record<string, string> = {
  'study-abroad': 'Study Abroad',
  'visa-services': 'Visa Consultancy',
  'flight-booking': 'Flight Booking',
  'tours-holidays': 'Tours & Holidays',
  other: 'Other / Not sure yet',
}

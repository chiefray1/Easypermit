export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

export interface SiteConfig {
  name: string
  shortName: string
  tagline: string
  legalName: string
  description: string
  contact: {
    phoneDisplay: string
    phoneE164: string
    whatsappE164: string
    email: string
    address: string
    hours: string
  }
  social: {
    instagram: string
    facebook: string
    tiktok: string
    linkedin: string
  }
}

export interface Service {
  slug: string
  name: string
  shortName: string
  icon: 'graduation' | 'passport' | 'plane' | 'palm'
  summary: string
  description: string
  outcomes: string[]
}

export interface ProcessStep {
  title: string
  description: string
}

export interface Faq {
  id: string
  question: string
  answer: string
  category: 'General' | 'Study Abroad' | 'Visas' | 'Flights & Travel' | 'Fees & Payments'
  published?: boolean
  createdAt?: string
}

export interface Destination {
  slug: string
  country: string
  flag: string
  image: string
  intro: string
  highlights: string[]
  reasons: string[]
  courses: string[]
  studyLevels: string[]
  requirements: string[]
  expensesNote: string
  scholarships: string[]
  intakes: string[]
  visaSteps: string[]
  lastVerified: string | null
  published: boolean
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  readMinutes: number
  publishedAt: string
  image: string
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[]
  published: boolean
}

export interface Testimonial {
  id: string
  clientName: string
  service: string
  destination?: string
  quote: string
  outcome?: string
  storyDate?: string
  permissionConfirmed: boolean
  published: boolean
  createdAt: string
}

export interface HolidayPackage {
  id: string
  title: string
  destination: string
  duration: string
  groupType: string
  departurePeriod: string
  inclusions: string[]
  exclusions: string[]
  indicativePrice: string
  currency: string
  priceNote: string
  published: boolean
  createdAt: string
}

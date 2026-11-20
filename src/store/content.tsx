import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ARTICLES } from '../data/articles'
import { HOLIDAY_PACKAGES, TESTIMONIALS } from '../data/content'
import { DESTINATIONS } from '../data/destinations'
import { DEFAULT_FAQS, DEFAULT_SITE_CONFIG } from '../data/site'
import type { Article, Destination, Faq, HolidayPackage, SiteConfig, Testimonial } from '../data/types'

const STORAGE_KEY = 'easypermit:content:v1'

export interface ContentState {
  site: SiteConfig
  destinations: Destination[]
  articles: Article[]
  faqs: Faq[]
  testimonials: Testimonial[]
  packages: HolidayPackage[]
}

export const DEFAULT_CONTENT: ContentState = {
  site: DEFAULT_SITE_CONFIG,
  destinations: DESTINATIONS,
  articles: ARTICLES,
  faqs: DEFAULT_FAQS,
  testimonials: TESTIMONIALS,
  packages: HOLIDAY_PACKAGES,
}

function normalizeSite(value: Partial<SiteConfig> | undefined): SiteConfig {
  return {
    ...DEFAULT_SITE_CONFIG,
    ...value,
    contact: { ...DEFAULT_SITE_CONFIG.contact, ...value?.contact },
    social: { ...DEFAULT_SITE_CONFIG.social, ...value?.social },
  }
}

function loadContent(): ContentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONTENT
    const parsed = JSON.parse(raw) as Partial<ContentState>
    return {
      site: normalizeSite(parsed.site),
      destinations: Array.isArray(parsed.destinations) ? parsed.destinations : DESTINATIONS,
      articles: Array.isArray(parsed.articles) ? parsed.articles : ARTICLES,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : DEFAULT_FAQS,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : TESTIMONIALS,
      packages: Array.isArray(parsed.packages) ? parsed.packages : HOLIDAY_PACKAGES,
    }
  } catch {
    return DEFAULT_CONTENT
  }
}

interface ContentContextValue extends ContentState {
  updateSite: (patch: Partial<SiteConfig>) => void
  saveDestination: (destination: Destination) => void
  saveArticle: (article: Article) => void
  deleteArticle: (slug: string) => void
  saveFaq: (faq: Faq) => void
  deleteFaq: (id: string) => void
  saveTestimonial: (testimonial: Testimonial) => void
  deleteTestimonial: (id: string) => void
  savePackage: (holidayPackage: HolidayPackage) => void
  deletePackage: (id: string) => void
  resetContent: () => void
  importContent: (json: string) => void
  exportContent: () => string
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentState>(() => loadContent())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    } catch {
      console.warn('Unable to save website content in this browser.')
    }
  }, [content])

  const updateSite = useCallback((patch: Partial<SiteConfig>) => {
    setContent((current) => ({
      ...current,
      site: {
        ...current.site,
        ...patch,
        contact: { ...current.site.contact, ...patch.contact },
        social: { ...current.site.social, ...patch.social },
      },
    }))
  }, [])

  const saveDestination = useCallback((destination: Destination) => {
    setContent((current) => {
      const exists = current.destinations.some((item) => item.slug === destination.slug)
      return {
        ...current,
        destinations: exists
          ? current.destinations.map((item) => (item.slug === destination.slug ? destination : item))
          : [...current.destinations, destination],
      }
    })
  }, [])

  const saveArticle = useCallback((article: Article) => {
    setContent((current) => {
      const exists = current.articles.some((item) => item.slug === article.slug)
      return {
        ...current,
        articles: exists
          ? current.articles.map((item) => (item.slug === article.slug ? article : item))
          : [article, ...current.articles],
      }
    })
  }, [])

  const deleteArticle = useCallback((slug: string) => {
    setContent((current) => ({ ...current, articles: current.articles.filter((item) => item.slug !== slug) }))
  }, [])

  const saveFaq = useCallback((faq: Faq) => {
    setContent((current) => {
      const exists = current.faqs.some((item) => item.id === faq.id)
      return {
        ...current,
        faqs: exists ? current.faqs.map((item) => (item.id === faq.id ? faq : item)) : [...current.faqs, faq],
      }
    })
  }, [])

  const deleteFaq = useCallback((id: string) => {
    setContent((current) => ({ ...current, faqs: current.faqs.filter((item) => item.id !== id) }))
  }, [])

  const saveTestimonial = useCallback((testimonial: Testimonial) => {
    setContent((current) => {
      const exists = current.testimonials.some((item) => item.id === testimonial.id)
      return {
        ...current,
        testimonials: exists
          ? current.testimonials.map((item) => (item.id === testimonial.id ? testimonial : item))
          : [testimonial, ...current.testimonials],
      }
    })
  }, [])

  const deleteTestimonial = useCallback((id: string) => {
    setContent((current) => ({
      ...current,
      testimonials: current.testimonials.filter((item) => item.id !== id),
    }))
  }, [])

  const savePackage = useCallback((holidayPackage: HolidayPackage) => {
    setContent((current) => {
      const exists = current.packages.some((item) => item.id === holidayPackage.id)
      return {
        ...current,
        packages: exists
          ? current.packages.map((item) => (item.id === holidayPackage.id ? holidayPackage : item))
          : [holidayPackage, ...current.packages],
      }
    })
  }, [])

  const deletePackage = useCallback((id: string) => {
    setContent((current) => ({ ...current, packages: current.packages.filter((item) => item.id !== id) }))
  }, [])

  const resetContent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setContent(DEFAULT_CONTENT)
  }, [])

  const importContent = useCallback((json: string) => {
    const parsed = JSON.parse(json) as Partial<ContentState>
    setContent({
      site: normalizeSite(parsed.site),
      destinations: Array.isArray(parsed.destinations) ? parsed.destinations : DESTINATIONS,
      articles: Array.isArray(parsed.articles) ? parsed.articles : ARTICLES,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : DEFAULT_FAQS,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : TESTIMONIALS,
      packages: Array.isArray(parsed.packages) ? parsed.packages : HOLIDAY_PACKAGES,
    })
  }, [])

  const exportContent = useCallback(() => JSON.stringify(content, null, 2), [content])

  const value = useMemo<ContentContextValue>(
    () => ({
      ...content,
      updateSite,
      saveDestination,
      saveArticle,
      deleteArticle,
      saveFaq,
      deleteFaq,
      saveTestimonial,
      deleteTestimonial,
      savePackage,
      deletePackage,
      resetContent,
      importContent,
      exportContent,
    }),
    [
      content,
      updateSite,
      saveDestination,
      saveArticle,
      deleteArticle,
      saveFaq,
      deleteFaq,
      saveTestimonial,
      deleteTestimonial,
      savePackage,
      deletePackage,
      resetContent,
      importContent,
      exportContent,
    ],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useContent must be used within ContentProvider')
  return context
}

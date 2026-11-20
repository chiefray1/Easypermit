import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: string
  noIndex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function Seo({ title, description, path = '/', image, type = 'website', noIndex, jsonLd }: SeoProps) {
  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || window.location.origin
    const canonical = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
    const fullTitle = title.includes('Easy Permit') ? title : `${title} | Easy Permit Travel Services`

    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:type', type)
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    if (image) {
      setMeta('property', 'og:image', image)
      setMeta('name', 'twitter:image', image)
    }

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical

    const oldScript = document.getElementById('easypermit-json-ld')
    if (oldScript) oldScript.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'easypermit-json-ld'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [title, description, path, image, type, noIndex, jsonLd])

  return null
}

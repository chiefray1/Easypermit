import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { track } from '../lib/analytics'
import { Cookie, X } from 'lucide-react'

const CONSENT_KEY = 'easypermit:cookie-consent'

function loadScript(id: string, src: string, onLoad?: () => void) {
  if (document.getElementById(id)) {
    onLoad?.()
    return
  }
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  script.onload = () => onLoad?.()
  document.head.appendChild(script)
}

export function Analytics() {
  const location = useLocation()
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
    const metaId = import.meta.env.VITE_META_PIXEL_ID
    const tiktokId = import.meta.env.VITE_TIKTOK_PIXEL_ID
    if (!gaId && !metaId && !tiktokId) return

    let started = false
    function start() {
      if (started) return
      started = true

      if (gaId) {
        loadScript('easypermit-ga', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`, () => {
          window.dataLayer = window.dataLayer || []
          window.gtag = function gtag(...args: unknown[]) {
            window.dataLayer?.push(args)
          }
          window.gtag('js', new Date())
          window.gtag('config', gaId, { anonymize_ip: true })
        })
      }

      if (metaId) {
        const fbq = (...args: unknown[]) => {
          const queue = ((window.fbq as unknown as { queue?: unknown[][] }).queue ??= [])
          queue.push(args)
        }
        window.fbq = window.fbq || fbq
        window.fbq?.('init', metaId)
        window.fbq?.('track', 'PageView')
        loadScript('easypermit-meta', 'https://connect.facebook.net/en_US/fbevents.js')
      }

      if (tiktokId) {
        window.ttq = window.ttq || {
          track: (...args: unknown[]) => {
            const queue = ((window.ttq as unknown as { queue?: unknown[][] }).queue ??= [])
            queue.push(args)
          },
        }
        window.ttq.load?.(tiktokId)
        window.ttq.track('PageView')
        loadScript('easypermit-tiktok', 'https://analytics.tiktok.com/i18n/pixel/events.js')
      }
    }

    if (localStorage.getItem(CONSENT_KEY) === 'granted') {
      setGranted(true)
      start()
    }
    const handler = (event: Event) => {
      const value = (event as CustomEvent<string>).detail
      setGranted(value === 'granted')
      if (value === 'granted') start()
    }
    window.addEventListener('easypermit:consent', handler)
    return () => window.removeEventListener('easypermit:consent', handler)
  }, [])

  useEffect(() => {
    if (!granted) return
    track('page_view', { page_path: `${location.pathname}${location.search}` })
  }, [granted, location.pathname, location.search])

  return null
}

export function ConsentBanner() {
  const hasAnalytics = Boolean(
    import.meta.env.VITE_GA_MEASUREMENT_ID || import.meta.env.VITE_META_PIXEL_ID || import.meta.env.VITE_TIKTOK_PIXEL_ID,
  )
  const [choice, setChoice] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CONSENT_KEY)
    } catch {
      return null
    }
  })

  if (!hasAnalytics || choice) return null

  function decide(value: 'granted' | 'denied') {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      console.warn('Unable to save cookie preference.')
    }
    setChoice(value)
    window.dispatchEvent(new CustomEvent('easypermit:consent', { detail: value }))
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-4xl rounded-2xl border border-navy-200 bg-white p-4 shadow-lift sm:bottom-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-50 text-gold-700">
          <Cookie className="h-5 w-5" />
        </span>
        <p className="flex-1 text-[12px] leading-relaxed text-body/75">
          We use optional analytics to understand how the website is used. You can accept or decline. Essential
          functionality is not affected.{' '}
          <Link to="/privacy-policy" className="font-semibold text-navy-800 underline decoration-gold-400 underline-offset-2">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => decide('denied')} className="btn-outline px-3 py-2 text-[11px]">
            Decline
          </button>
          <button type="button" onClick={() => decide('granted')} className="btn-primary px-3 py-2 text-[11px]">
            Accept analytics
          </button>
          <button type="button" onClick={() => decide('denied')} className="grid h-9 w-9 place-items-center rounded-lg text-navy-400 hover:bg-navy-50" aria-label="Dismiss cookie notice">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

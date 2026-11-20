type EventPayload = Record<string, unknown>

export function track(event: string, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...payload })
  window.gtag?.('event', event, payload)
  window.fbq?.('trackCustom', event, payload)
  window.ttq?.track(event, payload)
}

export function getUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']
  const result: Record<string, string> = {}
  for (const key of keys) {
    const value = params.get(key)
    if (value) result[key] = value.slice(0, 200)
  }
  if (Object.keys(result).length > 0) {
    try {
      sessionStorage.setItem('easypermit:utm', JSON.stringify(result))
    } catch {
      return result
    }
  }
  try {
    const stored = sessionStorage.getItem('easypermit:utm')
    return stored ? { ...JSON.parse(stored), ...result } : result
  } catch {
    return result
  }
}

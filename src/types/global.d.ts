export {}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    ttq?: {
      track: (...args: unknown[]) => void
      load?: (id: string) => void
      queue?: unknown[][]
    }
  }
}

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useContent } from '../store/content'
import { buildWhatsAppLink } from '../lib/utils'
import { track } from '../lib/analytics'

function messageForPath(path: string): string {
  if (path.startsWith('/study-abroad') || path.startsWith('/study-destinations')) {
    return 'Hello Easy Permit, I would like help with studying abroad.'
  }
  if (path.startsWith('/visa-services')) {
    return 'Hello Easy Permit, I would like help with a visa application.'
  }
  if (path.startsWith('/flight-booking')) {
    return 'Hello Easy Permit, I would like help with a flight reservation.'
  }
  if (path.startsWith('/tours-holidays') || path.startsWith('/travel-services')) {
    return 'Hello Easy Permit, I would like help planning a trip.'
  }
  return 'Hello Easy Permit, I would like help with my plans.'
}

export function WhatsAppButton() {
  const { site } = useContent()
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const number = site.contact.whatsappE164 || import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const link = buildWhatsAppLink(number, messageForPath(location.pathname))

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  if (!link) return null

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      onClick={() => track('whatsapp_click', { placement: 'floating', page_path: location.pathname })}
      className={`fixed bottom-5 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-white shadow-lift transition duration-500 hover:bg-[#116f4c] sm:bottom-7 sm:right-7 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      aria-label="Chat with Easy Permit on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}

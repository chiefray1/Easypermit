import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { NAV_ITEMS } from '../data/site'
import { useContent } from '../store/content'
import { buildWhatsAppLink, cn } from '../lib/utils'
import { Logo } from './Logo'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const location = useLocation()
  const { site } = useContent()
  const whatsappNumber = site.contact.whatsappE164 || import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const whatsapp = buildWhatsAppLink(whatsappNumber, 'Hello Easy Permit, I would like help with my plans.')

  useEffect(() => {
    setOpen(false)
    setOpenGroup(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100/80 bg-white/95 backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <div key={item.href} className="group relative">
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold transition',
                    isActive ? 'text-navy-900' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900',
                  )
                }
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5 text-navy-400 transition group-hover:rotate-180" />}
              </NavLink>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-60 translate-y-1 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-navy-100 bg-white p-1.5 shadow-lift">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={({ isActive }) =>
                          cn(
                            'block rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition',
                            isActive ? 'bg-navy-50 text-navy-900' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900',
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {site.contact.phoneDisplay && (
            <a
              href={`tel:${site.contact.phoneE164 || site.contact.phoneDisplay}`}
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-navy-700 hover:bg-navy-50 2xl:inline-flex"
            >
              <Phone className="h-4 w-4 text-gold-600" />
              {site.contact.phoneDisplay}
            </a>
          )}
          <Link to="/get-started" className="btn-primary hidden sm:inline-flex">
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-navy-200 text-navy-800 xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-[72px] z-40 h-[calc(100dvh-72px)] overflow-y-auto border-t border-navy-100 bg-white xl:hidden">
          <nav className="container-x space-y-1 py-5" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="border-b border-navy-50 last:border-0">
                <div className="flex items-center justify-between">
                  <Link to={item.href} className="flex-1 py-3.5 text-[15px] font-semibold text-navy-900">
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      onClick={() => setOpenGroup((current) => (current === item.href ? null : item.href))}
                      className="grid h-10 w-10 place-items-center rounded-lg text-navy-500 hover:bg-navy-50"
                      aria-label={`Show ${item.label} links`}
                      aria-expanded={openGroup === item.href}
                    >
                      <ChevronDown className={cn('h-4 w-4 transition', openGroup === item.href && 'rotate-180')} />
                    </button>
                  )}
                </div>
                {item.children && openGroup === item.href && (
                  <div className="pb-3 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50 hover:text-navy-900"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="space-y-3 pt-5">
              <Link to="/get-started" className="btn-primary w-full">
                Get Started
              </Link>
              <Link to="/contact" className="btn-outline w-full">
                Send an enquiry
              </Link>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-outline w-full border-success/30 text-success">
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

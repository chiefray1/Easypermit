import { Link } from 'react-router-dom'

export function Logo({ variant = 'dark', compact = false }: { variant?: 'dark' | 'light'; compact?: boolean }) {
  const isLight = variant === 'light'
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="Easy Permit Travel Services home">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-navy-900 shadow-sm ring-1 ring-white/10">
        <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
          <path d="M7 25c4.8 5.7 12.4 7.6 19.2 4.2" fill="none" stroke="#C49A48" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="19" r="10.5" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="1.4" />
          <path d="M9.8 16.5h20.4M10.5 23h19M20 8.5c3.4 3.8 3.4 17.2 0 21M20 8.5c-3.4 3.8-3.4 17.2 0 21" fill="none" stroke="#fff" strokeOpacity=".38" strokeWidth="1" />
          <path d="M25.9 12.4l-8.8 8.8-3.3-1.2 5.7-5.7 6.4-1.9z" fill="#C49A48" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-[17px] font-extrabold tracking-tight ${isLight ? 'text-white' : 'text-navy-900'}`}>
            Easy Permit
          </span>
          <span className={`mt-1 text-[9px] font-bold uppercase tracking-[0.19em] ${isLight ? 'text-gold-200' : 'text-navy-400'}`}>
            Travel Services
          </span>
        </span>
      )}
    </Link>
  )
}

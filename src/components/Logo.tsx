import { Link } from 'react-router-dom'

export function Logo({ variant = 'dark', compact = false }: { variant?: 'dark' | 'light'; compact?: boolean }) {
  const isLight = variant === 'light'
  return (
    <Link to="/" className="group inline-flex items-center" aria-label="Easy Permit Travel Services home">
      <img
        src="/easypermit-logo.jpg"
        alt="Easy Permit Travel Services"
        width={1600}
        height={666}
        className={`w-auto rounded-lg object-contain shadow-sm ring-1 ${
          compact ? 'h-9' : 'h-10 sm:h-11'
        } ${isLight ? 'ring-white/15' : 'ring-navy-100'}`}
      />
    </Link>
  )
}

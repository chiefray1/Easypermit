import { useEffect, useState, type ImgHTMLAttributes } from 'react'
import { cn } from '../lib/utils'

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string
}

export function ImageWithFallback({ src, alt, className, fallbackClassName, ...props }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (failed || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900',
          className,
          fallbackClassName,
        )}
        aria-label={alt}
        role="img"
      >
        <svg viewBox="0 0 80 80" className="h-16 w-16 opacity-60" aria-hidden="true">
          <circle cx="40" cy="40" r="21" fill="none" stroke="#C49A48" strokeWidth="1.5" />
          <path d="M19 40h42M40 19c7 7 7 35 0 42M40 19c-7 7-7 35 0 42" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1" />
        </svg>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" {...props} />
}

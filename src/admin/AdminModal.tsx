import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

export function AdminModal({
  title,
  description,
  onClose,
  children,
  size = 'default',
}: {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  size?: 'default' | 'wide'
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/45 p-3 sm:p-6" onClick={onClose} role="presentation">
      <div
        className={cn('my-4 w-full rounded-2xl bg-white shadow-2xl', size === 'wide' ? 'max-w-4xl' : 'max-w-2xl')}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy-100 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-navy-900">{title}</h2>
            {description && <p className="mt-0.5 text-[11.5px] text-navy-400">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-navy-400 hover:bg-navy-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function CheckboxRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-3.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-navy-300 text-navy-800 focus:ring-gold-300"
      />
      <span>
        <span className="block text-[12.5px] font-semibold text-navy-800">{label}</span>
        {description && <span className="mt-0.5 block text-[11px] leading-relaxed text-navy-400">{description}</span>}
      </span>
    </label>
  )
}

export function AdminFormActions({
  onCancel,
  submitLabel = 'Save changes',
  saving,
}: {
  onCancel: () => void
  submitLabel?: string
  saving?: boolean
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-navy-100 pt-4 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} className="btn-outline">{'Cancel'}</button>
      <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : submitLabel}</button>
    </div>
  )
}

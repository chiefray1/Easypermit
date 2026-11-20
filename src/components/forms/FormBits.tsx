import type { ChangeEvent, ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SubmissionResult } from '../../types/leads'
import { cn } from '../../lib/utils'

interface BaseFieldProps {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  hint?: string
  className?: string
  autoComplete?: string
}

export function TextField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  hint,
  type = 'text',
  className,
  autoComplete,
}: BaseFieldProps & { type?: string }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>
        {label} {required && <span className="text-gold-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className={cn('field', error && 'border-red-400 focus:border-red-400 focus:ring-red-100')}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
      />
      {hint && !error && <p id={`${name}-hint`} className="mt-1.5 text-[11px] text-navy-400">{hint}</p>}
      {error && <p id={`${name}-error`} className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  )
}

export function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  error,
  required,
  placeholder = 'Select an option',
  hint,
  className,
}: BaseFieldProps & { options: Array<string | { value: string; label: string }> }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>
        {label} {required && <span className="text-gold-600">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn('field', error && 'border-red-400 focus:border-red-400 focus:ring-red-100')}
        aria-invalid={Boolean(error)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const normalized = typeof option === 'string' ? { value: option, label: option } : option
          return (
            <option key={normalized.value} value={normalized.value}>
              {normalized.label}
            </option>
          )
        })}
      </select>
      {hint && !error && <p className="mt-1.5 text-[11px] text-navy-400">{hint}</p>}
      {error && <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  )
}

export function TextareaField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  hint,
  rows = 3,
  className,
}: BaseFieldProps & { rows?: number }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>
        {label} {required && <span className="text-gold-600">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={cn('field resize-y', error && 'border-red-400 focus:border-red-400 focus:ring-red-100')}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
      {hint && !error && <p className="mt-1.5 text-[11px] text-navy-400">{hint}</p>}
      {error && <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  )
}

export function ConsentField({
  checked,
  onChange,
  error,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-navy-300 text-navy-800 focus:ring-gold-300"
        />
        <span className="text-[12.5px] leading-relaxed text-body/80">
          I agree that Easy Permit Travel Services may contact me about this enquiry and store my details in line with the{' '}
          <Link to="/privacy-policy" className="font-semibold text-navy-800 underline decoration-gold-400 underline-offset-2">
            privacy policy
          </Link>
          . I understand that no outcome is guaranteed.
        </span>
      </label>
      {error && <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  )
}

export function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-[11px] font-semibold text-navy-400">
        <span>Step {current + 1} of {total}</span>
        <span>{labels[current]}</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            className={cn('h-1.5 flex-1 rounded-full transition', index <= current ? 'bg-gold-500' : 'bg-navy-100')}
          />
        ))}
      </div>
    </div>
  )
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Sending…
        </>
      ) : (
        <>
          <ShieldCheck className="h-4 w-4" /> {children}
        </>
      )}
    </button>
  )
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[12.5px] text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}

export function SuccessPanel({
  result,
  onReset,
  title = 'Enquiry received',
}: {
  result: SubmissionResult
  onReset: () => void
  title?: string
}) {
  return (
    <div className="rounded-2xl border border-success/20 bg-white p-6 text-center sm:p-8">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-display text-xl font-bold text-navy-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-body/75">{result.message}</p>
      <p className="mt-3 text-[11px] text-navy-400">
        Reference: <span className="font-mono">{result.id.slice(0, 8)}</span>
      </p>
      {result.source === 'local' && (
        <p className="mx-auto mt-4 max-w-md rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
          Preview mode: this submission is stored in this browser only. Add Supabase environment variables to persist leads.
        </p>
      )}
      <button type="button" onClick={onReset} className="btn-outline mt-5">
        Submit another enquiry
      </button>
    </div>
  )
}

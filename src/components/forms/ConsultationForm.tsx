import { useState, type FormEvent } from 'react'
import { CalendarCheck } from 'lucide-react'
import { getUtm, track } from '../../lib/analytics'
import { submitConsultation } from '../../lib/leads'
import { isEmail, isPhone } from '../../lib/utils'
import type { ServiceCategory, SubmissionResult } from '../../types/leads'
import { ConsentField, FormAlert, SelectField, SubmitButton, SuccessPanel, TextField, TextareaField } from './FormBits'

const SERVICE_OPTIONS = [
  { value: 'study-abroad', label: 'Study abroad' },
  { value: 'visa-services', label: 'Visa application' },
  { value: 'flight-booking', label: 'Flight booking' },
  { value: 'tours-holidays', label: 'Holiday planning' },
  { value: 'other', label: 'Something else' },
]

export function ConsultationForm({ source, defaultService = 'other' }: { source: string; defaultService?: ServiceCategory }) {
  const [values, setValues] = useState<Record<string, string>>({ service: defaultService })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [result, setResult] = useState<SubmissionResult | null>(null)

  function update(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}
    if (!values.fullName?.trim()) nextErrors.fullName = 'Please enter your name.'
    if (!values.email?.trim() || !isEmail(values.email)) nextErrors.email = 'Enter a valid email address.'
    if (!values.phone?.trim() || !isPhone(values.phone)) nextErrors.phone = 'Enter a valid phone number.'
    if (!values.service) nextErrors.service = 'Choose the service you need.'
    if (!values.preferredDate) nextErrors.preferredDate = 'Choose a preferred date.'
    if (!consent) nextErrors.consent = 'Please confirm consent to continue.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const response = await submitConsultation({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        serviceCategory: (values.service || 'other') as ServiceCategory,
        preferredDate: values.preferredDate ?? '',
        preferredTime: values.preferredTime ?? '',
        notes: values.notes ?? '',
        consent,
        leadSource: source,
        website: values.website ?? '',
      })
      track('consultation_requested', { service: values.service, source, result_source: response.source, utm: getUtm() })
      setResult(response)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (result) return <SuccessPanel result={result} onReset={() => setResult(null)} title="Consultation request received" />

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <input
        type="text"
        name="website"
        value={values.website ?? ''}
        onChange={(event) => update('website', event.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {serverError && <div className="sm:col-span-2"><FormAlert>{serverError}</FormAlert></div>}
      <SelectField
        name="service"
        label="What do you need help with?"
        value={values.service ?? ''}
        onChange={(value) => update('service', value)}
        options={SERVICE_OPTIONS}
        error={errors.service}
        required
      />
      <SelectField
        name="preferredTime"
        label="Preferred time"
        value={values.preferredTime ?? ''}
        onChange={(value) => update('preferredTime', value)}
        options={['Morning (9:00–12:00)', 'Afternoon (12:00–15:00)', 'Late afternoon (15:00–17:00)', 'Any time']}
        error={errors.preferredTime}
      />
      <TextField
        name="preferredDate"
        label="Preferred date"
        type="date"
        value={values.preferredDate ?? ''}
        onChange={(value) => update('preferredDate', value)}
        error={errors.preferredDate}
        required
      />
      <TextField
        name="phone"
        label="Phone or WhatsApp number"
        type="tel"
        value={values.phone ?? ''}
        onChange={(value) => update('phone', value)}
        placeholder="Include country code"
        error={errors.phone}
        autoComplete="tel"
        required
      />
      <TextField
        name="fullName"
        label="Full name"
        value={values.fullName ?? ''}
        onChange={(value) => update('fullName', value)}
        error={errors.fullName}
        autoComplete="name"
        required
      />
      <TextField
        name="email"
        label="Email address"
        type="email"
        value={values.email ?? ''}
        onChange={(value) => update('email', value)}
        error={errors.email}
        autoComplete="email"
        required
      />
      <TextareaField
        name="notes"
        label="What would you like to discuss?"
        value={values.notes ?? ''}
        onChange={(value) => update('notes', value)}
        placeholder="A short summary helps us prepare for the call"
        className="sm:col-span-2"
      />
      <div className="sm:col-span-2">
        <ConsentField checked={consent} onChange={setConsent} error={errors.consent} />
      </div>
      <div className="flex items-center justify-between gap-4 sm:col-span-2">
        <p className="hidden items-center gap-1.5 text-[11px] text-navy-400 sm:flex">
          <CalendarCheck className="h-3.5 w-3.5" /> We will confirm the time by email or WhatsApp.
        </p>
        <SubmitButton loading={loading}>Request consultation</SubmitButton>
      </div>
    </form>
  )
}

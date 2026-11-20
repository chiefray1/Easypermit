import { useState, type FormEvent } from 'react'
import { getUtm, track } from '../../lib/analytics'
import { submitFlightEnquiry } from '../../lib/leads'
import { isEmail, isPhone } from '../../lib/utils'
import type { SubmissionResult } from '../../types/leads'
import { ConsentField, FormAlert, SelectField, SubmitButton, SuccessPanel, TextField, TextareaField } from './FormBits'

export function FlightForm({ source }: { source: string }) {
  const [values, setValues] = useState<Record<string, string>>({ tripType: 'Return', passengers: '1', cabinClass: 'Economy' })
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
    if (!values.departureCity?.trim()) nextErrors.departureCity = 'Enter your departure city.'
    if (!values.destination?.trim()) nextErrors.destination = 'Enter your destination.'
    if (!values.departureDate) nextErrors.departureDate = 'Choose a departure date.'
    if (values.tripType === 'Return' && !values.returnDate) nextErrors.returnDate = 'Choose a return date.'
    if (!values.passengers) nextErrors.passengers = 'Select the number of passengers.'
    if (!values.fullName?.trim()) nextErrors.fullName = 'Please enter your name.'
    if (!values.email?.trim() || !isEmail(values.email)) nextErrors.email = 'Enter a valid email address.'
    if (!values.phone?.trim() || !isPhone(values.phone)) nextErrors.phone = 'Enter a valid phone number.'
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
      const response = await submitFlightEnquiry({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        departureCity: values.departureCity,
        destination: values.destination,
        departureDate: values.departureDate,
        returnDate: values.tripType === 'Return' ? values.returnDate ?? '' : '',
        tripType: values.tripType,
        passengers: values.passengers,
        cabinClass: values.cabinClass,
        notes: values.notes ?? '',
        consent,
        leadSource: source,
        website: values.website ?? '',
      })
      track('flight_enquiry', { source, result_source: response.source, utm: getUtm() })
      setResult(response)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (result) return <SuccessPanel result={result} onReset={() => setResult(null)} title="Flight request received" />

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
        name="tripType"
        label="Trip type"
        value={values.tripType ?? ''}
        onChange={(value) => update('tripType', value)}
        options={['Return', 'One way']}
        error={errors.tripType}
        required
      />
      <SelectField
        name="cabinClass"
        label="Cabin class"
        value={values.cabinClass ?? ''}
        onChange={(value) => update('cabinClass', value)}
        options={['Economy', 'Premium economy', 'Business', 'First']}
        error={errors.cabinClass}
        required
      />
      <TextField
        name="departureCity"
        label="Departure city / airport"
        value={values.departureCity ?? ''}
        onChange={(value) => update('departureCity', value)}
        placeholder="e.g. Lagos (LOS)"
        error={errors.departureCity}
        required
      />
      <TextField
        name="destination"
        label="Destination city / airport"
        value={values.destination ?? ''}
        onChange={(value) => update('destination', value)}
        placeholder="e.g. London (LHR)"
        error={errors.destination}
        required
      />
      <TextField
        name="departureDate"
        label="Departure date"
        type="date"
        value={values.departureDate ?? ''}
        onChange={(value) => update('departureDate', value)}
        error={errors.departureDate}
        required
      />
      {values.tripType === 'Return' && (
        <TextField
          name="returnDate"
          label="Return date"
          type="date"
          value={values.returnDate ?? ''}
          onChange={(value) => update('returnDate', value)}
          error={errors.returnDate}
          required
        />
      )}
      <SelectField
        name="passengers"
        label="Passengers"
        value={values.passengers ?? ''}
        onChange={(value) => update('passengers', value)}
        options={['1', '2', '3', '4', '5', '6+']}
        error={errors.passengers}
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
        label="Flexibility or preferences"
        value={values.notes ?? ''}
        onChange={(value) => update('notes', value)}
        placeholder="Preferred airline, baggage needs, flexible dates"
        className="sm:col-span-2"
      />
      <div className="sm:col-span-2">
        <ConsentField checked={consent} onChange={setConsent} error={errors.consent} />
      </div>
      <div className="sm:col-span-2 sm:text-right">
        <SubmitButton loading={loading}>Request flight options</SubmitButton>
      </div>
    </form>
  )
}

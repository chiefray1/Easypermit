import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { DESTINATIONS } from '../../data/destinations'
import { getUtm, track } from '../../lib/analytics'
import { isEmail, isPhone } from '../../lib/utils'
import { submitEnquiry } from '../../lib/leads'
import type { SubmissionResult } from '../../types/leads'
import {
  ConsentField,
  FormAlert,
  SelectField,
  StepIndicator,
  SubmitButton,
  SuccessPanel,
  TextField,
  TextareaField,
} from './FormBits'

type AssessmentKind = 'study-abroad' | 'visa-services' | 'tours-holidays'

const STUDY_DESTINATIONS = [...DESTINATIONS.map((destination) => destination.country), 'Not sure yet', 'Other']
const VISA_DESTINATIONS = [
  'United Kingdom',
  'Canada',
  'United States',
  'Germany',
  'Ireland',
  'Malaysia',
  'Schengen area',
  'United Arab Emirates',
  'Other',
  'Not sure yet',
]

const CONTACT_FIELDS = ['fullName', 'email', 'phone', 'countryOfResidence'] as const

const STEP_LABELS: Record<AssessmentKind, string[]> = {
  'study-abroad': ['Study goal', 'Your profile', 'Contact details'],
  'visa-services': ['Visa need', 'Application history', 'Contact details'],
  'tours-holidays': ['Trip idea', 'Preferences', 'Contact details'],
}

export function AssessmentForm({
  service,
  source,
  compact = false,
}: {
  service: AssessmentKind
  source: string
  compact?: boolean
}) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const formTop = useRef<HTMLDivElement>(null)
  const totalSteps = 3
  const labels = STEP_LABELS[service]

  useEffect(() => {
    track('assessment_started', { service, source })
  }, [service, source])

  function update(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function requiredStepFields(index: number): string[] {
    if (index === 2) return [...CONTACT_FIELDS]
    if (service === 'study-abroad') {
      return index === 0
        ? ['studyLevel', 'fieldOfStudy', 'destination', 'preferredIntake']
        : ['highestQualification', 'graduationYear', 'englishTest', 'budgetRange', 'passportStatus']
    }
    if (service === 'visa-services') {
      return index === 0 ? ['visaType', 'destination', 'purpose', 'intendedDate'] : ['previousRefusal', 'visaBudget']
    }
    return index === 0 ? ['destination', 'travelMonth', 'duration', 'travellers'] : ['budgetRange', 'interests']
  }

  function validateStep(index: number): boolean {
    const nextErrors: Record<string, string> = {}
    for (const field of requiredStepFields(index)) {
      if (!values[field]?.trim()) nextErrors[field] = 'This field is required.'
    }
    if (values.email && !isEmail(values.email)) nextErrors.email = 'Enter a valid email address.'
    if (values.phone && !isPhone(values.phone)) nextErrors.phone = 'Enter a valid phone number.'
    if (
      service === 'visa-services' &&
      (values.previousRefusal === 'Previous refusal' || values.previousRefusal === 'Prefer to explain') &&
      !values.refusalDetails?.trim()
    ) {
      nextErrors.refusalDetails = 'Please briefly describe what happened.'
    }
    if (index === totalSteps - 1 && !consent) nextErrors.consent = 'Please confirm consent to continue.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function goNext() {
    if (!validateStep(step)) return
    track('assessment_step', { service, step: step + 1 })
    setStep((current) => Math.min(current + 1, totalSteps - 1))
    window.setTimeout(() => formTop.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  function goBack() {
    setErrors({})
    setStep((current) => Math.max(current - 1, 0))
    window.setTimeout(() => formTop.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (step < totalSteps - 1) {
      goNext()
      return
    }
    for (let index = 0; index < totalSteps; index += 1) {
      if (!validateStep(index)) {
        setStep(index)
        return
      }
    }
    setLoading(true)
    setServerError('')
    try {
      const response = await submitEnquiry({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        countryOfResidence: values.countryOfResidence,
        serviceCategory: service,
        destination: values.destination ?? '',
        preferredIntake: values.preferredIntake || values.intendedDate || values.travelMonth || '',
        budgetRange: values.budgetRange ?? '',
        details: { ...values, assessmentType: service, source },
        consent,
        leadSource: source,
        utm: getUtm(),
      })
      track('assessment_completed', { service, source, result_source: response.source })
      setResult(response)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setResult(null)
    setStep(0)
    setValues({})
    setConsent(false)
    setErrors({})
    setServerError('')
  }

  if (result) {
    return (
      <div ref={formTop}>
        <SuccessPanel result={result} onReset={reset} title="Assessment received" />
      </div>
    )
  }

  return (
    <div ref={formTop} className={compact ? '' : 'rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-7'}>
      <StepIndicator current={step} total={totalSteps} labels={labels} />
      {serverError && <FormAlert>{serverError}</FormAlert>}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[11.5px] font-medium text-red-700">
          Please check the highlighted fields.
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
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
        {step === 0 && service === 'study-abroad' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="studyLevel"
              label="What do you want to study?"
              value={values.studyLevel ?? ''}
              onChange={(value) => update('studyLevel', value)}
              options={['Undergraduate', 'Postgraduate taught', 'Postgraduate research', 'Foundation or pathway', 'Not sure yet']}
              error={errors.studyLevel}
              required
            />
            <SelectField
              name="fieldOfStudy"
              label="Preferred course or field"
              value={values.fieldOfStudy ?? ''}
              onChange={(value) => update('fieldOfStudy', value)}
              options={[
                'Business and management',
                'Computing and IT',
                'Engineering',
                'Health and life sciences',
                'Law and social sciences',
                'Arts, media and design',
                'Other',
                'Not sure yet',
              ]}
              error={errors.fieldOfStudy}
              required
            />
            <SelectField
              name="destination"
              label="Preferred destination"
              value={values.destination ?? ''}
              onChange={(value) => update('destination', value)}
              options={STUDY_DESTINATIONS}
              error={errors.destination}
              required
            />
            <SelectField
              name="preferredIntake"
              label="Preferred start"
              value={values.preferredIntake ?? ''}
              onChange={(value) => update('preferredIntake', value)}
              options={['January 2027', 'May 2027', 'September 2027', 'January 2028', 'Not sure yet']}
              error={errors.preferredIntake}
              required
            />
          </div>
        )}

        {step === 1 && service === 'study-abroad' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="highestQualification"
              label="Highest academic qualification"
              value={values.highestQualification ?? ''}
              onChange={(value) => update('highestQualification', value)}
              options={['Secondary school / WAEC', 'OND or equivalent', 'HND or equivalent', 'Bachelor’s degree', 'Master’s degree', 'Doctorate', 'Other']}
              error={errors.highestQualification}
              required
            />
            <SelectField
              name="graduationYear"
              label="Graduation year"
              value={values.graduationYear ?? ''}
              onChange={(value) => update('graduationYear', value)}
              options={['2026', '2025', '2024', '2023', '2022', '2021', '2020 or earlier', 'Not yet graduated']}
              error={errors.graduationYear}
              required
            />
            <SelectField
              name="englishTest"
              label="English test status"
              value={values.englishTest ?? ''}
              onChange={(value) => update('englishTest', value)}
              options={['IELTS', 'TOEFL', 'PTE', 'Duolingo English Test', 'University test', 'Not taken yet', 'Not sure what is accepted']}
              error={errors.englishTest}
              required
            />
            <SelectField
              name="budgetRange"
              label="Approximate annual budget"
              value={values.budgetRange ?? ''}
              onChange={(value) => update('budgetRange', value)}
              options={['Under ₦5 million', '₦5m–₦10m', '₦10m–₦20m', '₦20m+', 'Prefer to discuss']}
              error={errors.budgetRange}
              required
            />
            <SelectField
              name="passportStatus"
              label="Passport status"
              value={values.passportStatus ?? ''}
              onChange={(value) => update('passportStatus', value)}
              options={['Valid for 6+ months', 'Expiring soon', 'No passport yet', 'Not sure']}
              error={errors.passportStatus}
              required
            />
            <TextareaField
              name="notes"
              label="Anything else we should know?"
              value={values.notes ?? ''}
              onChange={(value) => update('notes', value)}
              placeholder="Previous study, work experience, funding plans or questions"
              className="sm:col-span-2"
            />
          </div>
        )}

        {step === 0 && service === 'visa-services' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="visaType"
              label="Visa type"
              value={values.visaType ?? ''}
              onChange={(value) => update('visaType', value)}
              options={['Student visa', 'Visitor visa', 'Tourist visa', 'Business visa', 'Work visa', 'Other or not sure']}
              error={errors.visaType}
              required
            />
            <SelectField
              name="destination"
              label="Destination"
              value={values.destination ?? ''}
              onChange={(value) => update('destination', value)}
              options={VISA_DESTINATIONS}
              error={errors.destination}
              required
            />
            <TextField
              name="purpose"
              label="Purpose of travel"
              value={values.purpose ?? ''}
              onChange={(value) => update('purpose', value)}
              placeholder="e.g. visit family, attend a conference"
              error={errors.purpose}
              required
            />
            <TextField
              name="intendedDate"
              label="Intended travel date"
              type="date"
              value={values.intendedDate ?? ''}
              onChange={(value) => update('intendedDate', value)}
              error={errors.intendedDate}
              required
            />
          </div>
        )}

        {step === 1 && service === 'visa-services' && (
          <div className="grid gap-4">
            <SelectField
              name="previousRefusal"
              label="Previous visa application experience"
              value={values.previousRefusal ?? ''}
              onChange={(value) => update('previousRefusal', value)}
              options={['No previous application', 'Previous approval', 'Previous refusal', 'Prefer to explain']}
              error={errors.previousRefusal}
              required
            />
            <SelectField
              name="visaBudget"
              label="Estimated travel budget"
              value={values.visaBudget ?? ''}
              onChange={(value) => update('visaBudget', value)}
              options={['Under ₦500,000', '₦500,000–₦1m', '₦1m–₦3m', '₦3m+', 'Prefer to discuss']}
              error={errors.visaBudget}
              required
            />
            {values.previousRefusal && (values.previousRefusal === 'Previous refusal' || values.previousRefusal === 'Prefer to explain') && (
              <TextareaField
                name="refusalDetails"
                label="What happened?"
                value={values.refusalDetails ?? ''}
                onChange={(value) => update('refusalDetails', value)}
                placeholder="Country, approximate date and the reason given, if you know it"
                error={errors.refusalDetails}
                required
              />
            )}
            <TextareaField
              name="notes"
              label="Anything else we should know?"
              value={values.notes ?? ''}
              onChange={(value) => update('notes', value)}
              placeholder="Travel history, sponsor details or questions"
            />
          </div>
        )}

        {step === 0 && service === 'tours-holidays' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="destination"
              label="Where would you like to go?"
              value={values.destination ?? ''}
              onChange={(value) => update('destination', value)}
              options={['Dubai, UAE', 'United Kingdom', 'Europe', 'Caribbean', 'Africa', 'Asia', 'Not sure yet', 'Other']}
              error={errors.destination}
              required
            />
            <TextField
              name="travelMonth"
              label="Preferred travel period"
              value={values.travelMonth ?? ''}
              onChange={(value) => update('travelMonth', value)}
              placeholder="e.g. July 2027 or December"
              error={errors.travelMonth}
              required
            />
            <SelectField
              name="duration"
              label="Trip length"
              value={values.duration ?? ''}
              onChange={(value) => update('duration', value)}
              options={['3–4 days', '5–7 days', '8–10 days', '2 weeks or more', 'Not sure yet']}
              error={errors.duration}
              required
            />
            <SelectField
              name="travellers"
              label="Number of travellers"
              value={values.travellers ?? ''}
              onChange={(value) => update('travellers', value)}
              options={['1', '2', '3–4', '5+']}
              error={errors.travellers}
              required
            />
          </div>
        )}

        {step === 1 && service === 'tours-holidays' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="budgetRange"
              label="Approximate trip budget"
              value={values.budgetRange ?? ''}
              onChange={(value) => update('budgetRange', value)}
              options={['Under ₦1 million', '₦1m–₦3m', '₦3m–₦6m', '₦6m+', 'Prefer to discuss']}
              error={errors.budgetRange}
              required
            />
            <SelectField
              name="interests"
              label="Holiday type"
              value={values.interests ?? ''}
              onChange={(value) => update('interests', value)}
              options={['Beach and relaxation', 'City and culture', 'Family friendly', 'Adventure', 'Luxury', 'Mixed']}
              error={errors.interests}
              required
            />
            <TextareaField
              name="notes"
              label="Anything else we should know?"
              value={values.notes ?? ''}
              onChange={(value) => update('notes', value)}
              placeholder="Must-see places, celebration, accessibility needs or preferences"
              className="sm:col-span-2"
            />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
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
              name="countryOfResidence"
              label="Country of residence"
              value={values.countryOfResidence ?? ''}
              onChange={(value) => update('countryOfResidence', value)}
              error={errors.countryOfResidence}
              autoComplete="country-name"
              required
            />
            <div className="sm:col-span-2">
              <ConsentField checked={consent} onChange={setConsent} error={errors.consent} />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={goBack} className="btn-ghost">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <p className="text-[11px] text-navy-400">No payment required to start.</p>
          )}
          {step < totalSteps - 1 ? (
            <button type="button" onClick={goNext} className="btn-primary">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <SubmitButton loading={loading}>Send my assessment</SubmitButton>
          )}
        </div>
      </form>
    </div>
  )
}

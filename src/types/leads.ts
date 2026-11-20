export type LeadKind = 'enquiry' | 'consultation' | 'flight'

export type ServiceCategory = 'study-abroad' | 'visa-services' | 'flight-booking' | 'tours-holidays' | 'other'

export interface LeadBase {
  fullName: string
  email: string
  phone: string
  countryOfResidence: string
  serviceCategory: ServiceCategory
  destination: string
  preferredIntake: string
  budgetRange: string
  details: Record<string, unknown>
  consent: boolean
  leadSource: string
  utm: Record<string, string>
}

export interface ConsultationInput {
  fullName: string
  email: string
  phone: string
  serviceCategory: ServiceCategory
  preferredDate: string
  preferredTime: string
  notes: string
  consent: boolean
  leadSource: string
  website?: string
}

export interface FlightInput {
  fullName: string
  email: string
  phone: string
  departureCity: string
  destination: string
  departureDate: string
  returnDate: string
  tripType: string
  passengers: string
  cabinClass: string
  notes: string
  consent: boolean
  leadSource: string
  website?: string
}

export interface SubmissionResult {
  id: string
  source: 'supabase' | 'local'
  integrationStatus: string
  message: string
}

export interface StoredLead {
  id: string
  kind: LeadKind
  created_at: string
  integration_status: string
  status?: string
  full_name: string
  email: string
  phone: string
  country_of_residence?: string
  service_category?: string
  destination?: string
  preferred_intake?: string
  budget_range?: string
  details?: Record<string, unknown>
  notes?: string
  preferred_date?: string
  preferred_time?: string
  departure_city?: string
  departure_date?: string
  return_date?: string
  trip_type?: string
  passengers?: string
  cabin_class?: string
  lead_source?: string
  consent?: boolean
}

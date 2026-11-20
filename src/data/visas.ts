export interface VisaService {
  slug: string
  name: string
  shortName: string
  summary: string
  description: string
  forWho: string[]
  documents: string[]
  process: string[]
  notes: string[]
  timeline: string
}

export const VISA_SERVICES: VisaService[] = [
  {
    slug: 'student-visa',
    name: 'Student Visa Support',
    shortName: 'Student Visa',
    summary: 'Application preparation for students who have an offer or are planning to study abroad.',
    description:
      'Student visa requirements differ by destination. We help you understand the evidence expected, organise your documents and prepare a consistent application that reflects your study plan and finances.',
    forWho: [
      'Students with an offer or conditional offer',
      'Applicants preparing for an upcoming intake',
      'Students who need to understand financial and document requirements',
      'Applicants preparing for an interview or biometrics appointment',
    ],
    documents: [
      'Valid passport and identity documents',
      'Admission or acceptance documentation',
      'Academic transcripts and certificates',
      'Language test results where required',
      'Proof of tuition payment or funding',
      'Evidence of living-cost funds',
      'Sponsor documents and relationship evidence where applicable',
      'Study plan or statement of purpose',
    ],
    process: [
      'Review your offer, destination rules and intended travel date',
      'Confirm the financial evidence required for your case',
      'Build and check your document set',
      'Complete the application and pay official fees',
      'Attend biometrics, interview or document submission as required',
      'Track the decision and prepare for travel',
    ],
    notes: [
      'The institution and immigration authority make the final decision.',
      'Financial evidence rules and processing times change; we verify current requirements.',
      'Do not purchase a non-refundable ticket before the visa conditions are clear.',
    ],
    timeline:
      'Start as early as possible, ideally several months before your intake. Official processing times vary by destination and season.',
  },
  {
    slug: 'visitor-visa',
    name: 'Visitor Visa Support',
    shortName: 'Visitor Visa',
    summary: 'Support for family visits, events, short courses and other temporary visits.',
    description:
      'Visitor visa applications need a clear purpose, credible funding and evidence that you will comply with the conditions of the visit. We help you prepare a coherent application and avoid common inconsistencies.',
    forWho: [
      'People visiting family or friends abroad',
      'Attendees of weddings, graduations or family events',
      'Short-course or workshop participants',
      'Medical or compassionate visits where applicable',
    ],
    documents: [
      'Valid passport',
      'Invitation letter where relevant',
      'Relationship evidence for family visits',
      'Travel itinerary and accommodation details',
      'Employment, business or study evidence',
      'Financial evidence',
      'Evidence of ties to your home country',
      'Previous travel history, if available',
    ],
    process: [
      'Clarify the purpose and duration of the visit',
      'Review the destination-specific requirements',
      'Prepare invitation, relationship and funding evidence',
      'Complete the application and book required appointments',
      'Submit biometrics or attend an interview where required',
      'Review the decision and travel conditions',
    ],
    notes: [
      'A visitor visa does not guarantee entry; the border officer makes the final decision.',
      'Overstaying or working without permission can affect future applications.',
      'Requirements vary significantly by destination and nationality.',
    ],
    timeline:
      'Apply within the window recommended by the destination. Processing times can be longer during peak periods.',
  },
  {
    slug: 'family-visit',
    name: 'Family Visit Visa Support',
    shortName: 'Family Visit Visa',
    summary: 'Preparation for visits to family or friends, including invitations, relationship evidence and funding.',
    description:
      'Family visit applications depend on a credible invitation, a genuine relationship and evidence that the visit will be temporary. We help you organise the invitation, relationship, funding and home-ties documents into a consistent application.',
    forWho: [
      'People visiting parents, children, siblings or extended family abroad',
      'Parents or relatives attending a graduation, wedding or family event',
      'Sponsors who need to prepare invitation and funding evidence',
      'Applicants who have previously been refused a family visit visa',
    ],
    documents: [
      'Valid passport and identity documents',
      'Invitation letter from the host',
      'Proof of the host’s immigration status where required',
      'Relationship evidence such as birth or marriage certificates',
      'Host’s accommodation and financial evidence',
      'Applicant’s employment, business or study evidence',
      'Applicant’s financial evidence and travel plan',
      'Evidence of ties to the home country',
    ],
    process: [
      'Clarify who is visiting whom, for how long and who is paying',
      'Confirm the destination-specific visitor route and requirements',
      'Prepare invitation, relationship and sponsorship evidence',
      'Complete the application and pay official fees',
      'Attend biometrics or an interview where required',
      'Review the decision and the conditions of entry before travel',
    ],
    notes: [
      'The host’s status does not guarantee the visitor’s approval.',
      'Relationship and funding documents should tell the same story.',
      'A visitor visa does not guarantee entry at the border.',
    ],
    timeline:
      'Apply within the destination’s recommended window and allow extra time for document requests or peak-season delays.',
  },
  {
    slug: 'medical-visa',
    name: 'Medical Visa Support',
    shortName: 'Medical Visa',
    summary: 'Guidance for treatment-related travel, including medical invitations, funding and companion documents.',
    description:
      'Medical travel applications need a clear treatment purpose, evidence from the treating institution and a credible plan for costs and return. We help you prepare the medical, financial and identity documents requested by the destination.',
    forWho: [
      'Patients travelling for planned treatment or specialist consultation',
      'Companions or family members supporting a patient',
      'Patients referred by a local doctor or hospital',
      'Applicants who need to understand medical visitor requirements',
    ],
    documents: [
      'Valid passport and identity documents',
      'Medical invitation or appointment letter from the treating institution',
      'Local doctor’s referral or medical summary where available',
      'Estimated treatment plan and cost letter',
      'Proof of funds or sponsor evidence',
      'Accommodation and travel plan',
      'Companion relationship and funding evidence where applicable',
      'Travel insurance or medical cover where required',
    ],
    process: [
      'Confirm the treatment purpose, institution and expected duration',
      'Check the destination’s medical visitor route and documentation',
      'Obtain the medical invitation, cost estimate and referral evidence',
      'Prepare funding, accommodation and companion documents',
      'Complete the application and attend required appointments',
      'Plan travel only after the visa decision and medical arrangements are confirmed',
    ],
    notes: [
      'We do not provide medical advice or assess treatment suitability.',
      'The treating institution and immigration authority make independent decisions.',
      'Urgent medical situations should be handled through the appropriate emergency channels.',
    ],
    timeline:
      'Start as soon as the treating institution confirms the appointment. Processing time depends on the destination and the completeness of the medical evidence.',
  },
  {
    slug: 'tourist-visa',
    name: 'Tourist Visa Support',
    shortName: 'Tourist Visa',
    summary: 'Document and application guidance for leisure travel and group holidays.',
    description:
      'We help travellers prepare tourist visa applications with a clear itinerary, suitable funding evidence and documents that match the purpose of the trip.',
    forWho: [
      'Leisure travellers',
      'Couples, families and groups',
      'Holidaymakers with a planned itinerary',
      'Travellers who have been refused before and want to understand the gaps',
    ],
    documents: [
      'Valid passport',
      'Travel itinerary and accommodation bookings',
      'Flight reservations or travel plan',
      'Employment or business evidence',
      'Financial evidence',
      'Travel insurance where required',
      'Previous visa or travel history',
      'Any invitation or host documents',
    ],
    process: [
      'Confirm the destination, dates and purpose of travel',
      'Check visa-exemption or application requirements',
      'Prepare itinerary, funding and employment documents',
      'Complete the application and pay official fees',
      'Provide biometrics or attend an interview if required',
      'Confirm visa conditions before booking restrictive travel',
    ],
    notes: [
      'We do not sell visas or influence decisions.',
      'Refundable or flexible bookings are often safer before a decision.',
      'Entry is never guaranteed by a visa alone.',
    ],
    timeline:
      'Apply within the destination’s recommended window. Peak travel seasons can extend processing times.',
  },
  {
    slug: 'business-visa',
    name: 'Business Visa Support',
    shortName: 'Business Visa',
    summary: 'Preparation for meetings, conferences, negotiations and short business visits.',
    description:
      'Business visitor routes usually require evidence of the business purpose, your role and who is funding the trip. We help you organise a consistent set of commercial and personal documents.',
    forWho: [
      'Business owners and employees travelling for meetings',
      'Conference and trade-fair attendees',
      'Professionals exploring partnerships or negotiations',
      'Short-term business visitors',
    ],
    documents: [
      'Valid passport',
      'Employer or company introduction letter',
      'Invitation letter from the host organisation',
      'Conference or event registration',
      'Business registration or employment evidence',
      'Financial and sponsorship evidence',
      'Travel and accommodation plan',
      'Evidence of ties to your home country',
    ],
    process: [
      'Clarify the business purpose and duration',
      'Confirm the correct visa category',
      'Prepare host, employer and funding documents',
      'Complete the application and required appointments',
      'Submit biometrics or attend an interview where required',
      'Review conditions and plan travel',
    ],
    notes: [
      'Business visitor routes generally do not permit local employment.',
      'The purpose of the visit must match the visa category.',
      'Company documents should be current and consistent.',
    ],
    timeline:
      'Start well before your meeting or event. Requirements and appointment availability vary by destination.',
  },
  {
    slug: 'work-visa',
    name: 'Work Visa Guidance',
    shortName: 'Work Visa',
    summary: 'Guidance on work-route requirements, employer documents and application preparation.',
    description:
      'Work visa routes are often employer-led and highly specific. We help you understand the route requirements, prepare supporting documents and coordinate with your employer or sponsor.',
    forWho: [
      'Professionals with a job offer or sponsorship',
      'Employees relocating with an employer',
      'Skilled workers exploring eligible routes',
      'Employers who need document guidance',
    ],
    documents: [
      'Valid passport',
      'Job offer or employment contract',
      'Employer sponsorship or authorisation evidence',
      'Qualification and professional registration documents',
      'Work experience evidence',
      'Language evidence where required',
      'Financial and accommodation evidence',
      'Medical or police certificates where required',
    ],
    process: [
      'Confirm the route and whether employer sponsorship is required',
      'Review your qualifications and experience against the route',
      'Coordinate employer and sponsor documents',
      'Complete the application and pay official fees',
      'Provide biometrics, medicals or additional evidence if requested',
      'Prepare for relocation and arrival requirements',
    ],
    notes: [
      'Eligibility rules are route-specific and can change.',
      'We do not provide immigration legal advice; complex cases may need a qualified immigration lawyer.',
      'The employer or authority makes the final decision.',
    ],
    timeline:
      'Timelines depend on the route, employer readiness and official processing. Start as soon as a role or sponsorship is confirmed.',
  },
]

export function getVisaService(slug: string): VisaService | undefined {
  return VISA_SERVICES.find((service) => service.slug === slug)
}

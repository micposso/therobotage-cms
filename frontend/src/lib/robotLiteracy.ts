export interface LiteracyField {
  name: string
  label: string
  required?: boolean
  type?: string
  autoComplete?: string
  options?: readonly string[]
}

export const interests = ['Robot Literacy Curriculum', 'Live Robot Lab', 'Workshop / Training', 'Corporate Program', 'Curriculum Partnership', 'Research Collaboration', 'Sponsorship', 'Other']
export const literacyFields: readonly LiteracyField[] = [
  { name: 'firstName', label: 'First Name', required: true, autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last Name', required: true, autoComplete: 'family-name' },
  { name: 'email', label: 'Work Email', required: true, type: 'email', autoComplete: 'email' },
  { name: 'organization', label: 'Organization', required: true, autoComplete: 'organization' },
  { name: 'role', label: 'Role / Title', autoComplete: 'organization-title' },
  { name: 'organizationType', label: 'Organization Type', required: true, options: ['K–12 School', 'College / University', 'Company', 'Robotics Company', 'Nonprofit', 'Government', 'Community Organization', 'Individual', 'Other'] },
  { name: 'audience', label: 'Audience', options: ['Elementary School', 'Middle School', 'High School', 'College / University', 'Educators', 'Professionals', 'Executives', 'General Workforce', 'Mixed Audience'] },
  { name: 'groupSize', label: 'Approximate Group Size', options: ['Under 10', '10–25', '26–50', '51–100', '100+', 'Not sure yet'] },
  { name: 'timeline', label: 'Timeline', options: ['As soon as possible', 'Within 1 month', '1–3 months', '3–6 months', 'Exploring'] },
  { name: 'message', label: 'Message', type: 'textarea' },
]
export type LiteracyErrors = Record<string, string>
export type LiteracyResult = { success: boolean; error?: string; errors?: LiteracyErrors }

export function validateLiteracyRequest(data: FormData): LiteracyErrors {
  const errors: LiteracyErrors = {}
  for (const field of literacyFields) {
    const raw = data.get(field.name)
    const value = typeof raw === 'string' ? raw.trim() : ''
    if (raw !== null && typeof raw !== 'string') errors[field.name] = 'Please enter text.'
    if (field.required && !value) errors[field.name] = `Please ${field.options ? 'select' : 'enter'} ${field.label.toLowerCase()}.`
    if (value.length > (field.type === 'textarea' ? 3000 : 200)) errors[field.name] = 'Please shorten this response.'
    if (field.options && value && !field.options.includes(value)) errors[field.name] = 'Please select one of the available options.'
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field.name] = 'Please enter a valid email address.'
  }
  const selected = data.getAll('interests')
  if (!selected.length) errors.interests = 'Please select at least one area of interest.'
  else if (selected.length > interests.length || selected.some((value) => typeof value !== 'string' || !interests.includes(value))) errors.interests = 'Please select from the available interests.'
  if (data.get('consent') !== 'yes') errors.consent = 'Please agree to be contacted before submitting.'
  return errors
}

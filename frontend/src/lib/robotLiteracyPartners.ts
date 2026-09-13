export interface PartnerField {
  name: string
  label: string
  required?: boolean
  type?: string
  autoComplete?: string
  options?: readonly string[]
  placeholder?: string
}

export const partnershipTypes = [
  'Supporter',
  'Research Partner',
  'Robot Partner',
  'Founding Partner',
  'Not sure yet',
] as const

export const contributionOptions = [
  'Robot or hardware access',
  'Research collaboration',
  'Subject-matter expertise',
  'Educational content',
  'Speakers or workshops',
  'Financial support',
  'Other',
] as const

export const partnerFields: readonly PartnerField[] = [
  { name: 'fullName', label: 'Full name', required: true, autoComplete: 'name' },
  { name: 'email', label: 'Work email', required: true, type: 'email', autoComplete: 'email' },
  { name: 'organization', label: 'Organization', required: true, autoComplete: 'organization' },
  { name: 'jobTitle', label: 'Job title', autoComplete: 'organization-title' },
  { name: 'website', label: 'Organization website', type: 'url', autoComplete: 'url' },
  { name: 'partnershipType', label: 'Partnership type', required: true, options: partnershipTypes },
  {
    name: 'exploration',
    label: 'What would you like to explore?',
    required: true,
    type: 'textarea',
    placeholder: 'Tell us about your robot, research area, educational initiative, or partnership idea.',
  },
]

export type PartnerErrors = Record<string, string>
export type PartnerResult = { success: boolean; error?: string; errors?: PartnerErrors }

function requiredMessage(field: PartnerField) {
  const label = field.label.toLowerCase()
  const punctuation = /[?.!]$/.test(label) ? '' : '.'
  return `Please ${field.options ? 'select' : 'enter'} ${label}${punctuation}`
}

export function validateRobotLiteracyPartnerRequest(data: FormData): PartnerErrors {
  const errors: PartnerErrors = {}

  for (const field of partnerFields) {
    const raw = data.get(field.name)
    const value = typeof raw === 'string' ? raw.trim() : ''
    if (raw !== null && typeof raw !== 'string') errors[field.name] = 'Please enter text.'
    if (field.required && !value) errors[field.name] = requiredMessage(field)
    if (value.length > (field.type === 'textarea' ? 3000 : 240)) errors[field.name] = 'Please shorten this response.'
    if (field.options && value && !field.options.includes(value)) errors[field.name] = 'Please select one of the available options.'
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field.name] = 'Please enter a valid email address.'
    if (field.type === 'url' && value) {
      try {
        const url = new URL(value)
        if (!['http:', 'https:'].includes(url.protocol)) errors[field.name] = 'Please enter a valid website URL.'
      } catch {
        errors[field.name] = 'Please enter a valid website URL.'
      }
    }
  }

  const contributions = data.getAll('contributions')
  if (contributions.length > contributionOptions.length || contributions.some((value) => typeof value !== 'string' || !(contributionOptions as readonly string[]).includes(value))) {
    errors.contributions = 'Please select from the available contribution options.'
  }
  if (data.get('consent') !== 'yes') errors.consent = 'Please agree to be contacted before submitting.'

  return errors
}

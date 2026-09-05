export const organizationTypes = [
  'K–12 School',
  'College or University',
  'Company',
  'Nonprofit',
  'Event',
  'Other',
] as const
export const groupSizes = ['1–15', '16–30', '31–50', '51–100', '100+'] as const

export const labFields = [
  { name: 'name', label: 'Name', required: true, autoComplete: 'name' },
  {
    name: 'email',
    label: 'Work Email',
    required: true,
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'organization',
    label: 'Organization',
    required: true,
    autoComplete: 'organization',
  },
  {
    name: 'organizationType',
    label: 'Organization Type',
    required: true,
    options: organizationTypes,
  },
  { name: 'role', label: 'Your Role', autoComplete: 'organization-title' },
  {
    name: 'groupSize',
    label: 'Approximate Group Size',
    required: true,
    options: groupSizes,
  },
  { name: 'age', label: 'Participant Age / Grade' },
  { name: 'date', label: 'Preferred Date', type: 'date' },
  { name: 'location', label: 'Location / ZIP Code', required: true },
  {
    name: 'experience',
    label: 'What would you like participants to experience?',
    type: 'textarea',
  },
] satisfies {
  name: string
  label: string
  required?: boolean
  type?: string
  autoComplete?: string
  options?: readonly string[]
}[]

export type LabField = (typeof labFields)[number]['name']
export type LabErrors = Partial<Record<LabField, string>>
export type LabResult = { success: boolean; error?: string; errors?: LabErrors }

export function validateLabRequest(data: FormData): LabErrors {
  const errors: LabErrors = {}
  for (const field of labFields) {
    const raw = data.get(field.name)
    const value = typeof raw === 'string' ? raw.trim() : ''
    if ('required' in field && field.required && !value)
      errors[field.name] = `Please enter ${field.label.toLowerCase()}.`
    if (value.length > (field.name === 'experience' ? 3000 : 200))
      errors[field.name] = 'Please shorten this response.'
    if (
      'options' in field &&
      value &&
      !(field.options as readonly string[]).includes(value)
    )
      errors[field.name] = 'Please select one of the available options.'
    if (
      field.name === 'email' &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
      errors.email = 'Please enter a valid email address.'
    if (
      field.name === 'date' &&
      value &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(Date.parse(value)) ||
        new Date(value).toISOString().slice(0, 10) !== value)
    )
      errors.date = 'Please enter a valid date.'
  }
  return errors
}

export const companyTypes = ['Robot manufacturer', 'Systems integrator', 'Robotics-as-a-Service provider', 'Distributor / deployment partner', 'Commercial robot operator', 'Other'] as const
export const deploymentStages = ['Planning an initial deployment', 'First customer deployments', 'Multiple active customer sites', 'Scaling across markets'] as const
export const enterpriseFields = [
  { name: 'name', label: 'Full name', required: true, type: 'text', autoComplete: 'name', maxLength: 254 },
  { name: 'email', label: 'Work email', required: true, type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'organization', label: 'Organization', required: true, type: 'text', autoComplete: 'organization', maxLength: 254 },
  { name: 'companyType', label: 'Company type', required: true, type: 'select', options: companyTypes, maxLength: 254 },
  { name: 'robot', label: 'Robot or application', required: false, type: 'text', maxLength: 254 },
  { name: 'stage', label: 'Deployment stage', required: false, type: 'select', options: deploymentStages, maxLength: 254 },
  { name: 'languages', label: 'Languages or workforce needs', required: false, type: 'textarea', maxLength: 3000 },
  { name: 'context', label: 'Additional context', required: false, type: 'textarea', maxLength: 3000 },
] as const
export type EnterpriseField = typeof enterpriseFields[number]['name']
export type EnterpriseErrors = Partial<Record<EnterpriseField, string>>
export type EnterpriseResult = { success: boolean; error?: string; errors?: EnterpriseErrors }
export const enterpriseFailure = 'Your request could not be sent. Please try again or email hello@therobotage.com.'
export function enterpriseValues(data: FormData): Record<EnterpriseField, string> {
  return Object.fromEntries(enterpriseFields.map(({ name }) => {
    const value = data.get(name)
    return [name, typeof value === 'string' ? value.trim() : '']
  })) as Record<EnterpriseField, string>
}
export function validateEnterpriseRequest(data: FormData): EnterpriseErrors {
  const values = enterpriseValues(data)
  const errors: EnterpriseErrors = {}
  for (const field of enterpriseFields) {
    const value = values[field.name]
    if (field.required && !value) errors[field.name] = 'This field is required.'
    else if (value.length > field.maxLength || (data.has(field.name) && typeof data.get(field.name) !== 'string')) errors[field.name] = 'Please shorten this response.'
    else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field.name] = 'Please enter a valid work email address.'
    else if (field.type === 'select' && value && !(field.options as readonly string[]).includes(value)) errors[field.name] = 'Please select one of the listed options.'
  }
  return errors
}

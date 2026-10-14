export const academyInterests = {
  academy: { en: 'The Robot Age Academy updates', es: 'Novedades de The Robot Age Academy' },
  rpdp: { en: 'Product Design for Robots (RPDP) founding cohort list', es: 'Lista de interés de la primera cohorte de Product Design for Robots (RPDP)' },
  rdp: { en: 'Robot Deployment Practitioner (RDP) launch updates', es: 'Novedades del lanzamiento de Robot Deployment Practitioner (RDP)' },
} as const

export type AcademyInterest = keyof typeof academyInterests

export function parseAcademyInterest(value: FormDataEntryValue | null): AcademyInterest | undefined {
  if (value === null) return 'academy'
  return typeof value === 'string' && Object.hasOwn(academyInterests, value)
    ? value as AcademyInterest : undefined
}

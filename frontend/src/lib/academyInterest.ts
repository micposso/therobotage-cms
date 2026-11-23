export const academyInterests = {
  academy: { en: 'The Robot Age Academy updates', es: 'Novedades de The Robot Age Academy' },
  rpdp: { en: 'Robotics Product Design Practitioner (RPDP) founding cohort list', es: 'Lista de interés de la primera cohorte de RPDP (Diseño de productos robóticos)' },
  rdp: { en: 'Robot Deployment Practitioner (RDP) launch updates', es: 'Novedades del lanzamiento de Robot Deployment Practitioner (RDP)' },
} as const

export type AcademyInterest = keyof typeof academyInterests
export type WaitlistState = { success: boolean; error?: string; promotionalEligibility?: boolean }

export function parseAcademyInterest(value: FormDataEntryValue | null): AcademyInterest | undefined {
  if (value === null) return 'academy'
  return typeof value === 'string' && Object.hasOwn(academyInterests, value)
    ? value as AcademyInterest : undefined
}

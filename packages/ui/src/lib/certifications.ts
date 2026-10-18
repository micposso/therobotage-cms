export interface CertModule {
  number: string
  title: string
  description: string
  status: 'Live' | 'Coming Soon'
}

export interface Certification {
  abbr: string
  slug: string
  name: string
  status: 'Live' | 'Coming Soon'
  description: string
  audience: string
  overview: string
  format: string
  duration: string
  modules: CertModule[]
  outcomes: string[]
}

export const academyPrograms = [
  {
    abbr: 'RPDP', slug: 'rpdp', name: 'Robotics Product Design Practitioner',
    title: 'Product Design for Robots', status: 'Coming Soon' as const,
    description: 'Learn how to design interactions between robots, people, and their environments. Apply UX, product design, accessibility, human-robot interaction, and the Robot Experience Design framework to real robotics challenges.',
    audience: 'Product designers, UX/UI professionals, design students, UX researchers, and product managers.',
    overview: 'A five-week professional learning experience for designers who want to apply their skills to robotics. Learn to design human-robot interactions, communicate robot intent, create physical and digital interfaces, and design for unexpected behavior and failure.',
    topics: 'Robot behavior, interaction design, interface design, proxemics, accessibility, safety signaling, failure recovery, prototyping, and user testing.',
    format: 'Live and self-paced', duration: '5 weeks · 25 hours · February 2027',
    capstone: 'Robot Experience Design portfolio project',
    modules: [
      'Human-robot interaction fundamentals', 'Robot behavior and communication',
      'Physical and digital interfaces', 'Proxemics and environmental design',
      'Accessibility and inclusive design', 'Failure states and recovery design',
      'Prototyping robot experiences', 'Testing and evaluation',
    ].map((title, i) => ({ number: String(i + 1).padStart(2, '0'), title, description: '', status: 'Coming Soon' as const })),
    outcomes: ['Robot Experience Design portfolio project'],
  },
  {
    abbr: 'RDP', slug: 'rdp', name: 'Robot Deployment Practitioner',
    title: 'Robot Deployment Practitioner', status: 'Coming Soon' as const,
    description: 'Learn how to prepare organizations for successful commercial robotics deployment. Evaluate operational readiness, workforce training, safety requirements, regulation, insurance, cultural fit, change management, adoption, and measurable business outcomes.',
    audience: 'Robotics companies, deployment teams, system integrators, operations managers, consultants, and organizational leaders.',
    overview: 'Prepare organizations for successful commercial robotics deployment through deployment planning, workforce readiness, operational governance, and measurable business outcomes.',
    topics: 'Deployment planning, readiness assessments, risk and safety, regulatory requirements, insurance and liability, employee onboarding, cultural adaptation, operational governance, and ROI.',
    format: 'Applied projects and assessments', duration: '4 weeks · 24 hours · Commercial launch January 2027',
    capstone: 'Robot Deployment Readiness Plan',
    modules: [
      'Commercial robotics ecosystem', 'Site and organizational readiness',
      'Safety, regulations, and insurance', 'Workforce and cultural adaptation',
      'Change management and onboarding', 'Fleet operations and governance',
      'Adoption and performance measurement', 'ROI and value realization',
    ].map((title, i) => ({ number: String(i + 1).padStart(2, '0'), title, description: '', status: 'Coming Soon' as const })),
    outcomes: ['Robot Deployment Readiness Plan'],
  },
]

// Active professional credentials. All public consumers use this catalog.
export const certifications: Certification[] = academyPrograms

export const programLinks = [
  { label: 'Robot Literacy', href: '/robot-literacy', summary: 'Understand robots through READ, RELATE, and COEXIST.', cta: 'Explore Robot Literacy' },
  { label: 'Live Robot Lab', href: '/live-robot-lab', summary: 'Experience real robots through guided, hands-on sessions for schools and organizations.', cta: 'Explore Live Robot Lab' },
  { label: 'Product Design for Robots (RPDP)', href: '/learn/rpdp', summary: academyPrograms[0].description, cta: 'Explore RPDP Curriculum' },
  { label: 'Robot Deployment Practitioner (RDP)', href: '/learn/rdp', summary: academyPrograms[1].description, cta: 'Explore RDP Curriculum' },
]

// Retired marketing routes are retained as notices, never as active offers.
export const legacyCredentialSlugs = ['rep', 'rsp', 'rxr', 'hsp']
export function isLegacyCredential(slug: string): boolean {
  return legacyCredentialSlugs.includes(slug)
}
export function getCertificationBySlug(slug: string): Certification | undefined {
  return certifications.find((program) => program.slug === slug)
}
export function getAllCertificationSlugs(): string[] {
  return certifications.map((program) => program.slug)
}

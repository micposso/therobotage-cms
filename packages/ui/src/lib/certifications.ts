export const rpdpModules = [
  {
    title: 'Robotics Products and Human-Robot Interaction',
    description: 'Identify a robotics product opportunity grounded in user needs and the capabilities of the robot.',
    topics: 'Robot categories, embodied AI, human-robot interaction, user needs, capabilities and limitations, stakeholder mapping, and product discovery.',
    tools: 'FigJam, TheRobotAge RXD Framework, and browser simulation where available.',
    deliverable: 'Product opportunity brief, stakeholder map, and chosen capstone scenario.',
  },
  {
    title: 'Robot Behavior, Personality, and Communication',
    description: 'Specify how a robot communicates its intent, state, and limitations.',
    topics: 'Voice, tone, gestures, gaze, movement, multimodal communication, anthropomorphism, trust, and behavioral consistency.',
    tools: 'Figma, FigJam, storyboards, and optional ElevenLabs voice prototyping.',
    deliverable: 'Robot behavior specification and communication storyboard.',
  },
  {
    title: 'Physical, Digital, and Spatial Interaction Design',
    description: 'Map how a human-robot interaction unfolds across interfaces and shared spaces.',
    topics: 'Multimodal interfaces, physical and digital touchpoints, robot movement, proxemics, and environmental context.',
    tools: 'Figma, FigJam, spatial journey mapping, and browser simulation.',
    deliverable: 'Human-robot interaction flow and spatial journey map.',
  },
  {
    title: 'Generational, Multicultural, and Inclusive Robotics Design',
    description: 'Design accessible interactions and offer alternatives for people with different needs.',
    topics: 'Ability, age, language, culture, technology familiarity, multilingual interfaces, and cognitive, sensory, and physical accessibility.',
    tools: 'Figma, accessibility checklists, and multilingual prototypes.',
    deliverable: 'Inclusive design specification with alternative pathways for two user groups.',
  },
  {
    title: 'Robotics Regulation, Ethics, Privacy, and Safety',
    description: 'Translate relevant obligations and deployment constraints into product requirements.',
    topics: 'Safety standards, accessibility requirements, privacy, sensor data, AI transparency, consent, human oversight, and regulatory applicability.',
    tools: 'TheRobotAge Robot Policy Watch, NIST AI RMF, and regulatory assessment templates.',
    deliverable: 'Risk and regulatory applicability assessment.',
  },
  {
    title: 'Failure States, Uncertainty, and Recovery Design',
    description: 'Design what a robot communicates and does when an interaction goes off course.',
    topics: 'Errors, uncertainty, interruption, connectivity loss, human escalation, and service recovery.',
    tools: 'Figma, FigJam, storyboards, and failure-state templates.',
    deliverable: 'Failure and recovery flow covering at least two scenarios.',
  },
  {
    title: 'Robotics Prototyping, Simulation, and Evaluation',
    description: 'Prototype and evaluate interactions in simulation or a controlled setting.',
    topics: 'Browser simulation, Wizard-of-Oz prototypes, behavioral testing, usability research, task success, comprehension, trust, and RXD evaluation.',
    tools: 'Browser-based robotics simulation, Figma, usability testing templates, and the RXD Scorecard.',
    deliverable: 'Interaction prototype, formative testing findings, and RXD evaluation.',
  },
  {
    title: 'Robotics Product Strategy and Portfolio Presentation',
    description: 'Turn research and interaction decisions into a product plan and present the evidence in a case study.',
    topics: 'Product requirements, MVP priorities, value propositions, adoption, success metrics, and portfolio presentations.',
    tools: 'Figma Slides or equivalent, product requirements templates, and the RXD Scorecard.',
    deliverable: 'Final Robotics Product Experience Case Study and live presentation.',
  },
].map((module, i) => ({ ...module, number: String(i + 1).padStart(2, '0'), status: 'Coming Soon' as const }))

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
    description: 'Explore RPDP, an eight-week, 36-hour live online program in human-robot interaction, inclusive design, simulation, and product strategy. Join the February 2027 cohort interest list.',
    audience: 'Product designers, UX/UI professionals, design students, UX researchers, and product managers.',
    overview: 'An eight-week professional program for people bringing design, research, or product experience into robotics. Design how robots communicate, interact in shared spaces, and recover when something goes wrong.',
    topics: 'Human-robot interaction, robot behavior, inclusive design, regulation and safety, failure recovery, simulation, RXD evaluation, and product strategy.',
    format: 'Live online', duration: '8 weeks · 36 hours · February 2027',
    capstone: 'Robotics Product Experience Case Study',
    modules: rpdpModules,
    outcomes: ['Robotics Product Experience Case Study'],
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

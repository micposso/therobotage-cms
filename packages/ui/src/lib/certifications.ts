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

export const certifications: Certification[] = [
  {
    abbr: 'REP',
    slug: 'rep',
    name: 'Robotics Experience Practitioner',
    status: 'Live',
    description: 'The foundational credential built on the Robot Experience Design (RXD) framework. Human-robot interaction, designing around failure, and evaluating real deployments.',
    audience: 'Product designers, UX strategists, operations leads, and business leaders who work in or around environments where robots are deployed.',
    overview: 'The REP is the foundational credential in the Robot Age certification family. It is built entirely on the Robot Experience Design (RXD) framework — six dimensions for evaluating how humans experience robots in real environments. The programme covers the human side of robotics: not how robots are built, but how they behave, where they break down, and what the people around them need to know to work confidently alongside them. No engineering background required.',
    format: 'Six-week hybrid programme. One live Zoom kick-off, four self-paced modules with deliverables, and a capstone Robot Readiness Audit.',
    duration: '6 weeks · ~15 hours total · 1 live Zoom + async',
    modules: [
      {
        number: '01',
        title: 'What Is Human Robotics Experience?',
        description: 'Live Zoom kick-off. The RXD framework introduced and applied live to Reachy Mini across all six dimensions. No code. No prerequisites.',
        status: 'Live',
      },
      {
        number: '02',
        title: 'Signal Clarity & Spatial Legibility',
        description: 'How robots communicate intent and how humans read their position in space — signals, proxemics, and spatial legibility.',
        status: 'Live',
      },
      {
        number: '03',
        title: 'Perceived Presence',
        description: 'Voice, form, aesthetic, emotional readability — how design choices shape the social register of a robot and why coherence matters.',
        status: 'Live',
      },
      {
        number: '04',
        title: 'Interaction Fit & Failure Transparency',
        description: 'Matching capability to context, and designing failure as an intentional interaction moment rather than an exception.',
        status: 'Live',
      },
      {
        number: '05',
        title: 'Recovery Design & Applied Use Cases',
        description: 'Synthesis across real deployment verticals. Write a spec, TRA runs it on Reachy Mini, you review the footage.',
        status: 'Live',
      },
      {
        number: '06',
        title: 'Capstone: Robot Readiness Audit',
        description: 'Complete a full Robot Readiness Audit scored across all six RXD dimensions. Pass and earn the REP credential and badge.',
        status: 'Live',
      },
    ],
    outcomes: [
      'Describe the basic architecture and behaviour of a robotic system in plain language',
      'Identify the key moments where human-robot interaction is most likely to break down',
      'Apply the Human Readiness Framework to evaluate an existing or proposed deployment',
      'Design communication and escalation protocols for mixed human-robot environments',
      'Earn the REP credential and badge',
    ],
  },
  ...academyPrograms.filter((program) => program.slug === 'rpdp'),
  {
    abbr: 'RSP',
    slug: 'rsp',
    name: 'Robotics Strategy Practitioner',
    status: 'Coming Soon',
    description: 'For operations leads, consultants, and executives making deployment decisions. Vendor evaluation, readiness assessment, change management, and ROI framing.',
    audience: 'Operations directors, management consultants, C-suite executives, and senior leaders responsible for making or influencing decisions about robotic adoption.',
    overview: 'The RSP credential is for the people who decide whether, where, and how robots get deployed — not the people who build them. It covers the strategic and organisational dimensions of robotic adoption: how to evaluate vendors, how to assess organisational readiness, how to manage the change, and how to frame the business case honestly.',
    format: 'Four-week hybrid programme. Three self-paced modules followed by a deployment strategy presentation.',
    duration: '4 weeks · 10 hours total · 1 live strategy session',
    modules: [
      {
        number: '3.1',
        title: 'Vendor Evaluation & Technology Assessment',
        description: 'How to evaluate robotic systems without engineering expertise. What questions to ask, what to test, and what the answers actually mean.',
        status: 'Coming Soon',
      },
      {
        number: '3.2',
        title: 'Organisational Readiness & Change Management',
        description: 'How to assess whether an organisation is ready to deploy — and what to do when it isn\'t. Staff readiness, process alignment, and communication strategy.',
        status: 'Coming Soon',
      },
      {
        number: '3.3',
        title: 'ROI, Risk & the Business Case',
        description: 'How to frame the business case for robotic deployment honestly — including the costs, risks, and failure modes that most vendor proposals don\'t mention.',
        status: 'Coming Soon',
      },
      {
        number: '3.4',
        title: 'Deployment Strategy Presentation',
        description: 'Capstone: develop and present a deployment strategy for a real or hypothetical scenario. Earn your RSP credential.',
        status: 'Coming Soon',
      },
    ],
    outcomes: [
      'Evaluate robotic systems and vendor proposals without engineering expertise',
      'Assess organisational readiness for robot deployment using the Human Readiness Framework',
      'Design a change management approach for a mixed human-robot environment',
      'Build and present an honest business case for robotic adoption',
      'Identify and mitigate the most common causes of deployment failure',
    ],
  },
  {
    abbr: 'RXR',
    slug: 'rxr',
    name: 'Robotic Experience Researcher',
    status: 'Coming Soon',
    description: 'For UX researchers and service designers studying how people behave around robots. Observation methods, study design in physical environments, and synthesizing findings for mixed teams.',
    audience: 'UX researchers, service designers, design researchers, and social scientists studying human behaviour in environments that include robotic systems.',
    overview: 'The RXR credential is for researchers who need to study humans in robotic environments — and communicate what they find to teams that include engineers, designers, and business leaders. It covers the specific methodological challenges of doing research in physical, mixed human-robot spaces.',
    format: 'Five-week hybrid programme. Four self-paced modules followed by a research presentation.',
    duration: '5 weeks · 14 hours total · 2 live research sessions',
    modules: [
      {
        number: '4.1',
        title: 'Research Methods in Physical Robotic Environments',
        description: 'How standard UX research methods adapt — and where they break — in environments with moving, autonomous machines. Observation protocols, safety considerations, and study design.',
        status: 'Coming Soon',
      },
      {
        number: '4.2',
        title: 'Behavioural Patterns in Human-Robot Proximity',
        description: 'What the research literature tells us about how humans behave near robots — and how to design studies that surface new findings rather than confirming assumptions.',
        status: 'Coming Soon',
      },
      {
        number: '4.3',
        title: 'Synthesising & Communicating Findings',
        description: 'How to translate research findings for mixed audiences — engineers who want data, designers who want insight, and executives who want implications.',
        status: 'Coming Soon',
      },
      {
        number: '4.4',
        title: 'Research Presentation & Peer Review',
        description: 'Capstone: present original research findings from a physical or simulated robotic environment. Earn your RXR credential.',
        status: 'Coming Soon',
      },
    ],
    outcomes: [
      'Design and conduct observational research in physical robotic environments',
      'Apply and adapt established UX research methods to human-robot interaction contexts',
      'Synthesise findings into actionable recommendations for mixed engineering and design teams',
      'Communicate research insights effectively to non-researcher audiences',
      'Build a research portfolio demonstrating robotic experience research capability',
    ],
  },
]

export function getCertificationBySlug(slug: string): Certification | undefined {
  return certifications.find((c) => c.slug === slug) ?? academyPrograms.find((c) => c.slug === slug)
}

export function getAllCertificationSlugs(): string[] {
  return [...new Set([...certifications, ...academyPrograms].map((c) => c.slug))]
}

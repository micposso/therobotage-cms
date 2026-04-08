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

export const certifications: Certification[] = [
  {
    abbr: 'REP',
    slug: 'rep',
    name: 'Robotics Experience Practitioner',
    status: 'Live',
    description: 'Human-robot interaction, designing around failure, and evaluating real deployments. The foundational credential for anyone shaping the human side of robotics.',
    audience: 'Product designers, UX strategists, operations leads, and business leaders who work in or around environments where robots are deployed.',
    overview: 'The REP is the foundational credential in the Robot Age certification family. It covers the human side of robotics — not how robots are built, but how they behave, where they break down, and what the people around them need to know to work confidently alongside them. No engineering background required.',
    format: 'Four-week hybrid programme. Three self-paced modules followed by a live Robot Readiness Audit with cohort feedback.',
    duration: '4 weeks · 12 hours total · 2 live group sessions',
    modules: [
      {
        number: '1.1',
        title: 'Foundations of Robotics Experience',
        description: 'What robots are, how they perceive and act, and why it matters for the people designing the systems around them. No code. No engineering prerequisites.',
        status: 'Live',
      },
      {
        number: '1.2',
        title: 'Human-Robot Interaction',
        description: 'Proximity, gaze, gesture — how humans and robots read each other in physical space, and what goes wrong when the signals fail.',
        status: 'Coming Soon',
      },
      {
        number: '1.3',
        title: 'Experience Pressure Points',
        description: 'Where robot interfaces break and how to design around failure. Edge cases, error states, and the moments that matter most.',
        status: 'Coming Soon',
      },
      {
        number: '1.4',
        title: 'Robot Readiness Audit',
        description: 'Capstone: evaluate a real deployment using the Human Readiness Framework and earn your REP credential.',
        status: 'Coming Soon',
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
  {
    abbr: 'RPDP',
    slug: 'rpdp',
    name: 'Robotics Product Design Practitioner',
    status: 'Coming Soon',
    description: 'For product designers and design leads building interfaces, flows, and physical touchpoints between humans and robotic systems. Safety signaling, proxemics, error states, edge-case design.',
    audience: 'Product designers, interaction designers, design leads, and UX practitioners working on products or environments that include robotic systems.',
    overview: 'The RPDP credential is for designers who need to go deeper than robotic literacy into the practical craft of designing for robots. It covers the specific design challenges that emerge when your user is sharing a space with a machine that moves, perceives, and acts — and what it means to design that experience well.',
    format: 'Five-week hybrid programme. Four self-paced modules followed by a design critique and portfolio review.',
    duration: '5 weeks · 15 hours total · 2 live critique sessions',
    modules: [
      {
        number: '2.1',
        title: 'Design Constraints in Robotic Environments',
        description: 'How robots perceive space, light, and people — and what that means for the designer trying to communicate intent across the human-machine boundary.',
        status: 'Coming Soon',
      },
      {
        number: '2.2',
        title: 'Safety Signaling & Spatial Communication',
        description: 'Designing for proxemics, legibility, and trust. How do you tell a person what a robot is about to do before it does it?',
        status: 'Coming Soon',
      },
      {
        number: '2.3',
        title: 'Error States & Edge Cases',
        description: 'The robot stopped. No one knows why. This module covers failure mode design — what the system communicates, to whom, and how.',
        status: 'Coming Soon',
      },
      {
        number: '2.4',
        title: 'Robotic Interface Portfolio Review',
        description: 'Capstone: critique and present a design for a human-robot touchpoint. Earn your RPDP credential.',
        status: 'Coming Soon',
      },
    ],
    outcomes: [
      'Apply spatial design principles specific to robotic environments',
      'Design safety signals and legibility cues that work across diverse user populations',
      'Develop error state flows for robotic systems that fail gracefully',
      'Critique robotic interface designs using a structured evaluation framework',
      'Build a portfolio piece demonstrating robotic experience design capability',
    ],
  },
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
  return certifications.find((c) => c.slug === slug)
}

export function getAllCertificationSlugs(): string[] {
  return certifications.map((c) => c.slug)
}

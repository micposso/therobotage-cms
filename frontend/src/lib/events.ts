export const WORKSHOP_PROFESSIONS = [
  'Student',
  'Product Manager',
  'UX Designer',
  'Operations Lead',
  'Strategist',
  'Researcher',
  'HR Professional',
  'Facilities Manager',
  'Other',
] as const

export const WORKSHOP_HEARD_OPTIONS = [
  'Social media',
  'Word of mouth',
  'The Robot Age newsletter',
  'Search (Google, etc.)',
  'A colleague or friend',
  'LinkedIn',
  'Other',
] as const

export type SiteEvent = {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  status: 'registration-open' | 'announced'
  dates: Array<{
    label: string
    date: string
    time?: string
  }>
  location: {
    format: 'online' | 'in-person'
    name: string
  }
  url: string
  format: string
  cost?: string
  audience: string[]
  prerequisites?: string
  learningOutcomes?: string[]
  tracks?: Array<{
    number: string
    title: string
    description: string
  }>
  registration: {
    availability: 'open' | 'interest-only'
    adapter: 'workshop-email' | null
    note: string
  }
}

export const workshopEvent: SiteEvent = {
  id: 'rxd-free-workshop',
  slug: 'rxd-free-workshop',
  title: 'Product & UX Design for a World With Robots',
  summary:
    'A free, three-session workshop covering robotics basics, the RXD framework, and a scored Reachy Mini case study.',
  description:
    'You don’t need a $50k humanoid to start designing robot experiences. You need the right lens. Three live Zoom sessions. Robotics basics, the RXD framework in practice, and a scored case study on Reachy Mini — the expressive desktop robot that went viral after CES. Everything you need to design and evaluate human-robot experiences with confidence.',
  status: 'registration-open',
  dates: [
    { label: 'Session 01', date: 'Tuesday, June 16', time: '7:00–7:45 pm' },
    { label: 'Session 02', date: 'Tuesday, June 23', time: '7:00–7:45 pm' },
    { label: 'Session 03', date: 'Tuesday, June 30', time: '7:00–7:45 pm' },
  ],
  location: { format: 'online', name: 'Live Zoom' },
  url: '/rxd-free-workshop',
  format: 'Three live sessions · 45 minutes each · online',
  cost: 'Free',
  audience: ['Designers', 'Product Managers', 'UX Designers', 'Strategists', 'Project Managers'],
  prerequisites: 'No technical background required',
  learningOutcomes: [
    'The six dimensions of robot experience design and why each one matters',
    'How to apply RXD scoring to any robot you are evaluating or designing for',
    'Vocabulary to communicate robot behavior clearly to non-technical stakeholders',
    'A live scoring exercise on a real robot, ending in a Robot Readiness Audit',
  ],
  registration: {
    availability: 'open',
    adapter: 'workshop-email',
    note: 'Registration uses the existing validated workshop email flow and its capacity checks.',
  },
}

export const summitEvent: SiteEvent = {
  id: 'robot-age-summit-2026',
  slug: 'summit',
  title: 'The Robot Age Summit',
  summary:
    'A one-day gathering for product designers, UX strategists, and business leaders navigating the age of embodied AI. Four tracks. Real robots. No hype.',
  description:
    'A gathering for designers, strategists, and leaders who are shaping what human-robot experience actually looks like. Coming to New York City this fall.',
  status: 'announced',
  dates: [{ label: 'Event date', date: 'Fall 2026' }],
  location: { format: 'in-person', name: 'New York City' },
  url: '/summit',
  format: 'One-day gathering',
  audience: ['Product designers', 'UX strategists', 'Business leaders'],
  tracks: [
    { number: '01', title: 'Product Design & HRI', description: 'Designing interfaces for embodied systems' },
    { number: '02', title: 'Ethics & Responsibility', description: 'Accountability frameworks for real-world deployment' },
    { number: '03', title: 'Access & Equity', description: 'Who benefits from the robot age — and who does not' },
    { number: '04', title: 'Business & Strategy', description: 'Operationalizing robotics across industries' },
  ],
  registration: {
    availability: 'interest-only',
    adapter: null,
    note: 'The website currently advertises notification and speaker-interest actions but has no connected submission flow.',
  },
}

export const siteEvents: SiteEvent[] = [workshopEvent, summitEvent]

export function getEventByIdOrSlug(idOrSlug: string): SiteEvent | undefined {
  return siteEvents.find((event) => event.id === idOrSlug || event.slug === idOrSlug)
}

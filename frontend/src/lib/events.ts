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
  status: 'registration-open' | 'announced' | 'closed'
  dates: Array<{
    label: string
    date: string
    isoDate?: string
    time?: string
    timeZone?: string
  }>
  location: {
    format: 'online' | 'in-person'
    name: string
  }
  url: string
  format: string
  cost?: string
  audience: string[]
  access?: string
  series?: { name: string; dates: string; url: string; organizers: Array<{ name: string; role: string }> }
  sourceUrl?: string
  topics?: string[]
  people?: Array<{ name: string; role: string; moderator?: boolean }>
  featuredRobots?: string[]
  deliverables?: string[]
  prerequisites?: string
  learningOutcomes?: string[]
  tracks?: Array<{
    number: string
    title: string
    description: string
  }>
  registration: {
    availability: 'open' | 'interest-only' | 'closed'
    adapter: 'workshop-email' | null
    note: string
    url?: string
    label?: string
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
  status: 'closed',
  dates: [
    { label: 'Session 01', date: 'June 16, 2026', time: '7:00–7:45 pm ET' },
    { label: 'Session 02', date: 'June 23, 2026', time: '7:00–7:45 pm ET' },
    { label: 'Session 03', date: 'June 30, 2026', time: '7:00–7:45 pm ET' },
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
    availability: 'closed',
    adapter: null,
    note: 'Registration for the June 2026 workshop is closed. Explore current Academy programs.',
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

export const robotWeek = {
  name: 'Robot Week NYC',
  dates: 'November 17–22, 2026',
  url: 'https://robotweeknyc.org/',
  summary: 'Six days. Four encounters. Conversations, live interaction, a curated showcase and a two-day build challenge.',
  description: 'Robot Week NYC brings students, researchers, builders and robots together to explore how humans and robots will work, learn and live together.',
  interestUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScZom1gUqbOLWv3-241idP5Q7whD62JM8ok_RHMNbu_5Sh0Yg/viewform?usp=dialog',
  interestNote: 'Expressing interest does not reserve a place or confirm registration.',
  organizers: [
    { name: 'Michael Posso', role: 'Founder of TheRobotAge' },
    { name: 'Konstantine Arachovitis', role: 'Mechanical Engineering student at the New York Institute of Technology' },
  ],
}

const robotWeekSeries = {
  name: robotWeek.name,
  dates: robotWeek.dates,
  url: robotWeek.url,
  organizers: robotWeek.organizers,
}

const interestRegistration: SiteEvent['registration'] = {
  availability: 'interest-only',
  adapter: null,
  url: robotWeek.interestUrl,
  label: 'Express interest',
  note: robotWeek.interestNote,
}

export const robotWeekEvents: SiteEvent[] = [
  {
    id: 'robot-week-nyc-2026-career-panel',
    slug: 'robot-career-panel',
    title: 'Robot Career Panel',
    summary: 'Meet professionals working across robotics and explore career paths and opportunities in the industry.',
    description: 'An online panel with professionals working across robotics, giving students exposure to different career paths and opportunities in the industry.',
    status: 'registration-open',
    dates: [{ label: 'Tuesday', date: 'November 17, 2026', isoDate: '2026-11-17' }],
    location: { format: 'online', name: 'Online · Zoom' },
    url: '/calendar#robot-career-panel',
    sourceUrl: 'https://robotweeknyc.org/#career-panel',
    series: robotWeekSeries,
    format: 'Virtual panel',
    cost: 'Free',
    audience: ['Students', 'Professionals', 'General public'],
    access: 'Open to the public',
    topics: ['Engineering', 'Product', 'Design', 'Research', 'Artificial Intelligence', 'Human–Robot Interaction'],
    people: [
      { name: 'Shamoon Siddiqui', role: 'Co-founder & CEO, Human Friendly Robotics' },
      { name: 'Cesar Ordoñez', role: 'Product Manager at Fanatics' },
      { name: 'Jesica Chavez', role: 'CEO and Founder, Robo Success' },
      { name: 'Rafa Felix', role: 'Founder, runibiLABS' },
      { name: 'Ruimeng Wang', role: 'AI & Robotics, Shenzhen, China' },
      { name: 'Michael Posso', role: 'Founder, TheRobotAge', moderator: true },
    ],
    registration: {
      availability: 'open',
      adapter: null,
      url: 'https://zoom.us/meeting/register/yqUemMwXSIyU4JZ47BdlKQ',
      label: 'Register free on Zoom',
      note: 'Complete the free registration on Zoom. Registration cannot be completed through this site or its MCP tools. The panel time is not listed in the published program.',
    },
  },
  {
    id: 'robot-week-nyc-2026-live-lab',
    slug: 'robot-week-live-lab',
    title: 'Live Robot Lab',
    summary: 'The flagship hands-on Robot Week event, featuring Reachy Mini and Unitree GO2.',
    description: 'Students interact with robots and explore the decisions that make machines understandable, useful and engaging in human environments.',
    status: 'announced',
    dates: [{ label: 'Thursday', date: 'November 19, 2026', isoDate: '2026-11-19', time: '6–9 PM ET', timeZone: 'America/New_York' }],
    location: { format: 'in-person', name: 'New York City' },
    url: '/calendar#robot-week-live-lab',
    sourceUrl: 'https://robotweeknyc.org/#live-robot-lab',
    series: robotWeekSeries,
    format: 'In person',
    audience: ['NYIT students'],
    access: 'Open only to NYIT students',
    featuredRobots: ['Reachy Mini', 'Unitree GO2'],
    topics: ['Human–Robot Interaction', 'Embodied AI', 'Robot Behavior', 'Computer Vision', 'Interaction Design'],
    registration: { ...interestRegistration, note: `Open only to NYIT students. ${robotWeek.interestNote} The venue address has not been announced.` },
  },
  {
    id: 'robot-week-nyc-2026-showcase',
    slug: 'robotics-showcase',
    title: 'Robotics Showcase + Hackathon Kickoff',
    summary: 'See what is being built. Meet who is building it.',
    description: 'A small, curated robotics exhibition connecting the people building new machines, interactions and research.',
    status: 'announced',
    dates: [{ label: 'Friday', date: 'November 20, 2026', isoDate: '2026-11-20', time: '6–9 PM ET', timeZone: 'America/New_York' }],
    location: { format: 'in-person', name: 'New York City' },
    url: '/calendar#robotics-showcase',
    sourceUrl: 'https://robotweeknyc.org/#robotics-showcase',
    series: robotWeekSeries,
    format: 'In person',
    audience: ['NYIT students', 'Invited guests'],
    access: 'Private event · NYIT students and invited guests only',
    topics: ['Robotics companies', 'Researchers', 'University projects', 'Independent builders', 'Robotics startups'],
    registration: { ...interestRegistration, note: `Private event, open only to NYIT students and invited guests. ${robotWeek.interestNote} The venue address has not been announced.` },
  },
  {
    id: 'robot-week-nyc-2026-hackathon',
    slug: 'reachy-mini-hackathon',
    title: 'Reachy Mini Hackathon',
    summary: 'Design a new human–robot interaction in a two-day virtual build challenge.',
    description: 'How might we design an interaction that makes a robot more understandable, useful, expressive or engaging to humans?',
    status: 'announced',
    dates: [
      { label: 'Saturday · Build + Experiment', date: 'November 21, 2026', isoDate: '2026-11-21' },
      { label: 'Sunday · Submit + Demo + Recognition', date: 'November 22, 2026', isoDate: '2026-11-22' },
    ],
    location: { format: 'online', name: 'Online' },
    url: '/calendar#reachy-mini-hackathon',
    sourceUrl: 'https://robotweeknyc.org/#reachy-hackathon',
    series: robotWeekSeries,
    format: 'Virtual hackathon',
    audience: ['Designers', 'Coders', 'Artists', 'Researchers', 'Builders', 'Students', 'General public'],
    access: 'Open to the public',
    featuredRobots: ['Reachy Mini'],
    deliverables: ['Prototype or code', 'GitHub repository', 'Short demo video', 'Explanation of the interaction'],
    registration: { ...interestRegistration },
  },
]

export const siteEvents: SiteEvent[] = [...robotWeekEvents, workshopEvent, summitEvent]

export function getEventByIdOrSlug(idOrSlug: string): SiteEvent | undefined {
  return siteEvents.find((event) => event.id === idOrSlug || event.slug === idOrSlug)
}

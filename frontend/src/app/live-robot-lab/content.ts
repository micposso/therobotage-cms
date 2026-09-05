export const principles = [
  ['SEE', 'Watch real robots navigate, perceive, and respond.'],
  ['INTERACT', 'Experience human-robot interaction firsthand.'],
  [
    'UNDERSTAND',
    'Learn how sensors, AI, movement, and autonomy work together.',
  ],
  ['DESIGN', 'Explore how robots should behave around humans.'],
] as const

export const robots = [
  {
    name: 'Reachy Mini',
    subtitle: 'Social robotics + embodied AI',
    description:
      'Participants explore conversation, expression, perception, AI agents, and how robot behavior affects human interaction.',
    tags: ['Voice', 'Vision', 'AI', 'Expression', 'HRI'],
    image: '/images/robots/reachy-mini/hero.png',
    alt: 'Reachy Mini, a white tabletop robot with expressive eyes and two antennas.',
  },
  {
    name: 'Unitree Go2 Pro',
    subtitle: 'Movement + autonomous robotics',
    description:
      'Participants explore locomotion, spatial awareness, sensing, navigation, and what it means for a machine to physically operate around humans.',
    tags: ['LiDAR', 'Sensors', 'Movement', 'Navigation', 'Safety'],
    image: '/images/robots/unitree-go2-pro/shop-01.png',
    alt: 'Unitree Go2 Pro, a gray four-legged robot with forward-facing sensors.',
  },
] as const

type PricingOption = {
  title: string
  price: string
  details?: string[]
  description: string
  listTitle?: string
  items?: string[]
  extra?: string
  cta: string
}
export const pricing: PricingOption[] = [
  {
    title: 'K–12 Schools',
    price: 'From $1,250',
    details: ['2-hour experience', 'Up to 30 students'],
    description: 'Designed for elementary, middle, and high school students.',
    listTitle: 'Included',
    items: [
      'Reachy Mini + Go2 Pro',
      'Robot demonstrations',
      'Guided interactions',
      'Robot Literacy lesson',
      'Human-robot interaction activity',
      'Q&A',
      'Teacher resources',
    ],
    extra: 'Additional group: +$500',
    cta: 'Request School Pricing',
  },
  {
    title: 'Colleges & Universities',
    price: 'From $1,500',
    details: ['2-hour experience', 'Up to 40 participants'],
    description:
      'Explore embodied AI, robotics careers, human-robot interaction, UX, product design, and emerging technology.',
    cta: 'Bring Live Robot Lab to Campus',
  },
  {
    title: 'Corporate & Organizations',
    price: 'From $2,500',
    details: ['90–120 minutes', 'Up to 40 participants'],
    description:
      'An interactive introduction to embodied AI for teams exploring the future of work, AI, automation, and human-robot collaboration.',
    listTitle: 'Possible formats',
    items: [
      'Innovation Day',
      'Lunch & Learn',
      'Employee Experience',
      'Leadership Workshop',
      'Technology Showcase',
    ],
    cta: 'Request Corporate Pricing',
  },
  {
    title: 'Events',
    price: 'Custom pricing',
    description:
      'Conferences, exhibitions, community programs, and larger events.',
    cta: 'Tell Us About Your Event',
  },
]

export const agenda = [
  ['00–15 MIN', 'Meet the Robots', 'What makes something a robot?'],
  ['15–35 MIN', 'Robot Literacy', 'AI vs. robotics vs. embodied AI.'],
  [
    '35–60 MIN',
    'Robot Demonstrations',
    'Movement, sensing, perception, and communication.',
  ],
  [
    '60–90 MIN',
    'Human + Robot Lab',
    'Participants interact with Reachy and Go2.',
  ],
  [
    '90–110 MIN',
    'Robot Experience Challenge',
    'How should robots behave around people?',
  ],
  [
    '110–120 MIN',
    'Future of Robotics + Q&A',
    "Careers, society, and what's coming next.",
  ],
] as const

export const outcomes = [
  ['Robot Literacy', 'Understand what robots are and how they differ from AI.'],
  [
    'Embodied AI',
    'Understand what happens when AI can perceive and act physically.',
  ],
  ['Sensors + Perception', 'See how machines understand their surroundings.'],
  [
    'Human-Robot Interaction',
    'Explore how people communicate with intelligent machines.',
  ],
  [
    'Robot Experience Design',
    'Consider trust, behavior, accessibility, and usability.',
  ],
  ['Robotics Careers', 'Discover emerging roles beyond robotics engineering.'],
] as const

export const audiences = [
  {
    title: 'Elementary',
    label: 'Explore',
    topics: ['What is a robot?', 'How does it see?', 'How does it move?'],
  },
  {
    title: 'Middle School',
    label: 'Understand',
    topics: ['Sensors', 'AI', 'Autonomy', 'Human interaction'],
  },
  {
    title: 'High School',
    label: 'Design',
    topics: [
      'Embodied AI',
      'HRI',
      'Ethics',
      'Robot Experience Design',
      'Careers',
    ],
  },
  {
    title: 'College / Adult',
    label: 'Apply',
    topics: [
      'HRI',
      'AI agents',
      'Product design',
      'Automation',
      'Future of work',
    ],
  },
]

export const included = [
  'Reachy Mini robot',
  'Unitree Go2 Pro robot',
  'Robot Age instructor / facilitator',
  'Transport and setup within NYC',
  '2-hour facilitated program',
  'Robot Literacy curriculum',
  'Interactive HRI exercises',
  'Q&A',
  'Teacher / organizer preparation guide',
  'Digital follow-up resources',
]

export const faqs = [
  [
    'Is Live Robot Lab appropriate for students with no robotics experience?',
    'Yes. No coding or robotics background is required.',
  ],
  [
    'Can you customize the experience for different grades?',
    'Yes. Content and activities are adapted to age and audience.',
  ],
  [
    'How many participants can attend?',
    'Standard school sessions support approximately 30 participants. Larger groups can be accommodated through additional sessions or custom event formats.',
  ],
  [
    'Do students control the robots?',
    'Participants can take part in guided robot interactions depending on the activity, environment, and age group.',
  ],
  [
    'Where is Live Robot Lab available?',
    'Initially NYC and the surrounding metropolitan area. Travel programs can be quoted separately.',
  ],
  [
    'How much does it cost?',
    'School programs start at $1,250, university programs at $1,500, and corporate experiences at $2,500. Larger programs and events are quoted individually.',
  ],
] as const

// Replace null values only with verified metrics and approved participant quotes.
export const workshopMetrics: { label: string; value: string | null }[] = [
  'Workshop participants',
  'Robot interactions',
  'Future survey metric',
].map((label) => ({ label, value: null }))
export const testimonials: {
  label: string
  quote: string | null
  attribution: string | null
}[] = [
  'Educator perspective',
  'Participant perspective',
  'Organizer perspective',
].map((label) => ({ label, quote: null, attribution: null }))

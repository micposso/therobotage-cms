export interface GalleryItem {
  src: string
  alt: string
  caption: string
}

export interface DeploymentBox {
  label: string
  title: string
  body: string
}

export interface RobotProfile {
  slug: string
  title: string
  manufacturer: string
  category: string
  description: string
  image: string
  overview: string
  deploymentBoxes: [DeploymentBox, DeploymentBox]
  gallery: GalleryItem[]
}

const PLACEHOLDER_GALLERY: GalleryItem[] = [
  {
    src: '/images/hand.png',
    alt: 'Robot in operational context',
    caption: 'Operational environment — placeholder caption describing what is shown here.',
  },
  {
    src: '/images/hand.png',
    alt: 'User interaction moment',
    caption: 'User interaction — placeholder caption describing the interaction being observed.',
  },
  {
    src: '/images/hand.png',
    alt: 'System detail',
    caption: 'System detail — placeholder caption describing a specific component or behavior.',
  },
  {
    src: '/images/hand.png',
    alt: 'Environment overview',
    caption: 'Deployment environment — placeholder caption describing the physical space.',
  },
  {
    src: '/images/hand.png',
    alt: 'Failure or edge case',
    caption: 'Edge case or failure state — placeholder caption describing what was observed.',
  },
]

const PLACEHOLDER_DEPLOYMENT: [DeploymentBox, DeploymentBox] = [
  {
    label: 'Operational Context',
    title: 'Where and how this robot works',
    body: 'Placeholder describing the physical environment, the user population, shift patterns, and the workflow this robot is designed to support. This box will contain field-observed operational detail.',
  },
  {
    label: 'Friction Points',
    title: 'Where the experience breaks down',
    body: 'Placeholder describing observed friction, edge cases, user workarounds, and failure modes encountered during field observation. This box captures the gap between intended and actual use.',
  },
]

export const ROBOT_PROFILES: RobotProfile[] = [
  {
    slug: 'robot-profile-01',
    title: 'Robot Name One',
    manufacturer: 'Manufacturer One',
    category: 'Robot Profile',
    description: 'Placeholder description for this robot. A brief summary of what this robot does and where it operates.',
    image: '/images/hand.png',
    overview:
      'Overview content placeholder. This section will cover what this robot is, who makes it, and what problem it solves. Field observations, deployment context, and the human experience of interacting with it will be detailed here.',
    deploymentBoxes: PLACEHOLDER_DEPLOYMENT,
    gallery: PLACEHOLDER_GALLERY,
  },
  {
    slug: 'robot-profile-02',
    title: 'Robot Name Two',
    manufacturer: 'Manufacturer Two',
    category: 'Robot Profile',
    description: 'Placeholder description for this robot. A brief summary of what this robot does and where it operates.',
    image: '/images/hand.png',
    overview:
      'Overview content placeholder. This section will cover what this robot is, who makes it, and what problem it solves. Field observations, deployment context, and the human experience of interacting with it will be detailed here.',
    deploymentBoxes: PLACEHOLDER_DEPLOYMENT,
    gallery: PLACEHOLDER_GALLERY,
  },
  {
    slug: 'robot-profile-03',
    title: 'Robot Name Three',
    manufacturer: 'Manufacturer Three',
    category: 'Robot Profile',
    description: 'Placeholder description for this robot. A brief summary of what this robot does and where it operates.',
    image: '/images/hand.png',
    overview:
      'Overview content placeholder. This section will cover what this robot is, who makes it, and what problem it solves. Field observations, deployment context, and the human experience of interacting with it will be detailed here.',
    deploymentBoxes: PLACEHOLDER_DEPLOYMENT,
    gallery: PLACEHOLDER_GALLERY,
  },
]

export function getAllRobotProfiles(): RobotProfile[] {
  return ROBOT_PROFILES
}

export function getAllRobotProfileSlugs(): string[] {
  return ROBOT_PROFILES.map((r) => r.slug)
}

export function getRobotProfile(slug: string): RobotProfile | undefined {
  return ROBOT_PROFILES.find((r) => r.slug === slug)
}

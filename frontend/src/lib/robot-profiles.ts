import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
  type: string
  country: string
  priceRange: string
  yearIntroduced: number
  autonomy: string
  industry: string
  description: string
  image: string
  overview: string
  deploymentBoxes: DeploymentBox[]
  gallery: GalleryItem[]
}

const PROFILES_DIR = path.join(process.cwd(), 'robots-profiles')

function getProfileFiles(): string[] {
  if (!fs.existsSync(PROFILES_DIR)) return []
  return fs.readdirSync(PROFILES_DIR).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_')
  )
}

function parseProfile(file: string): RobotProfile {
  const raw = fs.readFileSync(path.join(PROFILES_DIR, file), 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug: data.slug as string,
    title: data.title as string,
    manufacturer: (data.manufacturer ?? '') as string,
    category: (data.category ?? 'Robot Profile') as string,
    type: (data.type ?? '') as string,
    country: (data.country ?? '') as string,
    priceRange: (data.priceRange ?? '') as string,
    yearIntroduced: (data.yearIntroduced ?? 0) as number,
    autonomy: (data.autonomy ?? '') as string,
    industry: (data.industry ?? '') as string,
    description: (data.description ?? '') as string,
    image: (data.image ?? '/images/hand.png') as string,
    overview: content.trim(),
    deploymentBoxes: (data.deploymentBoxes ?? []) as DeploymentBox[],
    gallery: (data.gallery ?? []) as GalleryItem[],
  }
}

export function getAllRobotProfiles(): RobotProfile[] {
  return getProfileFiles().map(parseProfile)
}

export function getAllRobotProfileSlugs(): string[] {
  return getProfileFiles()
    .map((f) => {
      const raw = fs.readFileSync(path.join(PROFILES_DIR, f), 'utf-8')
      const { data } = matter(raw)
      return data.slug as string
    })
    .filter(Boolean)
}

export function getRobotProfile(slug: string): RobotProfile | undefined {
  for (const file of getProfileFiles()) {
    const raw = fs.readFileSync(path.join(PROFILES_DIR, file), 'utf-8')
    const { data } = matter(raw)
    if (data.slug === slug) return parseProfile(file)
  }
  return undefined
}

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface RobotMeta {
  slug: string
  title: string
  manufacturer: string
  date: string
  excerpt: string
  headerImage: string
  thumbnailImage: string
  author?: string
}

export interface Robot extends RobotMeta {
  content: string
}

const ROBOTS_DIR = path.join(process.cwd(), 'robots')

function getRobotFiles(): string[] {
  if (!fs.existsSync(ROBOTS_DIR)) return []
  return fs.readdirSync(ROBOTS_DIR).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_')
  )
}

function parseFrontmatter(file: string): RobotMeta {
  const raw = fs.readFileSync(path.join(ROBOTS_DIR, file), 'utf-8')
  const { data } = matter(raw)
  return {
    slug:          data.slug as string,
    title:         data.title as string,
    manufacturer:  (data.manufacturer ?? '') as string,
    date:          data.date as string,
    excerpt:       (data.excerpt ?? '') as string,
    headerImage:   (data.headerImage ?? '') as string,
    thumbnailImage:(data.thumbnailImage ?? '') as string,
    author:        data.author as string | undefined,
  }
}

export function getAllRobots(): RobotMeta[] {
  return getRobotFiles()
    .map(parseFrontmatter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getLatestRobot(): RobotMeta | undefined {
  return getAllRobots()[0]
}

export function getAllRobotSlugs(): string[] {
  return getRobotFiles().map((f) => parseFrontmatter(f).slug).filter(Boolean)
}

export function getRobotBySlug(slug: string): Robot | undefined {
  const files = getRobotFiles()
  for (const file of files) {
    const filepath = path.join(ROBOTS_DIR, file)
    const raw = fs.readFileSync(filepath, 'utf-8')
    const { data, content: md } = matter(raw)
    if (data.slug === slug) {
      return {
        ...parseFrontmatter(file),
        content: String(marked.parse(md)),
      }
    }
  }
  return undefined
}

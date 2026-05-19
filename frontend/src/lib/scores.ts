import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface DimensionScore {
  score: number
  summary: string
}

export interface RobotScore {
  slug: string
  compositeScore: number
  tier: string
  dimensions: DimensionScore[]
}

const SCORES_DIR = path.join(process.cwd(), 'src', 'content', 'scores')

export function getScoreBySlug(slug: string): RobotScore | null {
  const filePath = path.join(SCORES_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)
  return {
    slug,
    compositeScore: data.compositeScore as number,
    tier: data.tier as string,
    dimensions: data.dimensions as DimensionScore[],
  }
}

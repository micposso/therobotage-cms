import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface NewsArticleMeta {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  headerImage: string
  thumbnailImage: string
  author?: string
}

export interface NewsArticle extends NewsArticleMeta {
  content: string // rendered HTML
}

const NEWS_DIR = path.join(process.cwd(), 'news')

function getNewsFiles(): string[] {
  if (!fs.existsSync(NEWS_DIR)) return []
  return fs.readdirSync(NEWS_DIR).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_')
  )
}

function parseFrontmatter(file: string): NewsArticleMeta {
  const raw = fs.readFileSync(path.join(NEWS_DIR, file), 'utf-8')
  const { data } = matter(raw)
  return {
    slug: data.slug as string,
    title: data.title as string,
    category: (data.category ?? 'NEWS') as string,
    date: data.date as string,
    excerpt: (data.excerpt ?? '') as string,
    headerImage: (data.headerImage ?? '') as string,
    thumbnailImage: (data.thumbnailImage ?? '') as string,
    author: data.author as string | undefined,
  }
}

export function getAllNewsArticles(): NewsArticleMeta[] {
  return getNewsFiles()
    .map(parseFrontmatter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllNewsSlugs(): string[] {
  return getNewsFiles().map((f) => parseFrontmatter(f).slug).filter(Boolean)
}

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  const files = getNewsFiles()
  for (const file of files) {
    const filepath = path.join(NEWS_DIR, file)
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

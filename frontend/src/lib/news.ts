import fs from 'fs'
import path from 'path'
import { createHash } from 'node:crypto'
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
  audioUrl?: string
}

const NEWS_DIR = path.join(process.cwd(), 'news')
const AUDIO_MANIFEST = path.join(NEWS_DIR, 'audio-manifest.json')

function getAudioUrl(slug: string, raw: string): string | undefined {
  // The pilot is staging-only. A production rollout can remove this gate later.
  if (process.env.SITE_NOINDEX !== 'true') return undefined
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!baseUrl || !fs.existsSync(AUDIO_MANIFEST)) return undefined
  const manifest = JSON.parse(fs.readFileSync(AUDIO_MANIFEST, 'utf8')) as Record<string, { path: string; sourceHash: string }>
  const entry = manifest[slug]
  // Match the publisher across Windows (CRLF) and deployment (LF) checkouts.
  if (!entry || entry.sourceHash !== createHash('sha256').update(raw.replace(/\r\n/g, '\n')).digest('hex')) return undefined
  if (!/^news\/[a-z0-9-]+\/[a-f0-9-]+\.mp3$/.test(entry.path)) return undefined
  return `${baseUrl.replace(/\/$/, '')}/storage/v1/object/public/article-audio/${entry.path}`
}

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
        audioUrl: getAudioUrl(slug, raw),
      }
    }
  }
  return undefined
}

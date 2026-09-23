import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { cache } from 'react'
import { marked } from 'marked'
import catalog from '../../../translations/catalog.json'
import { VERSION } from '../../../scripts/translation-core.mjs'
import { learnRoutes } from './learn-routes'

export interface TranslatedContent {
  id: string
  route: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Frontmatter schemas differ by collection.
  data: Record<string, any>
  body: string
  html: string
  generatedAt: string
}

export const getTranslatedContent = cache((): TranslatedContent[] => {
  return catalog.flatMap((source) => {
    if (source.expiresAt && new Date(source.expiresAt).getTime() <= Date.now()) return []
    const file = path.join(process.cwd(), 'translations', 'es', source.id)
    if (!fs.existsSync(file)) return []
    const { data, content } = matter(fs.readFileSync(file, 'utf8'))
    if (data.translation?.locale !== 'es' || data.translation?.sourceHash !== source.sourceHash || data.translation?.version !== VERSION) return []
    return [{ id: source.id, route: source.route, data, body: content, html: String(marked.parse(content)), generatedAt: String(data.translation.generatedAt) }]
  })
})

export function getAvailableTranslations(): string[] {
  return ['/', '/research', '/robots', '/jobs', '/search', ...learnRoutes, ...getTranslatedContent().map((entry) => entry.route).filter(Boolean)]
}

export function getTranslation(route: string) {
  return getTranslatedContent().find((entry) => entry.route === route)
}

export function translationAlternates(route: string) {
  return {
    en: `https://therobotage.com${route === '/' ? '' : route}`,
    ...(getAvailableTranslations().includes(route) ? { es: `https://therobotage.com/es${route === '/' ? '' : route}` } : {}),
    'x-default': `https://therobotage.com${route === '/' ? '' : route}`,
  }
}

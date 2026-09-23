import 'server-only'
import { getTranslation, getAvailableTranslations } from './content'
import { localizedHref, type Locale } from './routing'

// Adapt content to the existing page models; never substitute a translated view.
export function localize<T>(value: T, route: string, locale: Locale): T {
  if (!value || locale === 'en') return value
  const entry = getTranslation(route)
  if (!entry) return value
  const original = value as Record<string, unknown>
  const result = { ...original }
  const fields = ['title', 'headline', 'category', 'excerpt', 'description', 'summary', 'refDimension', 'essayNumber', 'type', 'country', 'priceRange', 'autonomy', 'industry', 'deploymentBoxes', 'gallery']
  for (const key of fields) {
    if (key in original && entry.data[key] !== undefined) result[key] = entry.data[key]
  }
  if ('content' in original) result.content = entry.html
  if ('overview' in original) result.overview = entry.body.trim()
  if ('body' in original) result.body = entry.body.trim().split(/\n\s*\n/)
  if ('descriptionHtml' in original) result.descriptionHtml = entry.html
  if ('audioUrl' in original) result.audioUrl = undefined
  return result as T
}

export function contentHref(href: string, locale: Locale) {
  return getAvailableTranslations().includes(href.split(/[?#]/)[0]) ? localizedHref(href, locale) : href
}

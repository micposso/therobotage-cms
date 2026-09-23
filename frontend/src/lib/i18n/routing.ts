export const locales = ['en', 'es'] as const
export type Locale = typeof locales[number]
export const languageNames: Record<Locale, string> = { en: 'English', es: 'Español' }
export const LANGUAGE_STORAGE_KEY = 'tra-language'

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'es'
}

export function routeLanguage(pathname: string): Locale {
  return /^\/es(?:\/|$)/.test(pathname) ? 'es' : 'en'
}

export function englishPath(pathname: string): string {
  return pathname.replace(/^\/(?:en|es)(?=\/|$)/, '') || '/'
}

/** Preserve query/hash; never prefix assets, APIs, external links, or fragments. */
export function localizedHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//') || /^\/(?:api|_next)(?:\/|$)/.test(href)) return href
  const match = href.match(/^([^?#]*)(.*)$/)!
  if (/\.[a-z0-9]+$/i.test(match[1])) return href
  const pathname = englishPath(match[1])
  return (locale === 'en' ? pathname : `/es${pathname === '/' ? '' : pathname}`) + match[2]
}

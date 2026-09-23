import type { Metadata } from 'next'
import type { Locale } from './routing'
import { localizedHref } from './routing'
import { translationAlternates } from './content'
import { uiText } from './messages'

export function pageMetadata(metadata: Metadata, route: string, locale: Locale): Metadata {
  const translated = JSON.parse(JSON.stringify(metadata, (key, value) =>
    typeof value === 'string' && ['title', 'absolute', 'description', 'alt'].includes(key)
      ? uiText(value, locale) : value,
  )) as Metadata
  const url = localizedHref(route, locale)
  return {
    ...translated,
    alternates: { canonical: url, languages: translationAlternates(route) },
    openGraph: { ...translated.openGraph, url, locale: locale === 'es' ? 'es_ES' : 'en_US' },
  }
}

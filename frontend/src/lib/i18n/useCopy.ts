'use client'
import { useLanguage } from '@/components/LanguageSwitcher/LanguageProvider'
import { uiText } from './messages'
import { localizedHref } from './routing'

export function useCopy() {
  const { locale, available } = useLanguage()
  return {
    locale,
    t: (text: string) => uiText(text, locale),
    href: (url: string) => available.includes(url.split(/[?#]/)[0]) ? localizedHref(url, locale) : url,
  }
}

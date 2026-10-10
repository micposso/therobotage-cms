'use client'
import FooterBase from '@therobotage/ui/Footer'
import { useLanguage } from '@/components/LanguageSwitcher/LanguageProvider'
import { localizedHref, englishPath } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'

/** @param {{ programs?: import('@therobotage/ui/lib/certifications').Certification[] }} props */
export default function Footer({ programs } = {}) {
  const { locale, preferred, available } = useLanguage()
  return <FooterBase programs={programs} translate={(text) => uiText(text, locale)} resolveHref={(href) => available.includes(englishPath(href.split(/[?#]/)[0])) ? localizedHref(href, locale === 'es' ? locale : preferred) : href} />
}

'use client'
import FooterBase from '@therobotage/ui/Footer'
import { useLanguage } from '@/components/LanguageSwitcher/LanguageProvider'
import { localizedHref, englishPath } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'

export default function Footer() {
  const { locale, preferred, available } = useLanguage()
  return <FooterBase translate={(text) => uiText(text, locale)} resolveHref={(href) => available.includes(englishPath(href.split(/[?#]/)[0])) ? localizedHref(href, locale === 'es' ? locale : preferred) : href} />
}

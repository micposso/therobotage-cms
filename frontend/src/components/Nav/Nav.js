'use client'

import NavBase from '@therobotage/ui/Nav'
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher'
import { useLanguage } from '@/components/LanguageSwitcher/LanguageProvider'
import { localizedHref, englishPath } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'

const lmsUrl = process.env.NEXT_PUBLIC_LMS_URL ?? 'https://learn.therobotage.com'

export default function Nav(props) {
  const { locale, preferred, available } = useLanguage()
  const resolveHref = (href) => available.includes(englishPath(href.split(/[?#]/)[0])) ? localizedHref(href, locale === 'es' ? locale : preferred) : href
  return <NavBase {...props} utilitySlot={<LanguageSwitcher />} translate={(text) => uiText(text, locale)} resolveHref={resolveHref} cta={props.cta ?? { label: uiText('Sign in', locale) + ' →', href: `${lmsUrl}/signin` }} />
}

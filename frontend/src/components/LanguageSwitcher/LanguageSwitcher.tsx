'use client'

import { useId } from 'react'
import { useLanguage } from './LanguageProvider'
import { isLocale, languageNames, locales } from '@/lib/i18n/routing'
import styles from './LanguageSwitcher.module.css'

export default function LanguageSwitcher() {
  const { locale, choose } = useLanguage()
  const id = useId()
  return <div className={styles.control}>
    <label htmlFor={id} className={styles.label}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>
      <span className={styles.srOnly}>{locale === 'es' ? 'Idioma' : 'Language'}</span>
    </label>
    <select id={id} value={locale} onChange={(event) => { if (isLocale(event.target.value)) choose(event.target.value) }}>
      {locales.map((language) => <option key={language} value={language} lang={language} aria-label={languageNames[language]}>{language.toUpperCase()}</option>)}
    </select>
  </div>
}

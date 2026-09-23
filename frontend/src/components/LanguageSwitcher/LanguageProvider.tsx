'use client'

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { englishPath, isLocale, LANGUAGE_STORAGE_KEY, localizedHref, type Locale } from '@/lib/i18n/routing'
import styles from './LanguageSwitcher.module.css'

const Context = createContext<{ locale: Locale; preferred: Locale; available: string[]; choose: (locale: Locale) => void }>({ locale: 'en', preferred: 'en', available: [], choose: () => {} })
export const useLanguage = () => useContext(Context)

function subscribePreference(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener('tra-language-change', callback)
  return () => { window.removeEventListener('storage', callback); window.removeEventListener('tra-language-change', callback) }
}
function readPreference(): Locale | null {
  if (new URLSearchParams(window.location.search).get('lang') === 'es') return 'es'
  try { const value = localStorage.getItem(LANGUAGE_STORAGE_KEY); return isLocale(value) ? value : null } catch { return null }
}

export function LanguageProvider({ locale, available, children }: { locale: Locale; available: string[]; children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  const stored = useSyncExternalStore(subscribePreference, readPreference, () => null)
  const [choice, setChoice] = useState<Locale | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const preferred = choice || stored || locale
  const notice = !dismissed && preferred === 'es' && locale === 'en' && !available.includes(englishPath(pathname))

  useEffect(() => {
    if (choice !== null) return // Explicit selection already starts exactly one navigation.
    const explicit = new URLSearchParams(window.location.search).get('lang')
    // Explicit /es URLs and the "read original" override win over saved preferences.
    if (locale === 'en' && stored === 'es' && explicit !== 'en' && available.includes(englishPath(pathname))) {
      window.location.replace(localizedHref(window.location.pathname + window.location.search + window.location.hash, stored))
    }
  }, [available, choice, locale, pathname, stored])

  function choose(next: Locale) {
    setChoice(next)
    setDismissed(false)
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, next) } catch { /* Choice still works without persistence. */ }
    window.dispatchEvent(new Event('tra-language-change'))
    const current = englishPath(pathname)
    if (next === 'es' && !available.includes(current)) return
    const query = new URLSearchParams(window.location.search)
    query.delete('lang')
    const destination = localizedHref(pathname + (query.size ? '?' + query.toString() : '') + window.location.hash, next)
    if (destination !== window.location.pathname + window.location.search + window.location.hash) window.location.assign(destination)
  }

  return <Context.Provider value={{ locale, preferred, available, choose }}>
    {children}
    {notice && <aside className={styles.notice} role="status" lang="es">
      <p>Esta página todavía está disponible solo en inglés. Guardamos tu preferencia de español.</p>
      <Link href="/es">Ver contenido en español</Link>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Cerrar aviso">×</button>
    </aside>}
  </Context.Provider>
}

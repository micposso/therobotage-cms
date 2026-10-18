'use client'

import { useActionState } from 'react'
import { joinWaitlist } from '@/app/actions/joinWaitlist'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import styles from './access.module.css'

export default function AccessForm({ locale, interest = 'academy', buttonLabel = 'Get Academy Updates' }: { locale: Locale; interest?: 'rpdp' | 'rdp' | 'academy'; buttonLabel?: string }) {
  const [state, action, pending] = useActionState(joinWaitlist, { success: false })
  const t = (text: string) => uiText(text, locale)
  if (state.success) return <p role="status">{t("You're on the list. Check your inbox for confirmation. Joining does not reserve a seat.")}</p>
  return <form action={action} className={styles.form}>
    <input name="interest" type="hidden" value={interest} />
    <input name="locale" type="hidden" value={locale} />
    <input name="name" type="text" autoComplete="name" aria-label={t('Your name')} placeholder={t('Your name')} className={styles.input} maxLength={254} />
    <input name="email" type="email" autoComplete="email" required aria-label={t('Your email')} placeholder={t('Your email')} className={styles.input} maxLength={254} />
    {state.error && <p role="alert">{t(state.error)}</p>}
    <button type="submit" disabled={pending} className={styles.submitButton}>{t(pending ? 'Sending...' : buttonLabel)}</button>
  </form>
}

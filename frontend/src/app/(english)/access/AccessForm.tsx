'use client'

import { startTransition, useActionState, useEffect, useRef } from 'react'
import { joinWaitlist } from '@/app/actions/joinWaitlist'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import { trackRpdp } from '@/lib/rpdp-analytics'
import { utmFields, type RpdpQuery } from '@/lib/rpdp-registration'
import styles from './access.module.css'

type Props = { locale: Locale; buttonLabel?: string } & (
  | { interest?: 'academy' | 'rdp'; rpdp?: never }
  | { interest: 'rpdp'; rpdp: { source: string; query: RpdpQuery } }
)

export default function AccessForm({ locale, interest = 'academy', buttonLabel = 'Get Academy Updates', rpdp }: Props) {
  const [state, action, pending] = useActionState(joinWaitlist, { success: false })
  const started = useRef(false)
  const t = (text: string) => uiText(text, locale)

  useEffect(() => {
    if (!rpdp) return
    if (state.error) trackRpdp(locale, { event: 'rpdp_interest_form_error' })
    if (state.success) {
      const promotional_eligibility = state.promotionalEligibility === true
      trackRpdp(locale, { event: 'rpdp_interest_form_success', promotional_eligibility })
      trackRpdp(locale, { event: 'rpdp_promotional_eligibility', promotional_eligibility })
    }
  }, [locale, rpdp, state])

  if (state.success && !rpdp) return <p role="status">{t("You're on the list. Check your inbox for confirmation. Joining does not reserve a seat.")}</p>

  const nameInput = <input name="name" type="text" autoComplete="name" aria-label={t(rpdp ? 'Full name' : 'Your name')}
    placeholder={rpdp ? undefined : t('Your name')} className={styles.input} maxLength={254}
    required={Boolean(rpdp)} pattern={rpdp ? '.*\\S.*' : undefined} />
  const emailInput = <input name="email" type="email" autoComplete="email" required aria-label={t(rpdp ? 'Email address' : 'Your email')}
    placeholder={rpdp ? undefined : t('Your email')} className={styles.input} maxLength={254} />

  const form = !state.success && <form action={action} className={styles.form}
    aria-describedby={rpdp ? 'rpdp-form-note' : undefined}
    onSubmit={rpdp ? event => {
      event.preventDefault()
      if (pending) return
      // Dispatch manually after hydration so React keeps the fields on a failed write.
      const data = new FormData(event.currentTarget)
      startTransition(() => action(data))
    } : undefined}
    onFocus={rpdp ? () => {
      if (started.current) return
      started.current = true
      trackRpdp(locale, { event: 'rpdp_interest_form_start' })
    } : undefined}
    onInvalid={rpdp ? event => {
      const firstInvalid = event.currentTarget.querySelector(':invalid')
      if (event.target === firstInvalid) trackRpdp(locale, { event: 'rpdp_interest_form_error' })
    } : undefined}>
    <input name="interest" type="hidden" value={interest} />
    <input name="locale" type="hidden" value={locale} />
    {rpdp ? <>
      <input name="source_page" type="hidden" value={rpdp.source} />
      {utmFields.map(field => {
        const value = rpdp.query[field]
        const first = typeof value === 'string' ? value : value?.[0]
        return first ? <input key={field} name={field} type="hidden" value={first.slice(0, 200)} /> : null
      })}
      <label>{t('Full name')}{nameInput}</label>
      <label>{t('Email address')}{emailInput}</label>
      <label>{t('Audience')}
        <select required name="audience" className={styles.input} defaultValue="">
          <option value="" disabled>{t('Select an audience')}</option>
          <option value="student">{t('Student')}</option>
          <option value="professional">{t('Professional')}</option>
        </select>
      </label>
      <label>{t('Primary interest (optional)')}
        <select name="primary_interest" className={styles.input} defaultValue="">
          <option value="">{t('No selection')}</option>
          <option value="design">{t('Design')}</option>
          <option value="product">{t('Product Management')}</option>
          <option value="research">{t('Research/HRI')}</option>
          <option value="other">{t('Other')}</option>
        </select>
      </label>
      <label className={styles.checkbox}>
        <input type="checkbox" name="marketing_consent" />
        {t('Send me additional TheRobotAge news and program updates (optional).')}
      </label>
    </> : <>{nameInput}{emailInput}</>}
    {!rpdp && state.error && <p role="alert">{t(state.error)}</p>}
    <button type="submit" disabled={pending} className={styles.submitButton}>{t(pending ? 'Sending...' : buttonLabel)}</button>
  </form>

  if (!rpdp) return form
  return <>
    {form}
    <div role="alert" className={styles.feedback}>{state.error && t(state.error)}</div>
    <div role="status" className={styles.feedback}>
      {state.success && t(state.promotionalEligibility
        ? "You're on the RPDP interest list and qualified for the founding offer."
        : "You're on the RPDP interest list. We'll contact you when enrollment opens.")}
    </div>
  </>
}

'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { sendEnterpriseRequest } from '@/app/actions/sendEnterpriseRequest'
import { enterpriseFields, validateEnterpriseRequest, type EnterpriseErrors, type EnterpriseField } from '@/lib/enterpriseRequest'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import styles from './enterprise.module.css'
import cta from '@/components/FoundingCohort/FoundingCohort.module.css'
import { enterpriseContent } from './content'

export default function EnterpriseForm({ locale = 'en' }: { locale?: Locale }) {
  const t = (value: string) => uiText(value, locale)
  const [values, setValues] = useState<Partial<Record<EnterpriseField, string>>>({})
  const [localErrors, setLocalErrors] = useState<EnterpriseErrors | null>(null)
  const [state, action, pending] = useActionState(sendEnterpriseRequest, { success: false })
  const successRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const errors = localErrors ?? state.errors ?? {}
  function focusFirstError() {
    const field = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    const details = field?.closest('details')
    if (details) details.open = true
    field?.focus()
  }
  useEffect(() => {
    if (state.success) successRef.current?.focus()
    else if (state.errors) focusFirstError()
  }, [state])
  function renderField(field: typeof enterpriseFields[number]) {
      const id = `enterprise-${field.name}`
      const props = {
        id, name: field.name, required: field.required, className: styles.input,
        value: values[field.name] ?? '', 'aria-invalid': !!errors[field.name],
        'aria-describedby': errors[field.name] ? `${id}-error` : undefined,
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
          setLocalErrors({ ...errors, [field.name]: undefined })
        },
      }
      return <div className={`${styles.field} ${field.type === 'textarea' ? styles.fullWidth : ''}`} key={field.name}>
        <label htmlFor={id} className={styles.label}>{t(field.label)}{field.required ? <span aria-hidden="true"> *</span> : <span className={styles.optional}>({t('Optional')})</span>}</label>
        {field.type === 'select' ? <select {...props}><option value="">{t('Select an option')}</option>{field.options.map(option => <option key={option} value={option}>{t(option)}</option>)}</select>
          : field.type === 'textarea' ? <textarea {...props} maxLength={field.maxLength} rows={3} />
          : <input {...props} type={field.type} maxLength={field.maxLength} autoComplete={'autoComplete' in field ? field.autoComplete : undefined} />}
        {errors[field.name] && <p className={styles.error} id={`${id}-error`}>{t(errors[field.name]!)}</p>}
      </div>
  }
  if (state.success) return <p ref={successRef} className={styles.success} role="status" tabIndex={-1}>{t('Thank you. Your Academy briefing request has been received. We will be in touch using the email you provided.')}</p>
  return <form ref={formRef} className={styles.form} action={action} noValidate aria-busy={pending} onSubmit={(event) => {
    const next = validateEnterpriseRequest(new FormData(event.currentTarget))
    if (Object.keys(next).length) {
      event.preventDefault()
      setLocalErrors(next)
      requestAnimationFrame(focusFirstError)
    } else setLocalErrors(null)
  }}>
    <p className={styles.formNote}>{t('Required fields are marked *.')}</p>
    <div className={styles.honeypot} aria-hidden="true"><label htmlFor="enterprise-website">{t('Leave this field empty')}</label><input id="enterprise-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    {enterpriseFields.filter(field => field.required).map(renderField)}
    <details className={`${styles.details} ${styles.optionalFields}`}><summary>{t('Add deployment details (optional)')}</summary><div className={styles.optionalFieldsGrid}>{enterpriseFields.filter(field => !field.required).map(renderField)}</div></details>
    <p className={styles.consent}>{t('By submitting, you agree that The Robot Age may contact you about this inquiry. Read our')} <Link href="/privacy">{t('Privacy Policy')}</Link>.</p>
    {(Object.values(errors).some(Boolean) || state.error) && <p className={styles.formError} role="alert">{t(state.error || 'Please check the highlighted fields.')}</p>}
    <button type="submit" disabled={pending} className={`${cta.cta} ${styles.submitButton}`}>{t(pending ? 'Sending your request…' : enterpriseContent.cta)} <span aria-hidden="true">↗</span></button>
    <span className={styles.honeypot} role="status">{pending ? t('Sending your request…') : ''}</span>
  </form>
}

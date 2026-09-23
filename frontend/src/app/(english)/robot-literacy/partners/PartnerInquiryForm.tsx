'use client'
import { useCopy } from '@/lib/i18n/useCopy'

import { useRef, useState, type FormEvent } from 'react'
import { sendRobotLiteracyPartnerRequest } from '@/app/actions/sendRobotLiteracyPartnerRequest'
import {
  contributionOptions,
  partnerFields,
  validateRobotLiteracyPartnerRequest,
  type PartnerErrors,
} from '@/lib/robotLiteracyPartners'
import styles from '@/app/(english)/live-robot-lab/live-robot-lab.module.css'
import checks from '@/components/JobAlerts/JobAlertSignup.module.css'
import local from '../robot-literacy.module.css'

export default function PartnerInquiryForm() {
  const { t, href: resolveHref } = useCopy()
  const [errors, setErrors] = useState<PartnerErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const summary = useRef<HTMLDivElement>(null)
  const submitting = useRef(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    const data = new FormData(event.currentTarget)
    const nextErrors = validateRobotLiteracyPartnerRequest(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus('error')
      setMessage('Please check the highlighted fields.')
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    submitting.current = true
    setStatus('loading')
    setMessage('Sending your partnership inquiry...')
    try {
      const result = await sendRobotLiteracyPartnerRequest(data)
      setErrors(result.errors ?? {})
      setStatus(result.success ? 'success' : 'error')
      setMessage(result.success ? 'Thank you. Your Robot Literacy partnership inquiry has been sent. We will contact you to discuss the right collaboration.' : result.error ?? 'Please check the highlighted fields.')
    } catch {
      setStatus('error')
      setMessage('Your request could not be sent. Please try again or email hello@therobotage.com.')
    } finally {
      submitting.current = false
      requestAnimationFrame(() => summary.current?.focus())
    }
  }

  return (
    <form onSubmit={submit} noValidate className={styles.form} aria-busy={status === 'loading'}>
      <p>{t("Fields marked * are required.")}</p>
      <div ref={summary} tabIndex={-1} role={status === 'error' ? 'alert' : 'status'} className={message ? styles.notice : undefined}>
        {message && <p>{t(message)}</p>}
        {!!Object.keys(errors).length && (
          <ul>
            {Object.entries(errors).map(([name, error]) => (
              <li key={name}><a href={resolveHref(`#partner-${name}`)}>{t(error)}</a></li>
            ))}
          </ul>
        )}
      </div>
      {status !== 'success' && (
        <>
          <fieldset disabled={status === 'loading'} className={styles.formGrid}>
            <legend className={styles.srOnly}>{t("Robot Literacy partner inquiry details")}</legend>
            {partnerFields.map((field) => {
              const id = `partner-${field.name}`
              const common = {
                id,
                name: field.name,
                required: field.required,
                'aria-invalid': !!errors[field.name],
                'aria-describedby': errors[field.name] ? `${id}-error` : undefined,
                className: styles.input,
              }
              return (
                <div className={field.type === 'textarea' ? styles.fullField : styles.field} key={field.name}>
                  <label htmlFor={id}>{t(field.label)}{t(field.required ? ' *' : ' (optional)')}</label>
                  {field.options ? (
                    <select {...common} defaultValue="">
                      <option value="">{t("Select an option")}</option>
                      {field.options.map((option) => <option key={option} value={option}>{t(option)}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea {...common} rows={6} maxLength={3000} placeholder={t(field.placeholder ?? '')} />
                  ) : (
                    <input {...common} type={field.type ?? 'text'} autoComplete={field.autoComplete} maxLength={240} />
                  )}
                  {errors[field.name] && <p id={`${id}-error`} className={styles.fieldError}>{t(errors[field.name])}</p>}
                </div>
              )
            })}
          </fieldset>
          <fieldset id="partner-contributions" tabIndex={-1} disabled={status === 'loading'} className={local.interestGroup} aria-describedby={errors.contributions ? 'partner-contributions-error' : undefined}>
            <legend>{t("How could your organization contribute? ")}<span className={styles.consent}>{t("(optional)")}</span></legend>
            {contributionOptions.map((option) => (
              <label className={checks.checkboxField} key={option}>
                <input type="checkbox" className={checks.checkbox} name="contributions" value={option} />
                {t(option ?? '')}
              </label>
            ))}
            {errors.contributions && <p id="partner-contributions-error" className={styles.fieldError}>{t(errors.contributions)}</p>}
          </fieldset>
          <label className={checks.checkboxField}>
            <input
              id="partner-consent"
              className={checks.checkbox}
              type="checkbox"
              name="consent"
              value="yes"
              required
              disabled={status === 'loading'}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? 'partner-consent-error' : undefined}
            />{t("I agree to be contacted by The Robot Age regarding Robot Literacy partnerships.")}</label>
          {errors.consent && <p id="partner-consent-error" className={styles.fieldError}>{t(errors.consent)}</p>}
          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={status === 'loading'}>
              {t(status === 'loading' ? 'Sending inquiry...' : 'Start a Partnership Conversation')}
            </button>
          </div>
        </>
      )}
    </form>
  )
}

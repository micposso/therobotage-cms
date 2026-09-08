'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { sendRobotLiteracyRequest } from '@/app/actions/sendRobotLiteracyRequest'
import { interests, literacyFields, validateLiteracyRequest, type LiteracyErrors } from '@/lib/robotLiteracy'
import styles from '@/app/live-robot-lab/live-robot-lab.module.css'
import checks from '@/components/JobAlerts/JobAlertSignup.module.css'
import local from './robot-literacy.module.css'

export default function RobotLiteracyRequestForm() {
  const [errors, setErrors] = useState<LiteracyErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const summary = useRef<HTMLDivElement>(null)
  const submitting = useRef(false)
  useEffect(() => {
    const selectPartner = () => setSelected((current) => current.includes('Curriculum Partnership') ? current : [...current, 'Curriculum Partnership'])
    window.addEventListener('robot-literacy-partnership', selectPartner)
    return () => window.removeEventListener('robot-literacy-partnership', selectPartner)
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    const data = new FormData(event.currentTarget)
    const nextErrors = validateLiteracyRequest(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus('error')
      setMessage('Please check the highlighted fields.')
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    submitting.current = true
    setStatus('loading')
    setMessage('Sending your inquiry…')
    try {
      const result = await sendRobotLiteracyRequest(data)
      setErrors(result.errors ?? {})
      setStatus(result.success ? 'success' : 'error')
      setMessage(result.success ? 'Thank you. Your Robot Literacy inquiry has been sent. We’ll contact you to discuss your goals and the right program for your organization.' : result.error ?? 'Please check the highlighted fields.')
    } catch {
      setStatus('error')
      setMessage('Your request could not be sent. Please try again or email hello@therobotage.com.')
    } finally {
      submitting.current = false
      requestAnimationFrame(() => summary.current?.focus())
    }
  }

  return <form onSubmit={submit} noValidate className={styles.form} aria-busy={status === 'loading'}>
    <p>Fields marked * are required.</p>
    <div ref={summary} tabIndex={-1} role={status === 'error' ? 'alert' : 'status'} className={message ? styles.notice : undefined}>
      {message && <p>{message}</p>}
      {!!Object.keys(errors).length && <ul>{Object.entries(errors).map(([name, error]) => <li key={name}><a href={`#literacy-${name}`}>{error}</a></li>)}</ul>}
    </div>
    {status !== 'success' && <>
      <fieldset disabled={status === 'loading'} className={styles.formGrid}>
        <legend className={styles.srOnly}>Robot Literacy inquiry details</legend>
        {literacyFields.map((field) => {
          const id = `literacy-${field.name}`
          const common = { id, name: field.name, required: field.required, 'aria-invalid': !!errors[field.name], 'aria-describedby': errors[field.name] ? `${id}-error` : undefined, className: styles.input }
          return <div className={field.type === 'textarea' ? styles.fullField : styles.field} key={field.name}>
            <label htmlFor={id}>{field.label}{field.required ? ' *' : ' (optional)'}</label>
            {field.options ? <select {...common} defaultValue=""><option value="">Select an option</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
              : field.type === 'textarea' ? <textarea {...common} rows={5} maxLength={3000} />
                : <input {...common} type={field.type ?? 'text'} autoComplete={field.autoComplete} maxLength={200} />}
            {errors[field.name] && <p id={`${id}-error`} className={styles.fieldError}>{errors[field.name]}</p>}
          </div>
        })}
      </fieldset>
      <fieldset id="literacy-interests" tabIndex={-1} disabled={status === 'loading'} className={local.interestGroup} aria-describedby={errors.interests ? 'literacy-interests-error' : undefined}>
        <legend>I&apos;m interested in * <span className={styles.consent}>(select all that apply)</span></legend>
        {interests.map((interest) => <label className={checks.checkboxField} key={interest}>
          <input type="checkbox" className={checks.checkbox} name="interests" value={interest} checked={selected.includes(interest)}
            onChange={(event) => setSelected((current) => event.target.checked ? [...current, interest] : current.filter((item) => item !== interest))} />{interest}
        </label>)}
        {errors.interests && <p id="literacy-interests-error" className={styles.fieldError}>{errors.interests}</p>}
      </fieldset>
      <label className={checks.checkboxField}>
        <input id="literacy-consent" className={checks.checkbox} type="checkbox" name="consent" value="yes" required disabled={status === 'loading'}
          aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'literacy-consent-error' : undefined} />
        I agree to be contacted by The Robot Age regarding Robot Literacy programs and partnerships.
      </label>
      {errors.consent && <p id="literacy-consent-error" className={styles.fieldError}>{errors.consent}</p>}
      <div className={styles.actions}><button className={styles.button} type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Sending inquiry…' : 'Start a Conversation'}</button></div>
    </>}
  </form>
}

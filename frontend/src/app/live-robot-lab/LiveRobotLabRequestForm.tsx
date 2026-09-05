'use client'

import { useRef, useState, type FormEvent } from 'react'
import { sendLiveRobotLabRequest } from '@/app/actions/sendLiveRobotLabRequest'
import {
  labFields,
  validateLabRequest,
  type LabErrors,
} from '@/lib/liveRobotLab'
import styles from './live-robot-lab.module.css'

export default function LiveRobotLabRequestForm() {
  const [errors, setErrors] = useState<LabErrors>({})
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')
  const summary = useRef<HTMLDivElement>(null)
  const submitting = useRef(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    const data = new FormData(event.currentTarget)
    const nextErrors = validateLabRequest(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus('error')
      setMessage('Please check the highlighted fields.')
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    submitting.current = true
    setStatus('loading')
    setMessage('')
    try {
      const result = await sendLiveRobotLabRequest(data)
      setErrors(result.errors ?? {})
      setStatus(result.success ? 'success' : 'error')
      setMessage(
        result.success
          ? 'Thank you. Your Live Robot Lab request has been sent. We’ll contact you about the right format, pricing, and availability.'
          : (result.error ?? 'Please check the highlighted fields.'),
      )
    } catch {
      setStatus('error')
      setMessage(
        'Your request could not be sent. Please try again or email hello@therobotage.com.',
      )
    } finally {
      submitting.current = false
      requestAnimationFrame(() => summary.current?.focus())
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={styles.form}
      aria-busy={status === 'loading'}
    >
      <p>Fields marked * are required.</p>
      <div
        ref={summary}
        tabIndex={-1}
        role={status === 'error' ? 'alert' : 'status'}
        className={message ? styles.notice : undefined}
      >
        {message && <p>{message}</p>}
        {!!Object.keys(errors).length && (
          <ul>
            {labFields
              .filter((field) => errors[field.name])
              .map((field) => (
                <li key={field.name}>
                  <a href={`#lab-${field.name}`}>
                    {field.label}: {errors[field.name]}
                  </a>
                </li>
              ))}
          </ul>
        )}
      </div>
      {status !== 'success' && (
        <>
          <fieldset disabled={status === 'loading'} className={styles.formGrid}>
            <legend className={styles.srOnly}>
              Live Robot Lab request details
            </legend>
            {labFields.map((field) => {
              const id = `lab-${field.name}`
              const common = {
                id,
                name: field.name,
                required: 'required' in field && field.required,
                'aria-invalid': !!errors[field.name],
                'aria-describedby': errors[field.name]
                  ? `${id}-error`
                  : undefined,
                className: styles.input,
              }
              return (
                <div
                  className={
                    field.name === 'experience'
                      ? styles.fullField
                      : styles.field
                  }
                  key={field.name}
                >
                  <label htmlFor={id}>
                    {field.label}
                    {'required' in field && field.required
                      ? ' *'
                      : ' (optional)'}
                  </label>
                  {field.options ? (
                    <select {...common} defaultValue="">
                      <option value="">Select an option</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea {...common} rows={5} maxLength={3000} />
                  ) : (
                    <input
                      {...common}
                      type={field.type ?? 'text'}
                      autoComplete={field.autoComplete}
                      maxLength={200}
                    />
                  )}
                  {errors[field.name] && (
                    <p id={`${id}-error`} className={styles.fieldError}>
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              )
            })}
          </fieldset>
          <p className={styles.consent}>
            By submitting this form, you agree that The Robot Age may contact
            you about Live Robot Lab.
          </p>
          <button
            className={styles.button}
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending request…' : 'Request Information'}
          </button>
        </>
      )}
    </form>
  )
}

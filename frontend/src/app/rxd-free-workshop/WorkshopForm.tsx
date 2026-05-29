'use client'

import { useActionState } from 'react'
import { sendWorkshopEmail } from '@/app/actions/sendWorkshopEmail'
import styles from './workshop.module.css'

const initialState = { success: false, waitlisted: false, error: undefined as string | undefined }

const PROFESSIONS = [
  'Student',
  'Product Manager',
  'UX Designer',
  'Operations Lead',
  'Strategist',
  'Researcher',
  'HR Professional',
  'Facilities Manager',
  'Other',
]

const HEARD_OPTIONS = [
  'Social media',
  'Word of mouth',
  'The Robot Age newsletter',
  'Search (Google, etc.)',
  'A colleague or friend',
  'LinkedIn',
  'Other',
]

export default function WorkshopForm() {
  const [state, action, pending] = useActionState(sendWorkshopEmail, initialState)

  if (state.success) {
    if (state.waitlisted) {
      return (
        <div className={styles.success}>
          <p className={styles.successEyebrow}>You&rsquo;re on the waitlist</p>
          <p className={styles.successHeading}>This free workshop is full.</p>
          <p className={styles.successText}>
            We&rsquo;ve added you to the waitlist. If a spot opens up, we&rsquo;ll reach out to you directly. Check your inbox for a confirmation — and your spam folder if you don&rsquo;t see it within a few minutes.
          </p>
        </div>
      )
    }
    return (
      <div className={styles.success}>
        <p className={styles.successEyebrow}>You&rsquo;re registered</p>
        <p className={styles.successHeading}>See you at the workshop.</p>
        <p className={styles.successText}>
          A confirmation is on its way to your inbox with the session link and details. Check your spam folder if you don&rsquo;t see it within a few minutes.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className={styles.form} noValidate>
      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label htmlFor="ws-first-name" className={styles.label}>
            First name<span className={styles.required}>*</span>
          </label>
          <input
            id="ws-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="ws-last-name" className={styles.label}>
            Last name<span className={styles.required}>*</span>
          </label>
          <input
            id="ws-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ws-email" className={styles.label}>
          Email address<span className={styles.required}>*</span>
        </label>
        <input
          id="ws-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ws-profession" className={styles.label}>
          Profession<span className={styles.required}>*</span>
        </label>
        <select id="ws-profession" name="profession" required className={styles.select}>
          <option value="">Select one</option>
          {PROFESSIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ws-heard" className={styles.label}>
          How did you hear about this workshop?<span className={styles.required}>*</span>
        </label>
        <select id="ws-heard" name="heard" required className={styles.select}>
          <option value="">Select one</option>
          {HEARD_OPTIONS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {state.error && (
        <p className={styles.errorMsg} role="alert">{state.error}</p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={pending}>
        {pending ? 'Registering…' : 'Reserve my spot'}
      </button>
    </form>
  )
}

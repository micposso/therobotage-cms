'use client'

import { useActionState } from 'react'
import { sendContactEmail } from '@/app/actions/sendContactEmail'
import styles from './ContactForm.module.css'

const initialState = { success: false, error: undefined as string | undefined }

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContactEmail, initialState)

  if (state.success) {
    return (
      <div className={styles.success}>
        <p className={styles.successEyebrow}>Message sent</p>
        <p className={styles.successText}>
          We'll get back to you within a few business days.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className={styles.form} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="contact-name" className={styles.label}>Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your name"
          className={styles.input}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="contact-email" className={styles.label}>Email address</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={styles.input}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="contact-message" className={styles.label}>Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="What's on your mind?"
          className={styles.textarea}
        />
      </div>

      {state.error && (
        <p className={styles.errorMsg} role="alert">{state.error}</p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

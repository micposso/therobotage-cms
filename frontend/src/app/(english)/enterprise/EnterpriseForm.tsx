'use client'

import { useState, useActionState } from 'react'
import { sendEnterpriseRequest } from '@/app/actions/sendEnterpriseRequest'
import styles from './enterprise.module.css'

interface FormPayload {
  email: string
  name: string
  organization: string
  role: string
  deployment: string
}

export default function EnterpriseForm() {
  const [payload, setPayload] = useState<FormPayload>({
    email: '',
    name: '',
    organization: '',
    role: '',
    deployment: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const [state, action, pending] = useActionState(sendEnterpriseRequest, { success: false })

  if (state.success) return <p role="status">Thank you. We received your briefing request and will be in touch.</p>

  return (
    <form className={styles.form} action={action} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="name" className={styles.label}>
          Name<span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={styles.input}
          value={payload.name}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="organization" className={styles.label}>
          Organization<span className={styles.required}>*</span>
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          required
          autoComplete="organization"
          className={styles.input}
          value={payload.organization}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="role" className={styles.label}>
          Role<span className={styles.required}>*</span>
        </label>
        <input
          id="role"
          name="role"
          type="text"
          required
          autoComplete="organization-title"
          className={styles.input}
          value={payload.role}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="deployment" className={styles.label}>
          What are you deploying or considering?
        </label>
        <textarea
          id="deployment"
          name="deployment"
          className={styles.textarea}
          value={payload.deployment}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="enterprise-email" className={styles.label}>Email<span className={styles.required}>*</span></label>
        <input id="enterprise-email" name="email" type="email" required autoComplete="email" className={styles.input} value={payload.email} onChange={handleChange} />
      </div>
      {state.error && <p role="alert">{state.error}</p>}
      <button disabled={pending} type="submit" className={styles.submitButton}>
        {pending ? 'Sending...' : 'Request briefing'}
      </button>
    </form>
  )
}

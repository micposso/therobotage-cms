'use client'

import { useState } from 'react'
import styles from './enterprise.module.css'

interface FormPayload {
  name: string
  organization: string
  role: string
  deployment: string
}

export default function EnterpriseForm() {
  const [payload, setPayload] = useState<FormPayload>({
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(payload)
    // TODO: wire submission endpoint
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

      <button type="submit" className={styles.submitButton}>
        Request briefing
      </button>
    </form>
  )
}

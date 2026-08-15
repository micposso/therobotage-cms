'use client'

import { useActionState, useEffect, useRef } from 'react'
import { subscribeJobAlerts } from '@/app/actions/subscribeJobAlerts'
import {
  ROLE_FAMILIES,
  SENIORITIES,
  US_STATES,
} from '@/lib/jobsTaxonomy'
import styles from './JobAlertSignup.module.css'

type Props = {
  // Recorded per signup for lead attribution: 'jobs-index', 'job-detail:<slug>', etc.
  source: string
  defaultRoleFamily?: string
  defaultState?: string
}

const initialState = { success: false, error: undefined as string | undefined }

export default function JobAlertSignup({ source, defaultRoleFamily, defaultState }: Props) {
  const [state, action, pending] = useActionState(subscribeJobAlerts, initialState)

  // Stamped onto the DOM node after mount rather than held in state: the server and the
  // client then render the same initial value, and there is no cascading re-render. The
  // action rejects submissions that arrive impossibly fast after this timestamp.
  const startedAtRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now())
  }, [])

  if (state.success) {
    return (
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Job alerts</p>
        <h2 className={styles.headline}>{state.title ?? 'Check your inbox.'}</h2>
        <p className={styles.body}>
          {state.body ??
            'Confirmation is on its way. Every Tuesday you will get the roles posted that week that match what you asked for, and nothing when there is no match.'}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>Job alerts</p>
      <h2 className={styles.headline}>New robotics roles, once a week.</h2>
      <p className={styles.body}>
        Tell us what you do and where. We send one email on Tuesdays with the matching
        roles posted that week, and nothing at all when nothing matches.
      </p>

      <form action={action} className={styles.form}>
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="startedAt" defaultValue="0" ref={startedAtRef} />

        {/* Honeypot. Positioned off-screen rather than display:none, which some bots
            detect and skip. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span>Discipline</span>
          <select
            name="role_families"
            className={styles.input}
            defaultValue={defaultRoleFamily ?? ''}
          >
            <option value="">All disciplines</option>
            {ROLE_FAMILIES.map((family) => (
              <option key={family.slug} value={family.slug}>
                {family.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Level</span>
          <select name="seniorities" className={styles.input} defaultValue="">
            <option value="">All levels</option>
            {SENIORITIES.map((level) => (
              <option key={level.slug} value={level.slug}>
                {level.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>State</span>
          <select name="states" className={styles.input} defaultValue={defaultState ?? ''}>
            <option value="">Anywhere in the US</option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.checkboxField}>
          <input type="checkbox" name="remote_only" className={styles.checkbox} />
          <span>Remote roles only</span>
        </label>

        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? 'Signing up...' : 'Get weekly alerts'}
        </button>

        {state.error && (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        )}

        <p className={styles.fine}>
          One email a week. Unsubscribe in one click. We never sell your address.
        </p>
      </form>
    </div>
  )
}

'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resubscribeJobAlerts, unsubscribeJobAlerts } from '@/app/actions/unsubscribeJobAlerts'
import styles from './unsubscribe.module.css'

type Props = {
  token: string
  maskedEmail: string
}

const initialState = { success: false, error: undefined as string | undefined }

export default function UnsubscribeConfirm({ token, maskedEmail }: Props) {
  const [state, action, pending] = useActionState(unsubscribeJobAlerts, initialState)
  const [resubState, resubAction, resubPending] = useActionState(
    resubscribeJobAlerts,
    initialState
  )

  if (resubState.success) {
    return (
      <div>
        <h1 className={styles.headline}>You are back on the list.</h1>
        <p className={styles.body}>
          Weekly job alerts for {maskedEmail} will resume on the next send.
        </p>
        <Link className={styles.link} href="/jobs">
          Back to the job board
        </Link>
      </div>
    )
  }

  if (state.success) {
    return (
      <div>
        <h1 className={styles.headline}>You are unsubscribed.</h1>
        <p className={styles.body}>
          We will not send any more job alerts to {maskedEmail}. This takes effect
          immediately.
        </p>
        <form action={resubAction} className={styles.inlineForm}>
          <input type="hidden" name="token" value={token} />
          <button type="submit" className={styles.secondary} disabled={resubPending}>
            {resubPending ? 'Working...' : 'Actually, resubscribe me'}
          </button>
        </form>
        <Link className={styles.link} href="/jobs">
          Back to the job board
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className={styles.headline}>Unsubscribe from job alerts?</h1>
      <p className={styles.body}>
        This stops the weekly robotics job digest to {maskedEmail}. Nothing else changes.
      </p>

      <form action={action} className={styles.form}>
        <input type="hidden" name="token" value={token} />
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? 'Unsubscribing...' : 'Unsubscribe'}
        </button>
      </form>

      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}

      <Link className={styles.link} href="/jobs">
        Keep my alerts and go back to the job board
      </Link>
    </div>
  )
}

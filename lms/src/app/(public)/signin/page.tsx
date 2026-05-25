import type { Metadata } from 'next'
import SignInForm from './SignInForm'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Sign in' }

export default function SignInPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className={styles.page}>
      <a href={process.env.NEXT_PUBLIC_MARKETING_URL ?? 'https://therobotage.com'} className={styles.logo}>
        The Robot Age
      </a>

      <h1 className={styles.heading}>Sign in to your account.</h1>

      {searchParams.error && (
        <p className={styles.error}>Authentication failed. Try again.</p>
      )}

      <SignInForm />
    </div>
  )
}

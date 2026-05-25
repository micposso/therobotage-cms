'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from './LMSNav.module.css'

type LMSNavProps = {
  cohortLabel?: string
  currentWeek?: number
  totalWeeks?: number
  userName?: string
}

export default function LMSNav({
  cohortLabel = 'REP · Cohort 1',
  currentWeek = 1,
  totalWeeks = 6,
  userName = '',
}: LMSNavProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/signin')
    router.refresh()
  }

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>

        <Link href="/dashboard" className={styles.logo}>
          The <span className={styles.logoRobot}>Robot</span> Age
        </Link>

        <span className={styles.cohort}>{cohortLabel}</span>

        <span className={styles.progress}>
          Week {currentWeek} of {totalWeeks}
        </span>

        <div className={styles.userWrap}>
          <button
            className={styles.avatar}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            {initials || (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {menuOpen && (
            <>
              <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
              <div className={styles.dropdown}>
                <Link href="/profile" className={styles.dropdownLink} onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/profile/credentials" className={styles.dropdownLink} onClick={() => setMenuOpen(false)}>
                  Credentials
                </Link>
                <div className={styles.dropdownDivider} />
                <button className={styles.dropdownSignOut} onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

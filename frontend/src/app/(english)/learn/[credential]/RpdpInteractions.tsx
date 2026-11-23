'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n/routing'
import { trackRpdp } from '@/lib/rpdp-analytics'
import cohort from '@/components/FoundingCohort/FoundingCohort.module.css'
import styles from './RpdpPage.module.css'

export default function RpdpInteractions({ locale, signupLabel }: { locale: Locale; signupLabel: string }) {
  const [showSignup, setShowSignup] = useState(false)
  const trackedView = useRef(false)

  useEffect(() => {
    const page = document.getElementById('rpdp-program')
    const signup = document.getElementById('founding-cohort-list')
    if (!page || !signup) return

    if (!trackedView.current) {
      trackRpdp(locale, { event: 'rpdp_page_view' })
      trackedView.current = true
    }

    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return
      const placement = event.target.closest('a[data-rpdp-cta]')?.getAttribute('data-rpdp-cta')
      if (placement === 'hero' || placement === 'mobile') trackRpdp(locale, { event: 'rpdp_primary_cta_click', placement })
      if (event.target.closest('a[data-rpdp-capstone]')) trackRpdp(locale, { event: 'rpdp_capstone_interaction' })
    }

    function onToggle(event: Event) {
      const details = event.target
      if (details instanceof HTMLDetailsElement && details.dataset.rpdpWeek) {
        trackRpdp(locale, { event: 'rpdp_curriculum_toggle', week: Number(details.dataset.rpdpWeek), expanded: details.open })
      }
    }

    const mobile = window.matchMedia('(max-width: 767px)')
    const updateSignup = () => {
      setShowSignup(mobile.matches && signup.getBoundingClientRect().bottom <= 0)
    }
    updateSignup()
    window.addEventListener('scroll', updateSignup, { passive: true })
    window.addEventListener('resize', updateSignup)
    page.addEventListener('click', onClick)
    page.addEventListener('toggle', onToggle, true)
    return () => {
      window.removeEventListener('scroll', updateSignup)
      window.removeEventListener('resize', updateSignup)
      page.removeEventListener('click', onClick)
      page.removeEventListener('toggle', onToggle, true)
    }
  }, [locale])

  return <div className={styles.mobileSignup} data-visible={showSignup}>
    <a className={cohort.cta} href="#founding-cohort-list" data-rpdp-cta="mobile">{signupLabel}</a>
  </div>
}

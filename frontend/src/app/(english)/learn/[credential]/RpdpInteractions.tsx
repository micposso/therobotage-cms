'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n/routing'
import { trackRpdp } from '@/lib/rpdp-analytics'
import { RpdpSignupLink, rpdpSignup } from './RpdpOffer'
import styles from './RpdpPage.module.css'

export function AnimatedMetric({ value, locale }: { value: string; locale: Locale }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState<string | null>(null)

  useEffect(() => {
    setDisplay(null)
    const element = ref.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || motion.matches || !('IntersectionObserver' in window)) return

    const number = value.match(/[\d][\d.,]*/)?.[0]
    if (!number) return
    const target = Number(number.replace(locale === 'es' ? /\./g : /,/g, '').replace(',', '.'))
    const decimals = Number.isInteger(target) ? 0 : 1
    const formatter = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
      minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: true,
    })
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      function tick(now: number) {
        const progress = Math.min(1, (now - start) / 1000)
        if (progress >= 1 || motion.matches) {
          setDisplay(null)
          return
        }
        setDisplay(value.replace(number!, formatter.format(target * (1 - (1 - progress) ** 3))))
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(element)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [value, locale])

  return <span ref={ref}><span className={styles.metricAccessible}>{value}</span><span aria-hidden="true">{display ?? value}</span></span>
}

export default function RpdpInteractions({ locale }: { locale: Locale }) {
  const [showSignup, setShowSignup] = useState(false)
  const trackedView = useRef(false)

  useEffect(() => {
    const page = document.getElementById('rpdp-program')
    const signup = document.getElementById(rpdpSignup)
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
    <RpdpSignupLink locale={locale} placement="mobile" />
  </div>
}

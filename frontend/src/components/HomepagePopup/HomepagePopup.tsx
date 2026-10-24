'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { englishPath } from '@/lib/i18n/routing'
import WhitepaperModal from '@/components/WhitepaperModal/WhitepaperModal'

const POPUP_KEY = 'wp_popup_dismissed_at'
const CONSENT_KEY = 'tra-cookie-consent'
const DELAY_MS = 4000
const SUPPRESS_DAYS = 60

export default function WhitepaperPopup() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isEnterprise = englishPath(pathname) === '/enterprise'
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    function show() {
      clearTimeout(timer.current)
      setOpen(true)
    }
    function checkHash() {
      if (window.location.hash === '#whitepaper') show()
    }
    checkHash()
    window.addEventListener('tra:open-whitepaper', show)
    window.addEventListener('hashchange', checkHash)
    return () => {
      window.removeEventListener('tra:open-whitepaper', show)
      window.removeEventListener('hashchange', checkHash)
    }
  }, [pathname])

  useEffect(() => {
    // Keep Academy inquiries free from competing timed acquisition prompts.
    if (isEnterprise) return
    let dismissedAt: string | null = null
    let hasConsent = false
    try { dismissedAt = localStorage.getItem(POPUP_KEY); hasConsent = Boolean(localStorage.getItem(CONSENT_KEY)) } catch { return }
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24)
      if (daysSince < SUPPRESS_DAYS) return
    }

    function startTimer() {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setOpen(true), DELAY_MS)
    }

    // Returning visitor — consent already stored, start timer immediately
    if (hasConsent) {
      startTimer()
      return () => clearTimeout(timer.current)
    }

    // First visit — wait until the cookie banner is dismissed
    window.addEventListener('tra:consent-saved', startTimer, { once: true })
    return () => {
      window.removeEventListener('tra:consent-saved', startTimer)
      clearTimeout(timer.current)
    }
  }, [isEnterprise])

  function handleClose() {
    clearTimeout(timer.current)
    setOpen(false)
    if (window.location.hash === '#whitepaper') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    try { localStorage.setItem(POPUP_KEY, String(Date.now())) } catch { /* Dismiss for this visit. */ }
  }

  return <WhitepaperModal isOpen={open} onClose={handleClose} />
}

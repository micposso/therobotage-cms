'use client'

import { useState, useEffect } from 'react'
import WhitepaperModal from '@/components/WhitepaperModal/WhitepaperModal'

const POPUP_KEY = 'wp_popup_dismissed_at'
const CONSENT_KEY = 'tra-cookie-consent'
const DELAY_MS = 4000
const SUPPRESS_DAYS = 60

export default function WhitepaperPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dismissedAt = localStorage.getItem(POPUP_KEY)
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24)
      if (daysSince < SUPPRESS_DAYS) return
    }

    let timer: ReturnType<typeof setTimeout>

    function startTimer() {
      timer = setTimeout(() => setOpen(true), DELAY_MS)
    }

    // Returning visitor — consent already stored, start timer immediately
    if (localStorage.getItem(CONSENT_KEY)) {
      startTimer()
      return () => clearTimeout(timer)
    }

    // First visit — wait until the cookie banner is dismissed
    window.addEventListener('tra:consent-saved', startTimer, { once: true })
    return () => {
      window.removeEventListener('tra:consent-saved', startTimer)
      clearTimeout(timer)
    }
  }, [])

  function handleClose() {
    setOpen(false)
    localStorage.setItem(POPUP_KEY, String(Date.now()))
  }

  return <WhitepaperModal isOpen={open} onClose={handleClose} />
}

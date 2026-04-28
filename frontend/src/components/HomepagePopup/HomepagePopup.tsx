'use client'

import { useState, useEffect } from 'react'
import WhitepaperModal from '@/components/WhitepaperModal/WhitepaperModal'

const SESSION_KEY = 'wp_popup_seen'
const CONSENT_KEY = 'tra-cookie-consent'
const DELAY_MS = 4000

export default function WhitepaperPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return

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
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  return <WhitepaperModal isOpen={open} onClose={handleClose} />
}

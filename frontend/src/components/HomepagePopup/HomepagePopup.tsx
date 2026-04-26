'use client'

import { useState, useEffect } from 'react'
import WhitepaperModal from '@/components/WhitepaperModal/WhitepaperModal'

const SESSION_KEY = 'wp_popup_seen'
const DELAY_MS = 5000

export default function WhitepaperPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return
    const timer = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function handleClose() {
    setOpen(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  return <WhitepaperModal isOpen={open} onClose={handleClose} />
}

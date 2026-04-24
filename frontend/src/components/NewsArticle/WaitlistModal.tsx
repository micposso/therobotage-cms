'use client'

import { useWaitlist } from '@/context/WaitlistContext'
import styles from './WaitlistModal.module.css'

export default function WaitlistTrigger() {
  const { open } = useWaitlist()
  return (
    <button className={styles.trigger} onClick={open}>
      Reserve your seat →
    </button>
  )
}

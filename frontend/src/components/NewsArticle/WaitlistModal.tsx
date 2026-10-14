'use client'

import { useCopy } from '@/lib/i18n/useCopy'
import { useWaitlist } from '@/context/WaitlistContext'
import styles from './WaitlistModal.module.css'

export default function WaitlistTrigger() {
  const { open } = useWaitlist()
  const { t } = useCopy()
  return (
    <button className={styles.trigger} onClick={open}>
      {t('Get Academy Updates')} →
    </button>
  )
}

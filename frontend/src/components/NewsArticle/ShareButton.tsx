'use client'

import { useState } from 'react'
import styles from './ShareButton.module.css'

export default function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '')

  const openShare = (platform: 'facebook' | 'linkedin' | 'x') => {
    const url = encodeURIComponent(getUrl())
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      x:        `https://twitter.com/intent/tweet?url=${url}`,
    }
    window.open(targets[platform], '_blank', 'width=600,height=480,noopener,noreferrer')
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(getUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button className={styles.trigger} onClick={() => setOpen(true)}>
        Share
      </button>

      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

            <div className={styles.modalHeader}>
              <span className={styles.modalLabel}>Share this article</span>
              <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>

            <div className={styles.options}>
              <button className={styles.option} onClick={() => openShare('linkedin')}>
                <span className={styles.optionName}>LinkedIn</span>
                <span className={styles.optionArrow}>→</span>
              </button>
              <button className={styles.option} onClick={() => openShare('x')}>
                <span className={styles.optionName}>X</span>
                <span className={styles.optionArrow}>→</span>
              </button>
              <button className={styles.option} onClick={() => openShare('facebook')}>
                <span className={styles.optionName}>Facebook</span>
                <span className={styles.optionArrow}>→</span>
              </button>
              <button className={styles.option} onClick={copyLink}>
                <span className={styles.optionName}>{copied ? 'Copied!' : 'Copy link'}</span>
                <span className={styles.optionArrow}>{copied ? '✓' : '→'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

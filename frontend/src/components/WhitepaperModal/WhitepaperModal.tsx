'use client'

import { useEffect, useActionState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sendWhitepaperEmail } from '@/app/actions/sendWhitepaperEmail'
import styles from './WhitepaperModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const initialState = { success: false, error: undefined as string | undefined }

export default function WhitepaperModal({ isOpen, onClose }: Props) {
  const [state, action, pending] = useActionState(sendWhitepaperEmail, initialState)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          >
          {/* Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" />
              </svg>
            </button>

            {state.success ? (
              <div className={styles.success}>
                <p className={styles.eyebrow}>Ready to download</p>
                <h2 className={styles.successHeadline} id="modal-title">
                  Human-Robot Experience Framework, v2.0
                </h2>
                <p className={styles.successBody}>
                  We've also sent a link to your email.
                </p>
                <a
                  href="/pdf/href-therobotage-v2.pdf"
                  download
                  className={styles.downloadBtn}
                >
                  Download the white paper
                </a>
                <button className={styles.closeAction} onClick={onClose}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.headline} id="modal-title">
                  Learn the human experience of robotics.
                </h2>
                <p className={styles.description}>
                  The Human-Robot Experience Framework gives designers, product managers, and marketers a shared vocabulary for the moments that matter — how robots communicate, fail, and recover in the presence of people. Download v2.0 free.
                </p>

                <form action={action} className={styles.form} noValidate>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="wp-email" className={styles.label}>
                      Email address
                    </label>
                    <input
                      id="wp-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className={styles.input}
                    />
                  </div>

                  {state.error && (
                    <p className={styles.errorMsg} role="alert">{state.error}</p>
                  )}

                  <button type="submit" className={styles.submitBtn} disabled={pending}>
                    {pending ? 'Sending…' : 'Send me the white paper'}
                  </button>
                </form>

                <p className={styles.legalNote}>
                  We'll send you the link and occasional updates from The Robot Age. Unsubscribe anytime.
                </p>

                <div className={styles.directDownload}>
                  <a href="/pdf/href-therobotage-v2.pdf" download className={styles.directDownloadLink}>
                    Download directly without email
                  </a>
                  <span className={styles.directDownloadNote}>CC BY-NC 4.0 — free to use with attribution.</span>
                </div>
              </>
            )}
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

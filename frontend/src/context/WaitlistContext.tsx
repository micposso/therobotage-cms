'use client'
import { useCopy } from '@/lib/i18n/useCopy'

import { createContext, useContext, useState, useEffect, useActionState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { joinWaitlist } from '@/app/actions/joinWaitlist'
import styles from './WaitlistContext.module.css'

interface WaitlistContextValue {
  open: () => void
}

const WaitlistContext = createContext<WaitlistContextValue | null>(null)

const initialState = { success: false, error: undefined as string | undefined }

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const { t } = useCopy()
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, pending] = useActionState(joinWaitlist, initialState)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <WaitlistContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="waitlist-title"
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label={t("Close")}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {state.success ? (
                <div className={styles.success}>
                  <p className={styles.eyebrow}>{t("You're on the list.")}</p>
                  <h2 className={styles.successHeadline} id="waitlist-title">{t("We'll reach you first.")}</h2>
                  <p className={styles.successBody}>{t("Before the public announcement, you'll hear about the cohort schedule, founding-member pricing, and direct access to the instructor. Nothing in the meantime.")}</p>
                  <button className={styles.closeAction} onClick={() => setIsOpen(false)}>{t("Close")}</button>
                </div>
              ) : (
                <>
                  <p className={styles.eyebrow}>{t("REP Certification")}</p>
                  <h2 className={styles.headline} id="waitlist-title">{t("The first cohort runs May 2026.")}</h2>
                  <p className={styles.description}>{t("Certification dates are being confirmed now. Leave your email and we'll reach you before the public announcement — with the schedule, founding-member pricing, and direct access to the instructor.")}</p>

                  <form action={action} className={styles.form} noValidate>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="waitlist-email" className={styles.label}>{t("Email address")}</label>
                      <input
                        id="waitlist-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder={t("you@example.com")}
                        className={styles.input}
                      />
                    </div>

                    {state.error && (
                      <p className={styles.errorMsg} role="alert">{t(state.error)}</p>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={pending}>
                      {t(pending ? 'Saving…' : 'Reserve my seat →')}
                    </button>
                  </form>

                  <p className={styles.legalNote}>{t("No noise. Just the announcement when it's ready.")}</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </WaitlistContext.Provider>
  )
}

export function useWaitlist(): WaitlistContextValue {
  const ctx = useContext(WaitlistContext)
  if (!ctx) throw new Error('useWaitlist must be used inside WaitlistProvider')
  return ctx
}

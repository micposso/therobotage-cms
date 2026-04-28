'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './CookieBanner.module.css'

const CONSENT_KEY = 'tra-cookie-consent'
const CONSENT_VERSION = 1

type ConsentPrefs = {
  necessary: true
  analytics: boolean
  marketing: boolean
  version: number
  date: string
}

function updateGTMConsent(analytics: boolean, marketing: boolean) {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
    })
  }
}

function saveConsent(analytics: boolean, marketing: boolean): ConsentPrefs {
  const prefs: ConsentPrefs = {
    necessary: true,
    analytics,
    marketing,
    version: CONSENT_VERSION,
    date: new Date().toISOString().split('T')[0],
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
  updateGTMConsent(analytics, marketing)
  window.dispatchEvent(new Event('tra:consent-saved'))
  return prefs
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [managing, setManaging] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (!stored) { setVisible(true); return }
      const prefs: ConsentPrefs = JSON.parse(stored)
      if (prefs.version !== CONSENT_VERSION) { setVisible(true); return }
      updateGTMConsent(prefs.analytics, prefs.marketing)
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => { saveConsent(true, true); setVisible(false) }
  const decline = () => { saveConsent(false, false); setVisible(false) }
  const savePrefs = () => { saveConsent(analytics, marketing); setVisible(false) }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.banner}
          role="dialog"
          aria-label="Cookie preferences"
          aria-live="polite"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.inner}>
            <p className={styles.text}>
              We use cookies to understand how visitors use The Robot Age and to improve your experience.{' '}
              <a href="/privacy" className={styles.link}>Privacy policy</a>
            </p>

            <div className={styles.actions}>
              <button className={styles.btnManage} onClick={() => setManaging(m => !m)} aria-expanded={managing}>
                Manage preferences
              </button>
              <button className={styles.btnDecline} onClick={decline}>
                Reject non-essential
              </button>
              <button className={styles.btnAccept} onClick={accept}>
                Accept all
              </button>
            </div>
          </div>

          <AnimatePresence>
            {managing && (
              <motion.div
                className={styles.preferences}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.prefInner}>

                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Necessary</span>
                      <span className={styles.prefDesc}>Session management and security. Always active.</span>
                    </div>
                    <div className={`${styles.toggle} ${styles.toggleOn} ${styles.toggleDisabled}`} aria-disabled="true">
                      <span className={styles.toggleThumb} />
                    </div>
                  </div>

                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Analytics</span>
                      <span className={styles.prefDesc}>Helps us understand which pages are most useful. No personal data is sold.</span>
                    </div>
                    <button
                      className={`${styles.toggle} ${analytics ? styles.toggleOn : ''}`}
                      onClick={() => setAnalytics(a => !a)}
                      role="switch"
                      aria-checked={analytics}
                      aria-label="Toggle analytics cookies"
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </div>

                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Marketing</span>
                      <span className={styles.prefDesc}>Used to measure the effectiveness of outreach and promotions.</span>
                    </div>
                    <button
                      className={`${styles.toggle} ${marketing ? styles.toggleOn : ''}`}
                      onClick={() => setMarketing(m => !m)}
                      role="switch"
                      aria-checked={marketing}
                      aria-label="Toggle marketing cookies"
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </div>

                  <button className={styles.btnSave} onClick={savePrefs}>
                    Save preferences
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'
import { useCopy } from '@/lib/i18n/useCopy'

import { useWaitlist } from '@/context/WaitlistContext'
import styles from './FoundingCohort.module.css'

export default function FoundingCohort() {
  const { t } = useCopy()
  const { open } = useWaitlist()

  return (
    <section className={styles.block}>
      <div className={styles.grid}>

        {/* ── Left: cohort info ── */}
        <div className={styles.left}>
          <p className={styles.label}>{t("Founding Cohort · May 2026")}</p>
          <h2 className={styles.headline}>{t("Ten seats. One rate. First in.")}</h2>
          <p className={styles.body}>{t("The first REP cohort runs the first week of May 2026. This is the only time the program will run at this rate — and the only cohort where founding members get direct access to the instructor throughout.")}<br /><br />{t("No engineering background. No prerequisites. Just the credential the field is missing.")}</p>
        </div>

        {/* ── Right: price + CTA ── */}
        <div className={styles.right}>
          <div className={styles.pricing}>
            <span className={styles.priceMain}>$199</span>
            <span className={styles.priceMeta}>{t("full access")}</span>
            <span className={styles.priceMeta}>{t("or two payments of $99")}</span>
          </div>
          <div className={styles.ctaRow}>
            <button onClick={open} className={styles.cta}>{t("Reserve Your Seat →")}</button>
            <span className={styles.availability}>{t("10 seats available · Founding rate ends when the cohort fills")}</span>
          </div>
        </div>

      </div>
    </section>
  )
}

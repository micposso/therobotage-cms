import styles from './FoundingCohort.module.css'

interface FoundingCohortProps {
  checkoutUrl: string
}

export default function FoundingCohort({ checkoutUrl }: FoundingCohortProps) {
  return (
    <section className={styles.block}>
      <div className={styles.grid}>

        {/* ── Left: cohort info ── */}
        <div className={styles.left}>
          <p className={styles.label}>Founding Cohort · May 2026</p>
          <h2 className={styles.headline}>Ten seats. One rate. First in.</h2>
          <p className={styles.body}>
            The first REP cohort runs the first week of May 2026. This is the
            only time the program will run at this rate — and the only cohort
            where founding members get direct access to the instructor
            throughout.
            <br /><br />
            No engineering background. No prerequisites. Just the credential the
            field is missing.
          </p>
        </div>

        {/* ── Right: price + CTA ── */}
        <div className={styles.right}>
          <div className={styles.pricing}>
            <span className={styles.priceMain}>$199</span>
            <span className={styles.priceMeta}>full access</span>
            <span className={styles.priceMeta}>or two payments of $99</span>
          </div>
          <div className={styles.ctaRow}>
            <a href={checkoutUrl} className={styles.cta}>
              Reserve Your Seat →
            </a>
            <span className={styles.availability}>
              10 seats available · Founding rate ends when the cohort fills
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}

'use client'
import Link from 'next/link'
import { useCopy } from '@/lib/i18n/useCopy'
import styles from './FoundingCohort.module.css'

/** Current next steps shared by robot profiles; no expired cohort promotion. */
export default function FoundingCohort() {
  const { t, href } = useCopy()
  return <section className={styles.block}><div className={styles.grid}>
    <div className={styles.left}>
      <p className={styles.label}>{t('Learn with The Robot Age')}</p>
      <h2 className={styles.headline}>{t('Meet robots. Build practical skills.')}</h2>
      <p className={styles.body}>{t('Experience real robots in Live Robot Lab, or explore RPDP and RDP for professional learning in product design and deployment.')}</p>
    </div>
    <div className={styles.right}><div className={styles.ctaRow}>
      <Link href={href('/live-robot-lab')} className={styles.cta}>{t('Explore Live Robot Lab')} →</Link>
      <Link href={href('/learn#programs')} className={styles.cta}>{t('Explore Professional Programs')} →</Link>
    </div></div>
  </div></section>
}

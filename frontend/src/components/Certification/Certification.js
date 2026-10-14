'use client'
import Link from 'next/link'
import { programLinks } from '@/lib/certifications'
import { useCopy } from '@/lib/i18n/useCopy'
import styles from './Certification.module.css'

export default function Certification() {
  const { t, href } = useCopy()
  return <section id="programs" className={styles.section}>
    <div className="container-fluid">
      <div className={`row align-items-end ${styles.headerRow}`}>
        <div className="col-lg-6">
          <p className={styles.eyebrow}>{t('Our Programs')}</p>
          <h2 className={styles.headline}>{t('Understand. Experience. Design. Deploy.')}</h2>
        </div>
        <div className="col-lg-5 offset-lg-1">
          <p className={styles.subhead}>{t('Build your robot literacy, meet real robots, or develop professional skills in robot product design and deployment. Choose the starting point that fits your goals.')}</p>
          <Link href={href('/learn#programs')} className={styles.headerCta}>{t('Compare Professional Programs')} →</Link>
        </div>
      </div>
      <div className={styles.tracksGrid}>
        {programLinks.map((program) => <article key={program.href} className={styles.trackCard}>
          <h3 className={styles.trackName}>{t(program.label)}</h3>
          <p className={styles.trackDescription}>{t(program.summary)}</p>
          <Link href={href(program.href.startsWith('/learn/') ? `${program.href}#curriculum` : program.href)} className={styles.headerCta}>{t(program.cta)} →</Link>
        </article>)}
      </div>
      <p className={styles.subhead}>{t('RPDP and RDP are upcoming professional programs. Explore the Academy for dates and interest lists. Joining a list does not reserve a seat.')}</p>
    </div>
  </section>
}

'use client'
import Link from 'next/link'
import Image from '@/components/MediaImage'
import { programLinks } from '@/lib/certifications'
import { useCopy } from '@/lib/i18n/useCopy'
import styles from './Certification.module.css'

const programImages = {
  '/robot-literacy': 'robot-literacy-family',
  '/live-robot-lab': 'live-robot-lab-college',
  '/learn/rpdp': 'rpdp',
  '/learn/rdp': 'rdp-factory',
}

const programDescriptions = {
  '/robot-literacy': 'Understand robots through READ, RELATE, and COEXIST. Explore what robots can and cannot do, how they affect everyday environments, and how people can communicate and share spaces with them. Build the confidence to participate in a world with robots.',
  '/live-robot-lab': 'Experience real robots through guided, hands-on sessions for schools and organizations. Observe how robots move, sense, and respond, ask questions, and explore human-robot interaction together. Connect classroom ideas with practical experiences that build curiosity, understanding, and confidence around robots.',
}

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
          <Link href={href('/learn#programs')} className={`${styles.headerCta} ${styles.compareCta}`}>{t('Compare Professional Programs')} →</Link>
        </div>
      </div>
      <div className={styles.tracksGrid}>
        {programLinks.map((program) => <article key={program.href} className={styles.trackCard}>
          <div className={styles.trackImage}>
            <Image
              src={`/images/programs/${programImages[program.href]}.webp`}
              alt=""
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1024px) 45vw, 25vw"
            />
          </div>
          <h3 className={styles.trackName}>{t(program.label)}</h3>
          <p className={styles.trackDescription}>{t(programDescriptions[program.href] || program.summary)}</p>
          <Link href={href(program.href.startsWith('/learn/') ? `${program.href}#curriculum` : program.href)} className={`${styles.headerCta} ${styles.trackCta}`}>{t(program.cta)} →</Link>
        </article>)}
      </div>
      <p className={styles.subhead}>{t('RPDP and RDP are upcoming professional programs. Explore the Academy for dates and interest lists. Joining a list does not reserve a seat.')}</p>
    </div>
  </section>
}

import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import FoundingCohort from '@/components/FoundingCohort/FoundingCohort'
import { getCertificationBySlug, getAllCertificationSlugs } from '@/lib/certifications'
import styles from './CredentialPage.module.css'

export async function generateStaticParams() {
  return getAllCertificationSlugs().map((credential) => ({ credential }))
}

export async function generateMetadata({ params }: { params: Promise<{ credential: string }> }) {
  const { credential } = await params
  const cert = getCertificationBySlug(credential)
  if (!cert) return {}
  return {
    title: `${cert.abbr} — ${cert.name} — The Robot Age`,
    description: cert.description,
  }
}

export default async function CredentialPage({ params }: { params: Promise<{ credential: string }> }) {
  const { credential } = await params
  const cert = getCertificationBySlug(credential)
  if (!cert) notFound()

  const isLive = cert.status === 'Live'

  return (
    <>
      <Nav pinned />

      <main className={styles.page}>
        <div className="container-fluid">

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.meta}>
                <span className={styles.abbr}>{cert.abbr}</span>
                <span className={`${styles.status} ${isLive ? styles.statusLive : styles.statusSoon}`}>
                  {cert.status}
                </span>
              </div>
              <h1 className={styles.title}>{cert.name}</h1>
              <p className={styles.description}>{cert.description}</p>
              {isLive ? (
                <a href="/access" className={styles.ctaPrimary}>
                  Join the Waitlist →
                </a>
              ) : (
                <a href="/access" className={styles.ctaSecondary}>
                  Notify me when this opens →
                </a>
              )}
            </div>
            <div className={styles.headerRight}>
              <div className={styles.specCard}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Format</span>
                  <span className={styles.specValue}>{cert.format}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Duration</span>
                  <span className={styles.specValue}>{cert.duration}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>For</span>
                  <span className={styles.specValue}>{cert.audience}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ── Overview ────────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>Overview</p>
            <p className={styles.overviewText}>{cert.overview}</p>
          </section>

          {/* ── Founding Cohort ─────────────────────────────────────────────── */}
          {cert.slug === 'rep' && (
            <FoundingCohort />
          )}

          {/* ── Curriculum ──────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>Curriculum</p>
            <div className={styles.moduleList}>
              {cert.modules.map((mod) => (
                <div key={mod.number} className={styles.moduleRow}>
                  <span className={styles.moduleNumber}>{mod.number}</span>
                  <div className={styles.moduleContent}>
                    <div className={styles.moduleTitleRow}>
                      <h3 className={styles.moduleTitle}>{mod.title}</h3>
                      <span className={`${styles.moduleStatus} ${mod.status === 'Live' ? styles.statusLive : styles.statusSoon}`}>
                        {mod.status}
                      </span>
                    </div>
                    <p className={styles.moduleDescription}>{mod.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Outcomes ────────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>What you'll be able to do</p>
            <ul className={styles.outcomeList}>
              {cert.outcomes.map((outcome, i) => (
                <li key={i} className={styles.outcomeItem}>
                  <span className={styles.outcomeTick}>—</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Back ────────────────────────────────────────────────────────── */}
          <div className={styles.back}>
            <a href="/learn" className={styles.backLink}>← Back to Curriculum</a>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

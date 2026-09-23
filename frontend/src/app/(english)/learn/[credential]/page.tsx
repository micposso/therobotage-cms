import { pageMetadata } from '@/lib/i18n/page-metadata'
import { contentHref } from '@/lib/i18n/localize'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import FoundingCohort from '@/components/FoundingCohort/FoundingCohort'
import { getCertificationBySlug, getAllCertificationSlugs } from '@/lib/certifications'
import styles from './CredentialPage.module.css'

export async function generateStaticParams() {
  return getAllCertificationSlugs().map((credential) => ({ credential }))
}

export async function generateMetadata({ params }: { params: Promise<{ credential: string; locale?: Locale }> }) {
  const { credential, locale = 'en' } = await params
  const cert = getCertificationBySlug(credential)
  if (!cert) return {}
  return pageMetadata({
    title: `${cert.abbr} — ${uiText(cert.name, locale)} — The Robot Age`,
    description: uiText(cert.description, locale),
    openGraph: {
      title: `${cert.abbr} — ${uiText(cert.name, locale)}`,
      description: uiText(cert.description, locale),
      images: [{ url: '/images/learn.png', alt: 'The Robot Age' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cert.abbr} — ${uiText(cert.name, locale)}`,
      description: uiText(cert.description, locale),
      images: ['/images/learn.png'],
    },
   }, `/learn/${credential}`, locale)
}

export default async function CredentialPage({ params }: { params: Promise<{ credential: string; locale?: Locale }> }) {
  const { credential, locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const resolveHref = (url: string) => contentHref(url, locale)
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
                <span className={styles.abbr}>{t(cert.abbr)}</span>
                <span className={`${styles.status} ${isLive ? styles.statusLive : styles.statusSoon}`}>
                  {t(cert.status ?? '')}
                </span>
              </div>
              <h1 className={styles.title}>{t(cert.name)}</h1>
              <p className={styles.description}>{t(cert.description)}</p>
              {isLive ? (
                <a href={resolveHref("/access")} className={styles.ctaPrimary}>{t("Join the Waitlist →")}</a>
              ) : (
                <a href={resolveHref("/access")} className={styles.ctaSecondary}>{t("Notify me when this opens →")}</a>
              )}
            </div>
            <div className={styles.headerRight}>
              <div className={styles.specCard}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t("Format")}</span>
                  <span className={styles.specValue}>{t(cert.format)}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t("Duration")}</span>
                  <span className={styles.specValue}>{t(cert.duration)}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t("For")}</span>
                  <span className={styles.specValue}>{t(cert.audience)}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ── Overview ────────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>{t("Overview")}</p>
            <p className={styles.overviewText}>{t(cert.overview)}</p>
          </section>

          {/* ── Framework ───────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>{t("Built on")}</p>
            <p className={styles.frameworkName}>{t("Robot Experience Design (RXD)")}</p>
            <p className={styles.frameworkText}>{t("Every module, deliverable, and capstone in the REP programme maps directly to the six dimensions of the RXD framework — the original research framework developed by The Robot Age for evaluating how humans experience robots in real environments.")}</p>
            <div className={styles.pills}>
              {['Signal Clarity', 'Spatial Legibility', 'Perceived Presence', 'Failure Transparency', 'Interaction Fit', 'Recovery Design'].map((dim) => (
                <span key={dim} className={styles.pill}>{t(dim)}</span>
              ))}
            </div>
            <a href={resolveHref("/rxd")} className={styles.frameworkLink}>{t("Read the RXD White Paper →")}</a>
          </section>

          {/* ── Founding Cohort ─────────────────────────────────────────────── */}
          {cert.slug === 'rep' && (
            <FoundingCohort />
          )}

          {/* ── Curriculum ──────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>{t("Curriculum")}</p>
            <div className={styles.moduleList}>
              {cert.modules.map((mod) => (
                <div key={mod.number} className={styles.moduleRow}>
                  <span className={styles.moduleNumber}>{t(mod.number)}</span>
                  <div className={styles.moduleContent}>
                    <div className={styles.moduleTitleRow}>
                      <h3 className={styles.moduleTitle}>{t(mod.title)}</h3>
                      <span className={`${styles.moduleStatus} ${mod.status === 'Live' ? styles.statusLive : styles.statusSoon}`}>
                        {t(mod.status ?? '')}
                      </span>
                    </div>
                    <p className={styles.moduleDescription}>{t(mod.description)}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href={resolveHref(`/learn/${credential}/curriculum`)} className={styles.curriculumLink}>{t("See full week-by-week curriculum →")}</a>
          </section>

          {/* ── Outcomes ────────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>{t("What you'll be able to do")}</p>
            <ul className={styles.outcomeList}>
              {cert.outcomes.map((outcome, i) => (
                <li key={i} className={styles.outcomeItem}>
                  <span className={styles.outcomeTick}>—</span>
                  {t(outcome)}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Back ────────────────────────────────────────────────────────── */}
          <div className={styles.back}>
            <Link href={resolveHref("/learn")} className={styles.backLink}>{t("← Back to Curriculum")}</Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

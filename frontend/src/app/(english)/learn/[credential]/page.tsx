import { pageMetadata } from '@/lib/i18n/page-metadata'
import { contentHref } from '@/lib/i18n/localize'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getCertificationBySlug, getAllCertificationSlugs, legacyCredentialSlugs, isLegacyCredential } from '@/lib/certifications'
import styles from './CredentialPage.module.css'

export async function generateStaticParams() {
  return [...getAllCertificationSlugs(), ...legacyCredentialSlugs].map((credential) => ({ credential }))
}

export async function generateMetadata({ params }: { params: Promise<{ credential: string; locale?: Locale }> }) {
  const { credential, locale = 'en' } = await params
  const cert = getCertificationBySlug(credential)
  if (isLegacyCredential(credential)) return { title: uiText('Program catalog updated', locale), robots: { index: false, follow: true } }
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
  if (isLegacyCredential(credential)) return <>
    <Nav pinned />
    <main className={styles.page}><div className="container-fluid">
      <h1 className={styles.title}>{t('Program catalog updated')}</h1>
      <p className={styles.description}>{t('This credential is no longer part of our current public program catalog. Explore RPDP and RDP at The Robot Age Academy, or start with Robot Literacy and Live Robot Lab.')}</p>
      <Link className={styles.ctaPrimary} href={resolveHref('/learn#programs')}>{t('Compare Professional Programs')} →</Link>
      <p className={styles.overviewText}>{t('Existing learners can sign in to access their learning records. This catalog update does not rename previously issued credentials.')}</p>
      <a className={styles.backLink} href="https://learn.therobotage.com/signin">{t('Learner sign in')} →</a>
    </div></main><Footer />
  </>
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
              <Link href={resolveHref(`/learn#${credential === 'rpdp' ? 'founding-cohort-list' : 'rdp-updates'}`)} className={styles.ctaPrimary}>
                {t(credential === 'rpdp' ? 'Join the RPDP Founding Cohort List' : 'Get RDP Launch Updates')} →
              </Link>
              <p className={styles.frameworkText}>{t('Joining the list does not reserve a seat.')}</p>
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
            <p className={styles.frameworkText}>{t("Explore the Robot Experience Design framework for evaluating how people experience robots in real environments.")}</p>
            <div className={styles.pills}>
              {['Signal Clarity', 'Spatial Legibility', 'Perceived Presence', 'Failure Transparency', 'Interaction Fit', 'Recovery Design'].map((dim) => (
                <span key={dim} className={styles.pill}>{t(dim)}</span>
              ))}
            </div>
            <a href={resolveHref("/rxd")} className={styles.frameworkLink}>{t("Explore the RXD Framework →")}</a>
          </section>

          {/* ── Curriculum ──────────────────────────────────────────────────── */}
          <section id="curriculum" className={styles.section}>
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
                    {mod.description && <p className={styles.moduleDescription}>{t(mod.description)}</p>}
                  </div>
                </div>
              ))}
            </div>
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
          <p className={styles.frameworkText}>{t('Credentials recognize completion of educational requirements. They are not government licenses, regulated safety certifications, or authorization to operate robots.')}</p>
          <div className={styles.back}>
            <Link href={resolveHref("/learn")} className={styles.backLink}>{t("← Back to Academy")}</Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

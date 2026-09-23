import { uiText } from '@/lib/i18n/messages'
import { localize, contentHref } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getFieldSignalBySlug, getAllFieldSignalSlugs } from '@/lib/fieldSignals'
import styles from './FieldSignalPage.module.css'
import { translationAlternates } from '@/lib/i18n/content'

export async function generateStaticParams() {
  return getAllFieldSignalSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale?: Locale }> }) {
  const { slug, locale = 'en' } = await params
  const essay = localize(getFieldSignalBySlug(slug), `/research/field-signals/${slug}`, locale)
  if (!essay) return {}
  return {
    title: `${essay.headline} — The Robot Age`,
    description: essay.body[0],
    alternates: { canonical: `/research/field-signals/${slug}`, languages: translationAlternates(`/research/field-signals/${slug}`) },
    openGraph: {
      title: essay.headline,
      description: essay.body[0],
      type: 'article',
      images: [{ url: '/images/hand.png', alt: 'The Robot Age' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: essay.headline,
      description: essay.body[0],
      images: ['/images/hand.png'],
    },
  }
}

export default async function FieldSignalPage({ params }: { params: Promise<{ slug: string; locale?: Locale }> }) {
  const { slug, locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const essay = localize(getFieldSignalBySlug(slug), `/research/field-signals/${slug}`, locale)
  if (!essay) notFound()

  return (
    <>
      <Nav pinned />

      <article className={styles.article}>
        <div className="container-fluid">

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.essayNum}>{essay.essayNumber}</span>
              <span className={styles.date}>{essay.date}</span>
            </div>
            <h1 className={styles.headline}>{essay.headline}</h1>
          </header>

          {/* Content + sidebar */}
          <div className={styles.contentRow}>
            <div className={styles.body}>
              {essay.body.map((paragraph, i) => (
                <p key={i} className={styles.paragraph}>{paragraph}</p>
              ))}
            </div>

            <aside className={styles.sidebar}>
              <p className={styles.refDimTag}>{t("RXD Dimension")}</p>
              <p className={styles.refDimLabel}>{essay.refDimension}</p>
              <p className={styles.sideNote}>{t("This essay is part of the Field Signals series examining the six RXD dimensions in deployment contexts.")}</p>
            </aside>
          </div>

          {/* Back link */}
          <div className={styles.back}>
            <Link href={contentHref("/research", locale)} className={styles.backLink}>{t("← Back to Research")}</Link>
          </div>

        </div>
      </article>

      <Footer />
    </>
  )
}

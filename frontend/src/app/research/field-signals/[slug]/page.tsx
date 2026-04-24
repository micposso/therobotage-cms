import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getFieldSignalBySlug, getAllFieldSignalSlugs } from '@/lib/fieldSignals'
import styles from './FieldSignalPage.module.css'

export async function generateStaticParams() {
  return getAllFieldSignalSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const essay = getFieldSignalBySlug(slug)
  if (!essay) return {}
  return {
    title: `${essay.headline} — The Robot Age`,
    description: essay.body[0],
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

export default async function FieldSignalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const essay = getFieldSignalBySlug(slug)
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
              <p className={styles.refDimTag}>REF Dimension</p>
              <p className={styles.refDimLabel}>{essay.refDimension}</p>
              <p className={styles.sideNote}>
                This essay is part of the Field Signals series examining the five REF dimensions in deployment contexts.
              </p>
            </aside>
          </div>

          {/* Back link */}
          <div className={styles.back}>
            <a href="/research" className={styles.backLink}>
              ← Back to Research
            </a>
          </div>

        </div>
      </article>

      <Footer />
    </>
  )
}

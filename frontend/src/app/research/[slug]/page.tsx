import { notFound } from 'next/navigation'
import Image from 'next/image'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getArticleBySlug, getAllSlugs } from '@/lib/articles'
import styles from './ArticlePage.module.css'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.headline} — The Robot Age`,
    description: article.body[0],
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <>
      <Nav pinned />

      <article className={styles.article}>
        <div className="container-fluid">

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.category}>{article.category}</span>
              <span className={styles.date}>{article.date}</span>
            </div>
            <h1 className={styles.headline}>{article.headline}</h1>
          </header>

          {/* Content + image */}
          <div className={styles.contentRow}>
            <div className={styles.body}>
              {article.body.map((paragraph, i) => (
                <p key={i} className={styles.paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.imageWrap}>
              <Image
                src={article.image}
                alt={article.headline}
                fill
                priority
                sizes="(max-width: 767px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
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

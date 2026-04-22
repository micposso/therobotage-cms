import Image from 'next/image'
import Link from 'next/link'
import type { NewsArticle as NewsArticleType } from '@/lib/news'
import styles from './NewsArticle.module.css'

interface Props {
  article: NewsArticleType
}

export default function NewsArticle({ article }: Props) {
  return (
    <article className={styles.article}>

      {/* ── Header image with overlay ─────────────────────────────────────── */}
      <div className={styles.hero}>
        {article.headerImage && (
          <Image
            src={article.headerImage}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroCategoryRow}>
            <span className={styles.heroCategory}>{article.category}</span>
            <span className={styles.heroDate}>{article.date}</span>
            {article.author && (
              <span className={styles.heroAuthor}>{article.author}</span>
            )}
          </div>
          <h1 className={styles.heroHeadline}>{article.title}</h1>
        </div>
      </div>

      <div className="container-fluid">

        {/* ── Excerpt ─────────────────────────────────────────────────────── */}
        {article.excerpt && (
          <p className={styles.excerpt}>{article.excerpt}</p>
        )}

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div
          className={styles.markdown}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* ── Back link ───────────────────────────────────────────────────── */}
        <div className={styles.back}>
          <Link href="/" className={styles.backLink}>
            ← Back to News
          </Link>
        </div>

      </div>
    </article>
  )
}

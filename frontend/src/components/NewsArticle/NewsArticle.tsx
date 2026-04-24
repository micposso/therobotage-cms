import Link from 'next/link'
import type { NewsArticle as NewsArticleType } from '@/lib/news'
import ShareButton from './ShareButton'
import WaitlistModal from './WaitlistModal'
import styles from './NewsArticle.module.css'

interface Props {
  article: NewsArticleType
}

export default function NewsArticle({ article }: Props) {
  return (
    <article className={styles.article}>

      {/* ── Header image with overlay ─────────────────────────────────────── */}
      <div
        className={styles.hero}
        style={article.headerImage ? { backgroundImage: `url(${article.headerImage})` } : undefined}
      >
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
        <div className={styles.layout}>

          {/* ── Body ──────────────────────────────────────────────────────── */}
          <div className={styles.content}>
            <div
              className={styles.markdown}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <div className={styles.back}>
              <Link href="/" className={styles.backLink}>
                ← Back to News
              </Link>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className={styles.sidebar}>
            <p className={styles.sidebarLabel}>Related</p>
            <nav className={styles.sidebarNav}>
              <Link href="/learn" className={styles.sidebarLink}>Get the REP credential</Link>
              <Link href="/robotics-literacy" className={styles.sidebarLink}>What is robotic literacy?</Link>
              <Link href="/summit" className={styles.sidebarLink}>Join the Summit</Link>
              <ShareButton />
            </nav>
            <p className={styles.sidebarBlurb}>
              The REP credential is built for the people who shape how robots land — not the engineers who build them.
            </p>
            <WaitlistModal />
          </aside>

        </div>
      </div>
    </article>
  )
}

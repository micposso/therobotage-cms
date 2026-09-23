import { uiText } from '@/lib/i18n/messages'
import Link from 'next/link'
import type { NewsArticle as NewsArticleType } from '@/lib/news'
import ShareButton from './ShareButton'
import WaitlistModal from './WaitlistModal'
import styles from './NewsArticle.module.css'
import type { Locale } from '@/lib/i18n/routing'

interface Props {
  article: NewsArticleType
  locale?: Locale
  originalHref?: string
}

export default function NewsArticle({ article, locale = 'en', originalHref }: Props) {
  const t = (text: string) => uiText(text, locale)
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
            {locale === 'es' && <p className={styles.translationNote}>{t("Traducido del inglés con IA. ")}<a href={`${originalHref}?lang=en`}>{t("Leer el original en inglés")}</a>.</p>}
            {article.audioUrl && (
              <section className={styles.audioPlayer} aria-label={t("Article narration")}>
                <p className={styles.audioLabel}>{t("Listen to this article")}</p>
                <audio controls preload="metadata" src={article.audioUrl} aria-label={`Listen to ${article.title}`}>{t("Your browser does not support audio playback.")}</audio>
                <p className={styles.audioDisclosure}>{t("AI-generated narration")}</p>
              </section>
            )}
            <div
              className={styles.markdown}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <div className={styles.back}>
              <Link href={locale === 'es' ? '/es' : '/'} className={styles.backLink}>
                {locale === 'es' ? '← Volver a las noticias' : '← Back to News'}
              </Link>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className={styles.sidebar}>
            <p className={styles.sidebarLabel}>{t("Related")}</p>
            <nav className={styles.sidebarNav}>
              <Link href="/learn" className={styles.sidebarLink}>{t("Get the REP credential")}</Link>
              <Link href="/robot-literacy" className={styles.sidebarLink}>{t("What is robot literacy?")}</Link>
              <Link href="/summit" className={styles.sidebarLink}>{t("Join the Summit")}</Link>
              <ShareButton />
            </nav>
            <p className={styles.sidebarBlurb}>{t("The REP credential is built for the people who shape how robots land — not the engineers who build them.")}</p>
            <WaitlistModal />
          </aside>

        </div>
      </div>
    </article>
  )
}

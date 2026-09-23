import { uiText } from '@/lib/i18n/messages'
import { localize, contentHref } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import { getAllNewsArticles } from '@/lib/news'
import styles from './LatestNewsSection.module.css'

export default function LatestNewsSection({ locale = 'en' }: { locale?: Locale }) {
  const t = (text: string) => uiText(text, locale)
  const articles = getAllNewsArticles().slice(0, 3).map(a => localize(a, `/news/${a.slug}`, locale))
  if (articles.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container-fluid">

        <div className={`row ${styles.headerRow}`}>
          <div className="col-12">
            <p className={styles.eyebrow}>{t("Latest")}</p>
            <h2 className={styles.headline}>{t("News")}</h2>
          </div>
        </div>

        <div className="row g-4">
          {articles.map((article) => (
            <div key={article.slug} className="col-md-4">
              <ArticleCard
                article={{
                  slug: article.slug,
                  category: article.category,
                  date: article.date,
                  headline: article.title,
                  image: article.thumbnailImage,
                }}
                href={contentHref(`/news/${article.slug}`, locale)}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

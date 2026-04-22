import ArticleCard from '@/components/ArticleCard/ArticleCard'
import { getAllNewsArticles } from '@/lib/news'
import styles from './LatestNewsSection.module.css'

export default function LatestNewsSection() {
  const articles = getAllNewsArticles().slice(0, 3)
  if (articles.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container-fluid">

        <div className={`row ${styles.headerRow}`}>
          <div className="col-12">
            <p className={styles.eyebrow}>Latest</p>
            <h2 className={styles.headline}>News</h2>
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
                href={`/news/${article.slug}`}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

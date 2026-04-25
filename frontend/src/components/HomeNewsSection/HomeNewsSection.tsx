'use client'

import { motion } from 'framer-motion'
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import styles from './HomeNewsSection.module.css'

interface Article {
  slug: string
  category: string
  date: string
  headline: string
  image: string
  href: string
}

interface Props {
  articles: Article[]
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function HomeNewsSection({ articles }: Props) {
  const items = articles.slice(0, 3)

  return (
    <section className={styles.section}>
      <div className="container-fluid">

        <div className={styles.headerRow}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Latest
          </motion.p>
          <h2 className={styles.headline}>News &amp; Research</h2>
        </div>

        <motion.div
          className={styles.newsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {items.map((article) => (
            <ArticleCard key={article.slug} article={article} href={article.href} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}

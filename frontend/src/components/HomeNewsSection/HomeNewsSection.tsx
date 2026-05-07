'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [expanded, setExpanded] = useState(false)

  const initial = articles.slice(0, 3)
  const extra   = articles.slice(3)

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
          {initial.map((article) => (
            <ArticleCard key={article.slug} article={article} href={article.href} />
          ))}
        </motion.div>

        <AnimatePresence>
          {expanded && extra.length > 0 && (
            <motion.div
              className={styles.extraGrid}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {extra.map((article) => (
                <ArticleCard key={article.slug} article={article} href={article.href} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {extra.length > 0 && (
          <div className={styles.viewAllRow}>
            <button
              className={styles.viewAllBtn}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Show less' : 'See all news'}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

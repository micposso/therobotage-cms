'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import styles from './ArticleGrid.module.css'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

/**
 * @param {{ articles?: Array<{slug: string, category: string, date: string, headline: string, image: string, href?: string}> }} props
 */
export default function ArticleGrid({ articles = [] }) {
  const [expanded, setExpanded] = useState(false)

  const initial = articles.slice(0, 3)
  const extra   = articles.slice(3)

  return (
    <section className={styles.section}>
      <div className="container-fluid">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className={`row ${styles.headerRow}`}>
          <div className="col-12">
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Latest
            </motion.p>
            <motion.h2
              className={styles.headline}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              News &amp; Research
            </motion.h2>
          </div>
        </div>

        {/* ── First row ───────────────────────────────────────────────────── */}
        <motion.div
          className="row g-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {initial.map((article) => (
            <div key={article.slug} className="col-md-4">
              <ArticleCard article={article} href={article.href} />
            </div>
          ))}
        </motion.div>

        {/* ── Expanded row ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {expanded && extra.length > 0 && (
            <motion.div
              className={`row g-4 ${styles.extraRow}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {extra.map((article) => (
                <div key={article.slug} className="col-md-4">
                  <ArticleCard article={article} href={article.href} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── View all button ─────────────────────────────────────────────── */}
        {extra.length > 0 && (
          <div className={styles.viewAllRow}>
            <button
              className={styles.viewAllBtn}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Show Less' : 'View All News'}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import type { RobotMeta } from '@/lib/robots'
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
  robot?: RobotMeta
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function HomeNewsSection({ articles, robot }: Props) {
  const [expanded, setExpanded] = useState(false)
  const initial = articles.slice(0, 4)
  const extra   = articles.slice(4)

  return (
    <section className={styles.section}>
      <div className="container-fluid">

        {/* ── Section header ──────────────────────────────────────────────── */}
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
        </div>

        {/* ── Split layout ────────────────────────────────────────────────── */}
        <div className={styles.split}>

          {/* Left: News */}
          <div className={styles.newsCol}>
            <h2 className={styles.colHeadline}>News &amp; Research</h2>
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
                  className={styles.newsGrid}
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
                <button className={styles.viewAllBtn} onClick={() => setExpanded((v) => !v)}>
                  {expanded ? 'Show Less' : 'View All News'}
                </button>
              </div>
            )}
          </div>

          {/* Right: Robot of the Week */}
          <div className={styles.robotCol}>
            <h2 className={styles.colHeadline}>Robot of the Week</h2>
            {robot ? (
              <Link href={`/robots/${robot.slug}`} className={styles.robotCard}>
                {robot.thumbnailImage && (
                  <div className={styles.robotImage}>
                    <Image
                      src={robot.thumbnailImage}
                      alt={robot.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className={styles.robotBody}>
                  <p className={styles.robotMeta}>{robot.manufacturer} · {robot.date}</p>
                  <h3 className={styles.robotTitle}>{robot.title}</h3>
                  <p className={styles.robotExcerpt}>{robot.excerpt}</p>
                  <span className={styles.robotCta}>See full profile →</span>
                </div>
              </Link>
            ) : (
              <p className={styles.robotEmpty}>Coming soon.</p>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

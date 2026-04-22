'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './ArticleCard.module.css'

const cardVariants = {
  hidden:  { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function ArticleCard({ article, href }) {
  const cardHref = href ?? `/research/${article.slug}`
  return (
    <Link href={cardHref} className={styles.cardLink}>
      <motion.article className={styles.card} variants={cardVariants}>
        {article.image && (
        <div className={styles.thumbnail}>
          <Image
            src={article.image}
            alt={article.headline}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        )}
        <div className={styles.meta}>
          <span className={styles.category}>{article.category}</span>
          {article.date && <span className={styles.date}>{article.date}</span>}
        </div>
        <h3 className={styles.headline}>{article.headline}</h3>
      </motion.article>
    </Link>
  )
}

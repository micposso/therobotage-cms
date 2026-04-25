'use client'

import { motion } from 'framer-motion'
import styles from './PageHero.module.css'

interface PageHeroProps {
  eyebrow: string
  title: string
  subtitle: string
  imageSrc?: string
}

export default function PageHero({ eyebrow, title, subtitle, imageSrc = '' }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 className={styles.title}>
              {title}
              <span className={styles.colorSquare} aria-hidden="true" />
            </h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div
              className={styles.imageWrap}
              style={{ backgroundImage: imageSrc ? `url(${imageSrc})` : undefined }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

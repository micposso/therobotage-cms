'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './PageHero.module.css'

interface PageHeroProps {
  eyebrow: string
  title: string
  subtitle: string
  imageSrc?: string
  images?: string[]
  roundImage?: boolean
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  imageSrc = '',
  images,
  roundImage = false,
}: PageHeroProps) {
  const slides = images && images.length > 0 ? images : imageSrc ? [imageSrc] : []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500)
    return () => clearInterval(id)
  }, [slides.length])

  const currentSrc = slides[index]

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
            <div className={`${styles.imageWrap}${roundImage ? ` ${styles.imageWrapRound}` : ''}`}>
              {currentSrc && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSrc}
                    className={styles.imageSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={currentSrc}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, 456px"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

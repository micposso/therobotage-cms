'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import styles from './PageHero.module.css'

const DEFAULT_IMAGES = ['/images/robot.png', '/images/human.png', '/images/hand.png']

interface PageHeroProps {
  eyebrow: string
  title: string
  subtitle: string
  imageSrc?: string
  images?: string[]
  roundImage?: boolean
  children?: ReactNode
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  images,
  roundImage = false,
  children,
}: PageHeroProps) {
  const suppliedImages = [...new Set((images?.length ? images : [imageSrc]).filter(
    (src): src is string => Boolean(src) && src !== '/images/placeholder.jpg',
  ))]
  const slides = suppliedImages.length > 1
    ? suppliedImages
    : [...new Set([...suppliedImages, ...DEFAULT_IMAGES])]
  const [index, setIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const currentSrc = slides[index % slides.length]

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500)
    return () => clearInterval(timer)
  }, [reducedMotion, slides.length])

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
            {children}
          </div>
          <div className={styles.imageCol}>
            <div className={`${styles.imageWrap}${roundImage ? ` ${styles.imageWrapRound}` : ''}`}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentSrc}
                  className={styles.imageSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.8 }}
                >
                  <Image
                    src={currentSrc}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 90vw, 456px"
                    className={styles.image}
                    loading="eager"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

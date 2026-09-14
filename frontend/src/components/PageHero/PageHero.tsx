'use client'

import type { ReactNode } from 'react'
import styles from './PageHero.module.css'

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
  children,
}: PageHeroProps) {
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
        </div>
      </div>
    </section>
  )
}

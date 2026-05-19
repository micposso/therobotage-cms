'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from './RobotImageGallery.module.css'

export interface GalleryItem {
  src: string
  alt: string
  caption: string
}

interface Props {
  items: GalleryItem[]
}

export default function RobotImageGallery({ items }: Props) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])

  const prev = useCallback(() => {
    setActive((i) => (i === null ? null : (i - 1 + items.length) % items.length))
  }, [items.length])

  const next = useCallback(() => {
    setActive((i) => (i === null ? null : (i + 1) % items.length))
  }, [items.length])

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active, close, prev, next])

  return (
    <>
      {/* ── Thumbnails ── */}
      <div className={styles.grid}>
        {items.map((item, i) => (
          <button
            key={i}
            className={styles.thumb}
            onClick={() => setActive(i)}
            aria-label={`Expand image: ${item.alt}`}
          >
            <div className={styles.thumbImage}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
              <span className={styles.thumbOverlay} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M8 3H3v5M12 3h5v5M8 17H3v-5M12 17h5v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <p className={styles.thumbCaption}>{item.caption}</p>
          </button>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {active !== null && (
        <div
          className={styles.backdrop}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={items[active].alt}
        >
          <div className={styles.lightbox} onClick={(e) => e.stopPropagation()}>

            <button className={styles.closeBtn} onClick={close} aria-label="Close">
              &#215;
            </button>

            {items.length > 1 && (
              <>
                <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Previous image">
                  &#8592;
                </button>
                <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Next image">
                  &#8594;
                </button>
              </>
            )}

            <div className={styles.lightboxImage}>
              <Image
                src={items[active].src}
                alt={items[active].alt}
                fill
                sizes="(max-width: 767px) 100vw, 80vw"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            <div className={styles.lightboxFooter}>
              <p className={styles.lightboxCaption}>{items[active].caption}</p>
              <span className={styles.lightboxCounter}>{active + 1} / {items.length}</span>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

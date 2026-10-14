'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './learn.module.css'

export default function LearnMain({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const frames = Array.from(mainRef.current?.querySelectorAll<HTMLElement>('[data-parallax]') ?? [])
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let request = 0

    const update = () => {
      request = 0
      const measurements = frames.map(frame => ({ frame, bounds: frame.getBoundingClientRect() }))
      for (const { frame, bounds } of measurements) {
        if (preference.matches) {
          frame.style.removeProperty('--image-parallax')
          continue
        }
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) continue
        const progress = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) / ((window.innerHeight + bounds.height) / 2)
        const travel = Math.min(12, bounds.height * 0.025)
        frame.style.setProperty('--image-parallax', `${Math.max(-1, Math.min(1, progress)) * travel}px`)
      }
    }
    const schedule = () => {
      if (!request) request = window.requestAnimationFrame(update)
    }
    const resize = new ResizeObserver(schedule)
    frames.forEach(frame => resize.observe(frame))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    preference.addEventListener('change', schedule)
    schedule()

    return () => {
      window.cancelAnimationFrame(request)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      preference.removeEventListener('change', schedule)
      resize.disconnect()
    }
  }, [])

  return <main ref={mainRef} className={styles.page}>{children}</main>
}

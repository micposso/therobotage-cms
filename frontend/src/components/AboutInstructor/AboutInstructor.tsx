'use client'
import { useCopy } from '@/lib/i18n/useCopy'

import { useRef } from 'react'
import Image from '@/components/MediaImage'
import { motion, useInView } from 'framer-motion'
import styles from './AboutInstructor.module.css'

export default function AboutInstructor() {
  const { t } = useCopy()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className="container-fluid">
        <div className={styles.inner}>

          <motion.div
            className={styles.content}
            initial={{ y: 30, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.eyebrow}>{t("About the Instructor")}</p>
            <h2 className={styles.name}>{t("Developed by Michael Posso")}</h2>
            <p className={styles.titles}>{t("Founder, The Robot Age · Product & Technology Leader · Adjunct Professor")}</p>
            {[
              "Michael Posso is a technology leader, designer, and educator with more than 15 years of experience in digital products, UX engineering, and enterprise technology.",
              "He teaches undergraduate and graduate courses at the Fashion Institute of Technology and New York Institute of Technology and is pursuing a master's degree in Information Design and Technology at SUNY Polytechnic Institute.",
              "Through The Robot Age, he explores how design, technology, and education can help people understand, interact with, and work alongside robots.",
              "His work brings together product design, human-robot interaction, practical robotics experimentation, and professional education.",
            ].map((paragraph) => <p key={paragraph} className={styles.bio}>{t(paragraph)}</p>)}
          </motion.div>

          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: 80 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className={styles.imageWrap}>
              <Image src="/brand/instructor.png" alt={t("Michael Posso")} fill sizes="(max-width: 424px) calc(100vw - 64px), 360px" className={styles.image} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

'use client'
import { useCopy } from '@/lib/i18n/useCopy'


import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './RobotArchive.module.css'

export default function RobotArchive() {
  const { t } = useCopy()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className="container-fluid">
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >{t("The Robot Experience Report")}</motion.p>
        <motion.h2
          className={styles.headline}
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >{t("Field studies coming soon: Scored. Observed. Documented.")}</motion.h2>
      </div>
    </section>
  )
}

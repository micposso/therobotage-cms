'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './AboutInstructor.module.css'

export default function AboutInstructor() {
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
            <p className={styles.eyebrow}>About the Creator</p>
            <h2 className={styles.name}>Michael Posso</h2>
            <p className={styles.titles}>
              Adjunct Professor, FIT &amp; NYI &nbsp;·&nbsp; M.S. Information Design &amp; Technology, SUNY Poly
            </p>
            <p className={styles.bio}>
              The Robot Age was created by Michael Posso — a product designer and educator focused on the intersection of human experience and robotics. Michael holds a Master's degree in Information Design and Technology from SUNY Polytechnic Institute, and teaches as an adjunct professor at the Fashion Institute of Technology and the New York Institute of Technology. With over 10 years of experience teaching at the high school, undergraduate, and graduate levels — across courses in UX, web design, and JavaScript — his work centers on product design and robotics experiences: how people interact with automated systems, and how to design those systems in ways that are clear, trustworthy, and effective. The Robot Age is the curriculum he wished existed.
            </p>
          </motion.div>

          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: 80 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className={styles.imageWrap}>
              <img src="/images/instructor.png" alt="Michael Posso" className={styles.image} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

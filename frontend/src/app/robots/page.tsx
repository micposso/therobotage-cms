import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Certification from '@/components/Certification/Certification'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { getAllRobots } from '@/lib/robots'
import styles from './page.module.css'

export const metadata = {
  title: 'Robot of the Week — The Robot Age',
  description: 'One robot, every week. Field analysis of how each robot performs in real deployment — what it gets right, and where the experience breaks down.',
  openGraph: {
    title: 'Robot of the Week — The Robot Age',
    description: 'One robot, every week. Field analysis of how each robot performs in real deployment — what it gets right, and where the experience breaks down.',
    images: [{ url: '/images/robot.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/robot.png'],
  },
}

export default function RobotsPage() {
  const robots = getAllRobots()

  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Robot of the Week"
        title="The machines worth watching."
        subtitle="One robot, every week. Not a product roundup — a field analysis of how each robot performs in real deployment, what it gets right, and where the experience breaks down."
      />

      <section className={styles.section}>
        <div className="container-fluid">
          {robots.length === 0 ? (
            <p className={styles.empty}>The first robot profile is coming soon.</p>
          ) : (
            <div className={styles.grid}>
              {robots.map((robot) => (
                <Link key={robot.slug} href={`/robots/${robot.slug}`} className={styles.card}>
                  {robot.thumbnailImage && (
                    <div className={styles.image}>
                      <Image
                        src={robot.thumbnailImage}
                        alt={robot.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className={styles.body}>
                    <div className={styles.meta}>
                      <span className={styles.category}>Robot of the Week</span>
                      <span className={styles.date}>{robot.date}</span>
                    </div>
                    <h2 className={styles.title}>{robot.title}</h2>
                    {robot.manufacturer && (
                      <p className={styles.manufacturer}>{robot.manufacturer}</p>
                    )}
                    <p className={styles.excerpt}>{robot.excerpt}</p>
                    <span className={styles.cta}>Read the profile →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Certification />
      <Footer />
    </>
  )
}

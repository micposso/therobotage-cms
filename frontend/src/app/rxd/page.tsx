import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import RxdDimensionsGrid from './RxdDimensionsGrid'
import styles from './page.module.css'

const ROBOT_PLACEHOLDERS = [
  { id: 1, slug: 'robot-profile-01', title: 'Robot Name One',   image: '/images/hand.png' },
  { id: 2, slug: 'robot-profile-02', title: 'Robot Name Two',   image: '/images/hand.png' },
  { id: 3, slug: 'robot-profile-03', title: 'Robot Name Three', image: '/images/hand.png' },
]

export const metadata = {
  title: 'RXD — Robot Experience Design | The Robot Age',
  description:
    'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
  openGraph: {
    title: 'RXD — Robot Experience Design | The Robot Age',
    description:
      'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
    images: [{ url: '/images/hand.png', alt: 'Robot Experience Design' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RXD — Robot Experience Design | The Robot Age',
    description:
      'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
    images: ['/images/hand.png'],
  },
}

export default function RxdPage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Robot Experience Design"
        title="Robots are entering homes, classrooms, and workplaces."
        subtitle="A six-dimension model for evaluating robot interactions the way users actually experience them — built for practitioners, not engineers."
        imageSrc="/images/hand.png"
      />

      {/* Early download CTA */}
      <section className={styles.earlyCtaSection}>
        <div className="container-fluid">
          <div className={styles.earlyCtaInner}>
            <a
              href="/pdf/rxd-therobotage-v2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.earlyCtaButton}
            >
              Download the White Paper (v2.0) &rarr;
            </a>
            <span className={styles.earlyCtaMeta}>PDF · Free · CC BY-NC 4.0</span>
          </div>
        </div>
      </section>

      {/* Six dimensions */}
      <section className={styles.dimensionsSection}>
        <div className="container-fluid">
          <h2 className={styles.sectionHeadline}>The six dimensions of<br />Robot Experience Design</h2>
          <RxdDimensionsGrid />
        </div>
      </section>

      {/* Robot grid */}
      <section className={styles.robotGridSection}>
        <div className="container-fluid">
          <div className={styles.robotGrid}>
            {ROBOT_PLACEHOLDERS.map((robot) => (
              <Link key={robot.id} href={`/robots/${robot.slug}`} className={styles.robotCardLink}>
                <div className={styles.robotCard}>
                  <div className={styles.robotCardThumb}>
                    <Image
                      src={robot.image}
                      alt={robot.title}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className={styles.robotCardTitle}>{robot.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for + About (merged) */}
      <section className={styles.practitionersSection}>
        <div className="container-fluid">
          <p className={styles.eyebrow}>Who this is for</p>
          <div className={styles.textBlock}>
            <h2 className={styles.sectionHeadline}>
              Built for practitioners, not engineers.
            </h2>
            <ul className={styles.audienceList}>
              <li>UX designers</li>
              <li>Product managers</li>
              <li>Human factors researchers</li>
              <li>Educators</li>
            </ul>
            <p className={styles.sectionBody}>
              Developed by Mike Posso through The Robot Age, a research and
              education platform preparing non-engineering professionals for
              consumer robotics. The framework draws on active graduate research
              at SUNY Polytechnic Institute and professional experience in
              product engineering leadership.
            </p>
          </div>
        </div>
      </section>

      {/* Download CTA — dark section */}
      <section className={styles.downloadSection}>
        <div className="container-fluid">
          <div className={styles.downloadInner}>
            <p className={styles.eyebrowDark}>Download</p>
            <h2 className={styles.downloadHeadline}>Take the framework with you.</h2>
            <p className={styles.downloadSubheadline}>The white paper includes:</p>
            <ul className={styles.downloadList}>
              <li>Evaluation criteria and scoring rubrics for all six dimensions</li>
              <li>A structured worksheet for assessing any robot product or deployment</li>
              <li>Methodology, research background, and application guidance</li>
            </ul>
            <div className={styles.downloadCta}>
              <a
                href="/pdf/rxd-therobotage-v2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadButton}
              >
                Download the RXD White Paper (v2.0) &rarr;
              </a>
              <p className={styles.downloadSubtext}>
                PDF, free to download. Licensed CC BY-NC 4.0.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import HrefDimensionsGrid from './HrefDimensionsGrid'
import styles from './page.module.css'

export const metadata = {
  title: 'HREF — Human-Robot Experience Framework | The Robot Age',
  description:
    'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
  openGraph: {
    title: 'HREF — Human-Robot Experience Framework | The Robot Age',
    description:
      'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
    images: [{ url: '/images/hand.png', alt: 'Human-Robot Experience Framework' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HREF — Human-Robot Experience Framework | The Robot Age',
    description:
      'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
    images: ['/images/hand.png'],
  },
}

export default function HrefPage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Human-Robot Experience Framework"
        title="Robots are entering homes, classrooms, and workplaces."
        subtitle="A six-dimension model for evaluating robot interactions the way users actually experience them — built for practitioners, not engineers."
        imageSrc="/images/hand.png"
      />

      {/* Early download CTA */}
      <section className={styles.earlyCtaSection}>
        <div className="container-fluid">
          <div className={styles.earlyCtaInner}>
            <a
              href="/pdf/href-therobotage-v2.pdf"
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
          <h2 className={styles.sectionHeadline}>The six dimensions of<br />the human robot experience framework</h2>
          <HrefDimensionsGrid />
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
                href="/pdf/href-therobotage-v2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadButton}
              >
                Download the HREF White Paper (v2.0) &rarr;
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

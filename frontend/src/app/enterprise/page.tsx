import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import EnterpriseForm from './EnterpriseForm'
import styles from './enterprise.module.css'

export const metadata = {
  title: 'Enterprise — The Robot Age',
  description:
    'Deployment readiness education for organizations integrating robots into non-engineering operations.',
  openGraph: {
    title: 'Enterprise — The Robot Age',
    description: 'Deployment readiness education for organizations integrating robots into non-engineering operations.',
    images: [{ url: '/images/robot.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/robot.png'],
  },
}

const WHY_CARDS = [
  {
    title: 'Robots are arriving faster than the training',
    body: 'Most deployment failures trace back to the humans around the robot, not the robot itself. Operational teams need a shared language before the machine arrives on the floor.',
  },
  {
    title: 'Non-engineering staff carry the risk',
    body: 'Logistics, facilities, HR, and operations own the environments where robots operate. Without structured literacy, they make decisions in the dark.',
  },
  {
    title: 'Readiness is a process, not a checklist',
    body: 'Our framework gives organizations a repeatable way to assess, train, and verify deployment readiness — before and after go-live.',
  },
]

const WALKAWAY_ITEMS = [
  'A clear map of which roles need what level of robotic literacy — and why.',
  'Practical frameworks for assessing and closing knowledge gaps on your team.',
  'Language for communicating robot capabilities and limits to non-technical stakeholders.',
  'A deployment readiness baseline your organization can revisit as the fleet grows.',
  'Access to certification tracks aligned to your operational context.',
]

export default function EnterprisePage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Enterprise"
        title="Deployment readiness starts with people."
        subtitle="Structured robotic literacy for operations, logistics, and facilities teams — built for organizations integrating robots into non-engineering environments."
        imageSrc="/images/robot.png"
      />

      {/* Why this matters */}
      <section className={styles.whySection}>
        <div className="container-fluid">
          <p className={styles.sectionEyebrow}>Why this matters</p>
          <div className={styles.cardGrid}>
            {WHY_CARDS.map((card) => (
              <div key={card.title} className={styles.card}>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <p className={styles.cardBody}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll walk away with */}
      <section className={styles.walkawaySection}>
        <div className="container-fluid">
          <div className={styles.walkawayInner}>
            <p className={styles.sectionEyebrow}>What you&rsquo;ll walk away with</p>
            <ol className={styles.numberedList}>
              {WALKAWAY_ITEMS.map((item, i) => (
                <li key={i} className={styles.numberedItem}>
                  <span className={styles.itemNumber}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.itemText}>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Request a briefing */}
      <section className={styles.formSection}>
        <div className="container-fluid">
          <div className={styles.formInner}>
            <h2 className={styles.formHeading}>Request a briefing.</h2>
            <p className={styles.formSubheading}>
              Tell us about your organization and deployment context. We&rsquo;ll
              follow up with the right entry point.
            </p>
            <EnterpriseForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

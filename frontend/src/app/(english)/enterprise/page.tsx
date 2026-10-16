import { imageUrl } from '@/lib/image-assets'
import { imageAsset } from '@/lib/image-assets'
import Link from 'next/link'
import Image from '@/components/MediaImage'
import hotelTeamLocal from '../../../../public/images/enterprise/hotel-team.webp'
const hotelTeam = imageAsset('/images/enterprise/hotel-team.webp', hotelTeamLocal)
import workplaceTeamLocal from '../../../../public/images/robot-literacy/organizations.webp'
const workplaceTeam = imageAsset('/images/robot-literacy/organizations.webp', workplaceTeamLocal)
import cta from '@/components/FoundingCohort/FoundingCohort.module.css'
import { programLinks } from '@/lib/certifications'
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
    images: [{ url: imageUrl('/images/robot.png'), alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [imageUrl('/images/robot.png')],
  },
}

const WHY_CARDS = [
  {
    title: 'Robots are arriving faster than the training',
    body: 'Deployment outcomes depend on people, workflows, environments, and technology. Prepare teams with a shared language before robots arrive.',
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
  'A clear map of which roles need what level of robot literacy — and why.',
  'Practical frameworks for assessing and closing knowledge gaps on your team.',
  'Language for communicating robot capabilities and limits to non-technical stakeholders.',
  'A deployment readiness baseline your organization can revisit as the fleet grows.',
  'A relevant learning pathway: Robot Literacy, Live Robot Lab, RPDP for design teams, or RDP for deployment teams.',
]

export default function EnterprisePage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Enterprise"
        title="Deployment readiness starts with people"
        subtitle="Structured robot literacy for operations, logistics, and facilities teams — built for organizations integrating robots into non-engineering environments."
        imageContent={<div className={styles.imageFrame}><Image src={workplaceTeam} alt="A workplace team discussing how to work alongside a mobile robot" fill sizes="(max-width: 767px) 100vw, 456px" /></div>}
      >
        <a href="#enterprise-briefing" className={cta.cta}>Request a briefing →</a>
      </PageHero>

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
          <h2 className={styles.walkawayHeading}>What you&rsquo;ll walk away with</h2>
          <div className={styles.walkawayInner}>
            <div className={styles.imageFrame}><Image src={hotelTeam} alt="Hotel housekeeping staff working alongside a floor-cleaning robot in a guest room" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
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

      <section className={styles.whySection}>
        <div className="container-fluid">
          <h2 className={styles.formHeading}>Find the right program for your team</h2>
          <div className={`${styles.cardGrid} ${styles.programGrid}`}>{programLinks.map((program) => <article className={styles.card} key={program.href}>
            <h3 className={styles.cardTitle}>{program.label}</h3><p className={styles.cardBody}>{program.summary}</p>
            <Link className={`${cta.cta} ${styles.programCta}`} href={program.href}>{program.cta} →</Link>
          </article>)}</div>
        </div>
      </section>
      {/* Request a briefing */}
      <section id="enterprise-briefing" className={styles.formSection}>
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

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import styles from './press.module.css'

export const metadata: Metadata = {
  title: 'Press & Media — The Robot Age',
  description:
    'Background, founder biography, programme facts, media assets, and press contact information for The Robot Age.',
  openGraph: {
    title: 'Press & Media — The Robot Age',
    description:
      'A press resource for reporting on robotics literacy, human-robot experience, and The Robot Age.',
    images: [{ url: '/images/instructor.png', alt: 'Michael Posso, founder of The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/instructor.png'],
  },
}

const FACTS = [
  ['Founded by', 'Michael Posso'],
  ['Focus', 'Robotics literacy and human-robot experience'],
  ['Audience', 'Designers, product teams, strategists, operations leaders, and educators'],
  ['Based in', 'New York'],
  ['Flagship credential', 'REP — Robotics Experience Practitioner'],
  ['Research framework', 'Robot Experience Design (RXD)'],
]

const COVERAGE_AREAS = [
  'How robots change jobs, workplaces, and everyday environments',
  'UX and product design for embodied AI and autonomous systems',
  'Trust, failure, recovery, and communication in human-robot interaction',
  'Preparing non-engineers to evaluate and work alongside robots',
  'Consumer and workplace robot deployments beyond the demo',
]

const PRESS_LINKS = [
  {
    title: 'Robotics Literacy',
    body: 'The practical ability to understand robot capability, design for coexistence, and communicate across technical and non-technical teams.',
    href: '/robotics-literacy',
    cta: 'Read the definition',
  },
  {
    title: 'REP Certification',
    body: 'A six-week hybrid credential on the human side of robotics, culminating in a Robot Readiness Audit.',
    href: '/learn/rep',
    cta: 'View the credential',
  },
  {
    title: 'Robot Live Labs',
    body: 'Small, live online sessions where practitioners apply the RXD framework to a real robot, including guided scoring with Reachy Mini.',
    href: '/rxd-free-workshop',
    cta: 'View the live lab',
  },
  {
    title: 'Research & Tools',
    body: 'Original frameworks, field observations, robot profiles, and practical instruments for evaluating human-robot experience.',
    href: '/research',
    cta: 'Explore the research',
  },
]

export default function PressPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Press & Media"
        title="A field guide for covering The Robot Age"
        subtitle="Background, founder biography, programme facts, and direct source material for journalists covering robotics, design, work, and society."
        imageSrc="/images/instructor.png"
      />

      <main>
        <section className={styles.introSection}>
          <div className="container-fluid">
            <div className={styles.introGrid}>
              <div>
                <p className={styles.eyebrow}>The short version</p>
                <h2 className={styles.heading}>Robots are arriving faster than most people are being prepared to work with them.</h2>
              </div>
              <div className={styles.prose}>
                <p>
                  The Robot Age is an independent education and research platform focused on the human side of robotics. It gives designers, product teams, operations leaders, educators, and decision-makers the language and methods to understand what robots can do, evaluate how they behave in real environments, and design what happens when people and robots share a space.
                </p>
                <p>
                  Its work includes the Robot Experience Design framework, the Robotics Experience Practitioner credential, live robot labs, field research, and reporting on robotics through a practitioner lens. The focus is not how to engineer a robot. It is how to prepare everyone else whose work changes when one arrives.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.factSection}>
          <div className="container-fluid">
            <p className={styles.eyebrow}>At a glance</p>
            <dl className={styles.factGrid}>
              {FACTS.map(([term, description]) => (
                <div className={styles.fact} key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={styles.bioSection}>
          <div className="container-fluid">
            <div className={styles.bioGrid}>
              <div className={styles.portraitWrap}>
                <Image
                  src="/images/instructor.png"
                  alt="Michael Posso"
                  fill
                  sizes="(max-width: 767px) 100vw, 38vw"
                  className={styles.portrait}
                />
              </div>
              <div>
                <p className={styles.eyebrow}>Founder biography</p>
                <h2 className={styles.heading}>Michael Posso</h2>
                <p className={styles.standfirst}>
                  Product designer, educator, and founder of The Robot Age.
                </p>
                <div className={styles.prose}>
                  <p>
                    Michael Posso is a product designer and educator focused on the intersection of human experience and robotics. He founded The Robot Age to prepare non-engineers for the decisions, interactions, and workplace changes that come with robotic systems.
                  </p>
                  <p>
                    Posso holds a master&rsquo;s degree in Information Design and Technology from SUNY Polytechnic Institute and teaches as an adjunct professor at the Fashion Institute of Technology and the New York Institute of Technology. He has more than a decade of teaching experience across high school, undergraduate, and graduate education, including UX, web design, and JavaScript. His work examines how automated systems can be made clear, trustworthy, and effective for the people expected to live and work alongside them.
                  </p>
                </div>
                <p className={styles.bioNote}>This biography may be reproduced for editorial use.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.coverageSection}>
          <div className="container-fluid">
            <div className={styles.coverageGrid}>
              <div>
                <p className={styles.eyebrow}>Interview topics</p>
                <h2 className={styles.heading}>Available for context, comment, and conversation.</h2>
              </div>
              <ul className={styles.topicList}>
                {COVERAGE_AREAS.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.resourcesSection}>
          <div className="container-fluid">
            <p className={styles.eyebrow}>Source material</p>
            <h2 className={styles.heading}>Start with the original work.</h2>
            <div className={styles.resourceGrid}>
              {PRESS_LINKS.map((item) => (
                <article className={styles.resourceCard} key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <Link href={item.href}>{item.cta} <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className="container-fluid">
            <div className={styles.contactGrid}>
              <div>
                <p className={styles.eyebrow}>Press contact</p>
                <h2 className={styles.contactHeading}>Working on a story?</h2>
                <p className={styles.contactBody}>Send the outlet, topic, and deadline. Interview requests, background questions, and speaking enquiries are welcome.</p>
                <a className={styles.contactLink} href="mailto:press@therobotage.com">press@therobotage.com →</a>
              </div>
              <div className={styles.assetPanel}>
                <p className={styles.assetLabel}>Media asset</p>
                <h3>Founder portrait</h3>
                <p>High-resolution portrait of Michael Posso for editorial coverage.</p>
                <a href="/images/instructor.png" download>Download portrait <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

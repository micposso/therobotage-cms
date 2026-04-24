import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import styles from './robotics-literacy.module.css'

export const metadata = {
  title: 'Robotics Literacy — The Robot Age',
  description: 'The skill side of working with robots. Built for designers, operations leads, and business leaders — no engineering background required.',
  openGraph: {
    title: 'Robotics Literacy — The Robot Age',
    description: 'The skill side of working with robots. Built for designers, operations leads, and business leaders — no engineering background required.',
    images: [{ url: '/images/face.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/face.png'],
  },
}

const PILLARS = [
  {
    number: '01',
    title: 'Understand capability',
    body: 'Know what the robot in your context actually does — and where it stops working. The gap between specification and reality is where most deployment failures begin.',
  },
  {
    number: '02',
    title: 'Design for coexistence',
    body: 'Products, spaces, and workflows that ignore robotic behavior fail in practice. The goal is environments that hold up when the robot behaves exactly as designed.',
  },
  {
    number: '03',
    title: 'Communicate across the room',
    body: 'Ask the right questions in technical briefings. Represent user needs in vendor conversations. Evaluate tradeoffs without a CS degree. These are learnable skills.',
  },
]

const STATS = [
  { value: '$205B', label: 'Global robotics market projected by 2030', source: 'GlobalData, 2024' },
  { value: '36.8M', label: 'Robots already operating worldwide', source: 'IFR, 2024' },
  { value: '78M',   label: 'Net new jobs created by automation by 2030', source: 'World Economic Forum, 2025' },
  { value: '2.1M',  label: 'Skilled roles that will go unfilled without a prepared workforce', source: 'Deloitte / NAM, 2024' },
]

const FOR_WHOM = [
  { role: 'Product designers',       desc: 'Specifying behavior for systems that can override them.' },
  { role: 'UX strategists',          desc: 'Designing interactions where the robot has its own agenda.' },
  { role: 'Operations leaders',      desc: 'Managing environments their training didn\'t prepare them for.' },
  { role: 'Healthcare professionals', desc: 'Working alongside autonomous systems in high-stakes settings.' },
  { role: 'Business decision-makers', desc: 'Evaluating proposals without fluency in what they\'re buying.' },
]

export default function RoboticsLiteracyPage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Robotics Literacy"
        title="Working with robots is a skill."
        subtitle="The people working closest to robots — product designers, operations leads, healthcare professionals — rarely have formal training for it. Robotics literacy closes that gap."
        imageSrc="/images/face.png"
      />

      {/* ── Definition ───────────────────────────────────────────────────────── */}
      <section className={styles.definitionSection}>
        <div className="container-fluid">
          <div className={styles.definitionInner}>
            <blockquote className={styles.definition}>
              Understanding what a robot can and cannot do, recognizing how it changes the environments it enters, and communicating clearly about it — without ever needing to build one.
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className={styles.statsSection}>
        <div className="container-fluid">
          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.value} className={styles.statCard}>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statSource}>{s.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three pillars ────────────────────────────────────────────────────── */}
      <section className={styles.pillarsSection}>
        <div className="container-fluid">
          <p className={styles.eyebrow}>Three pillars</p>
          <div className={styles.pillarsGrid}>
            {PILLARS.map((p) => (
              <div key={p.number} className={styles.pillarCard}>
                <span className={styles.pillarNumber}>{p.number}</span>
                <h2 className={styles.pillarTitle}>{p.title}</h2>
                <p className={styles.pillarBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────────── */}
      <section className={styles.forSection}>
        <div className="container-fluid">
          <div className={styles.forInner}>
            <p className={styles.eyebrow}>Who it's for</p>
            <h2 className={styles.forHeadline}>People whose jobs changed before their training did.</h2>
            <ol className={styles.forList}>
              {FOR_WHOM.map((item, i) => (
                <li key={i} className={styles.forItem}>
                  <span className={styles.forRole}>{item.role}</span>
                  <span className={styles.forDesc}>{item.desc}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container-fluid">
          <div className={styles.ctaInner}>
            <p className={styles.eyebrow}>Get certified</p>
            <h2 className={styles.ctaHeadline}>Credential the skills you're already using.</h2>
            <p className={styles.ctaSubtext}>
              The REP certification was designed for practitioners who needed it but couldn't find it. Four tracks, no engineering prerequisites, built around what actually happens in mixed human-robot environments.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/learn" className={styles.ctaPrimary}>
                Explore the curriculum →
              </Link>
              <Link href="/access" className={styles.ctaGhost}>
                Join the waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

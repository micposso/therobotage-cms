import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getCertificationBySlug, getAllCertificationSlugs } from '@/lib/certifications'
import styles from './page.module.css'

export async function generateStaticParams() {
  return getAllCertificationSlugs().map((credential) => ({ credential }))
}

export async function generateMetadata({ params }: { params: Promise<{ credential: string }> }) {
  const { credential } = await params
  const cert = getCertificationBySlug(credential)
  if (!cert) return {}
  return {
    title: `${cert.abbr} Curriculum — The Robot Age`,
    description: `Full module-by-module curriculum for the ${cert.name} credential. See what you will cover, how the programme is structured, and what resources support your learning.`,
  }
}

type WeekData = {
  number: string
  title: string
  format: string
  dimensions: string
  description: string
  topics: string[]
  deliverable: string
  outcomes: string[]
}

export default async function CurriculumPage({ params }: { params: Promise<{ credential: string }> }) {
  const { credential } = await params
  const cert = getCertificationBySlug(credential)
  if (!cert) notFound()

  const weeks: WeekData[] = [
    {
      number: '01',
      title: 'What Is Human Robotics Experience?',
      format: 'Live Zoom · Wednesday 7pm ET',
      dimensions: 'All six (introduction)',
      description: 'The opening session introduces the Robot Experience Design framework and the idea that robotics is a human experience problem, not just an engineering one. You will meet Reachy Mini — a social humanoid desktop robot from Pollen Robotics and Hugging Face — and see the six RXD dimensions applied live. No code. No prerequisites.',
      topics: [
        'What RXD is and why it exists',
        'The six dimensions: Signal Clarity, Spatial Legibility, Perceived Presence, Failure Transparency, Interaction Fit, Recovery Design',
        'How the Robot Experience Score (RES) works as a scoring instrument',
        'Live demonstration: scoring Reachy Mini across all six dimensions',
        'What a Robot Readiness Audit looks like in practice',
      ],
      deliverable: 'None — this is the orientation session. Come with questions.',
      outcomes: [],
    },
    {
      number: '02',
      title: 'Signal Clarity & Spatial Legibility',
      format: 'Self-paced · ~2.5 hours',
      dimensions: 'Signal Clarity · Spatial Legibility',
      description: 'How robots communicate intent — and how humans read their position in space. This week covers the signals a robot sends (lights, sounds, movement, gaze direction) and the spatial cues that tell people where a robot is going, how close it will get, and whether it is aware of them.',
      topics: [
        'Signal types: visual, auditory, kinetic, haptic',
        'Signal timing and the cost of ambiguity',
        'Proxemics in human-robot interaction: personal space, approach angles, territorial boundaries',
        'Spatial legibility: can a bystander predict what this robot is about to do?',
        'Case study: consumer robots that signal well vs. ones that don\'t',
      ],
      deliverable: 'Signal audit — select a consumer robot (from the Robot of the Week archive or your own environment) and evaluate its Signal Clarity and Spatial Legibility using the RES rubric. 500–800 words with scored dimensions.',
      outcomes: [
        'Identify and categorise the signals a robot uses to communicate intent',
        'Evaluate whether a robot\'s spatial behaviour is legible to bystanders',
        'Apply the RES scoring criteria for Signal Clarity and Spatial Legibility',
      ],
    },
    {
      number: '03',
      title: 'Perceived Presence',
      format: 'Self-paced · ~2.5 hours',
      dimensions: 'Perceived Presence',
      description: 'Voice, form, aesthetic, emotional readability — the dimension that determines whether people treat a robot as a tool, a character, or a colleague. This week examines how design choices shape the social register of a robot, and why personality coherence matters more than personality itself.',
      topics: [
        'What Perceived Presence is and is not (it is not anthropomorphism)',
        'Voice design: tone, pacing, register, and the uncanny valley of synthetic speech',
        'Form factor and aesthetic as social signals',
        'Emotional readability: can people tell what the robot is "feeling" — and should they?',
        'The coherence test: does the robot\'s voice match its body, its context, and its task?',
        'Case study: Reachy Mini\'s expressive design vs. utilitarian service robots',
      ],
      deliverable: 'Persona brief — define a deployment context (retail, healthcare, hospitality, public space, education) and write a Perceived Presence specification for Reachy Mini in that context. Cover tone, form factor considerations, social register, and coherence rationale. 500–800 words.',
      outcomes: [
        'Distinguish Perceived Presence from anthropomorphism',
        'Evaluate a robot\'s voice, form, and affect as a coherent design system',
        'Write a Perceived Presence specification for a defined deployment context',
      ],
    },
    {
      number: '04',
      title: 'Interaction Fit & Failure Transparency',
      format: 'Self-paced · ~2.5 hours',
      dimensions: 'Interaction Fit · Failure Transparency',
      description: 'Is this the right robot for this task, in this context, for these people? And when it fails — because it will — does it fail honestly? This week pairs two dimensions that are tightly linked in practice: the match between robot capability and deployment context, and the design of failure as an intentional moment rather than an exception.',
      topics: [
        'Interaction Fit: matching capability to context, task, and user population',
        'Over-promising and under-delivering: the deployment gap',
        'Failure Transparency: what the robot communicates when something goes wrong',
        'Designing failure states: graceful degradation, honest error signals, and the difference between hiding failure and handling it',
        'Escalation design: when should a robot hand off to a human, and how?',
        'Case study: robots that fail silently vs. robots that fail well',
      ],
      deliverable: 'Failure scenario map — using your Week 3 deployment context, define three realistic failure states and specify the Recovery Design for each. Include: what fails, what the user sees, what the robot communicates, and what happens next. Structured template provided.',
      outcomes: [
        'Evaluate whether a robot\'s capabilities match its deployment context',
        'Design failure states as intentional interaction moments',
        'Specify escalation and handoff protocols for mixed human-robot environments',
      ],
    },
    {
      number: '05',
      title: 'Recovery Design & Applied Use Cases',
      format: 'Self-paced + Reachy Mini session · ~3 hours',
      dimensions: 'Recovery Design',
      description: 'The final self-paced week synthesises all six dimensions across real deployment verticals — retail, hospitality, healthcare, education, public space. You will write an interaction specification for Reachy Mini. TRA runs your spec on the actual robot and returns footage. You then document the gap between what you designed and what you observed.',
      topics: [
        'Recovery Design as a system, not an afterthought',
        'Full RXD synthesis: how the six dimensions interact in real deployments',
        'Writing an interaction specification: structured prompts, expected behaviour, success criteria',
        'Vertical deep dives: how RXD applies differently across industries',
        'Observing vs. specifying: what the gap between your design and the robot\'s behaviour reveals',
      ],
      deliverable: 'Interaction spec + observation report — write a structured interaction scenario for Reachy Mini. TRA runs it and sends you the footage. Document the gap between your spec and the observed behaviour. This is the direct preparation for the Week 6 capstone.',
      outcomes: [
        'Synthesise all six RXD dimensions into a single deployment evaluation',
        'Write a testable interaction specification for a social robot',
        'Analyse the gap between designed intent and observed robot behaviour',
      ],
    },
    {
      number: '06',
      title: 'Capstone: Robot Readiness Audit',
      format: 'Capstone submission · peer review',
      dimensions: 'All six',
      description: 'The final deliverable. TRA provides a standardised Reachy Mini session — video footage plus an interaction log. You complete a full Robot Readiness Audit: a scored RES across all six RXD dimensions with written rationale for each score. Submit your RRA, receive cohort feedback, and earn the REP credential and badge.',
      topics: [
        'RRA methodology: how to structure a professional audit',
        'Scoring discipline: calibrating your RES against the rubric',
        'Writing the rationale: evidence-based scoring, not opinion',
        'Peer review: reading and giving feedback on a colleague\'s audit',
      ],
      deliverable: 'Completed Robot Readiness Audit (RRA) — full RES scoring across all six RXD dimensions with written rationale. Passing threshold earns the REP credential and Credential.net badge.',
      outcomes: [
        'Conduct a complete Robot Readiness Audit on a real robot platform',
        'Score all six RXD dimensions using the RES instrument with evidence-based rationale',
        'Communicate audit findings to a professional audience',
      ],
    },
  ]

  const faqs = [
    {
      q: 'Do I need an engineering background?',
      a: 'No. The REP is built specifically for non-engineers — product designers, UX strategists, operations leads, and business decision-makers. If you can evaluate a product experience, you can do this programme.',
    },
    {
      q: 'Do I need to own a robot?',
      a: 'No. TRA operates Reachy Mini. You analyse the footage and interaction data we provide. A MuJoCo simulator is also available if you want to run your own sessions, but it is not required.',
    },
    {
      q: 'How much time should I expect to spend per week?',
      a: 'Approximately 2.5 hours per week for self-paced modules and deliverables. Week 1 (live Zoom) is approximately 90 minutes. Week 6 (capstone) may take 3–4 hours depending on your writing pace.',
    },
    {
      q: 'What do I get when I finish?',
      a: 'The REP credential and a digital badge issued via Credential.net. It is shareable on LinkedIn and verifiable by employers.',
    },
    {
      q: 'What is the RXD white paper?',
      a: 'The Robot Experience Design white paper is the published research document that defines the six dimensions and the scoring methodology. It is available on the Research page and provides the theoretical foundation for everything taught in the REP programme.',
    },
    {
      q: 'Can my employer pay for this?',
      a: 'Yes. TRA can issue an invoice for employer reimbursement. Email mike@therobotage.com.',
    },
    {
      q: 'What happens after REP?',
      a: 'REP is the foundational credential in The Robot Age certification family. Specialist tracks and advanced credentials are in development. Founding cohort members will have early access.',
    },
  ]

  return (
    <>
      <Nav pinned />

      <main className={styles.page}>
        <div className="container-fluid">

          {/* ── Hero header ──────────────────────────────────────────────────── */}
          <header className={styles.header}>
            <p className={styles.label}>{cert.abbr} · Curriculum</p>
            <h1 className={styles.title}>Six weeks. Six dimensions. One framework.</h1>
            <p className={styles.subhead}>
              The REP programme walks you through the Robot Experience Design framework dimension by dimension — from how robots signal intent to how they recover from failure. Every week builds on the last. Every deliverable is scoped to a real robot.
            </p>
            <div className={styles.actions}>
              <a href="https://learn.therobotage.com" className={styles.cta}>
                Enroll in the Founding Cohort →
              </a>
              <a href={`/learn/${credential}`} className={styles.secondary}>
                ← Back to {cert.abbr} Overview
              </a>
            </div>
            <div className={styles.pills}>
              {['6 Weeks', '~15 Hours Total', '1 Live Zoom + Async', 'Reachy Mini Platform', 'REP Credential on Completion'].map((pill) => (
                <span key={pill} className={styles.pill}>{pill}</span>
              ))}
            </div>
          </header>

          {/* ── Who this is for ─────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>Who this is for</p>
            <p className={styles.audienceIntro}>
              The REP is designed for professionals who work in, around, or alongside robotic systems — but who are not engineers. If your job involves making decisions about how robots show up in human environments, this curriculum was built for you.
            </p>
            <div className={styles.audienceGrid}>
              <div className={styles.audienceCard}>
                <h3 className={styles.audienceCardTitle}>Product Designers &amp; UX Strategists</h3>
                <p className={styles.audienceCardBody}>You design the interfaces, environments, and interactions where robots meet people. RXD gives you a structured evaluation method for those moments.</p>
              </div>
              <div className={styles.audienceCard}>
                <h3 className={styles.audienceCardTitle}>Operations &amp; Deployment Leads</h3>
                <p className={styles.audienceCardBody}>You manage the rollout. You see what breaks. RXD gives you the language to diagnose experience failures and design recovery protocols.</p>
              </div>
              <div className={styles.audienceCard}>
                <h3 className={styles.audienceCardTitle}>Business Leaders &amp; Strategists</h3>
                <p className={styles.audienceCardBody}>You approve the budget. RXD gives you a scoring instrument to evaluate deployment readiness before signing off — not after.</p>
              </div>
            </div>
          </section>

          {/* ── Programme structure ──────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>Programme structure</p>
            <p className={styles.structureIntro}>
              Week 1 is live on Zoom. Weeks 2 through 5 are self-paced with one scoped deliverable each. Week 6 is the capstone — a full Robot Readiness Audit scored against all six RXD dimensions. You submit it, get cohort feedback, and earn the REP credential.
            </p>
            <div className={styles.scheduleTable}>
              <div className={styles.scheduleHeader}>
                <span className={styles.scheduleCol}>Week</span>
                <span className={styles.scheduleCol}>Format</span>
                <span className={styles.scheduleColWide}>RXD Dimension(s)</span>
              </div>
              {[
                { week: '1', format: 'Live Zoom', dimensions: 'All six (overview)' },
                { week: '2', format: 'Self-paced + deliverable', dimensions: 'Signal Clarity · Spatial Legibility' },
                { week: '3', format: 'Self-paced + deliverable', dimensions: 'Perceived Presence' },
                { week: '4', format: 'Self-paced + deliverable', dimensions: 'Interaction Fit · Failure Transparency' },
                { week: '5', format: 'Self-paced + deliverable', dimensions: 'Recovery Design' },
                { week: '6', format: 'Capstone submission', dimensions: 'Full RXD (all six)' },
              ].map((row) => (
                <div key={row.week} className={styles.scheduleRow}>
                  <span className={styles.scheduleCol}>{row.week}</span>
                  <span className={styles.scheduleCol}>{row.format}</span>
                  <span className={styles.scheduleColWide}>{row.dimensions}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Week-by-week curriculum + Outcomes (side by side) ───────────── */}
          <div className={styles.twoCol}>

          <section className={styles.section}>
            <p className={styles.eyebrow}>Curriculum</p>
            <div className={styles.weekList}>
              {weeks.map((week, i) => (
                <details key={week.number} className={styles.weekDetails} open={i === 0}>
                  <summary className={styles.weekSummary}>
                    <span className={styles.weekNum}>{week.number}</span>
                    <span className={styles.weekName}>{week.title}</span>
                    <span className={styles.weekTag}>{week.format}</span>
                  </summary>
                  <div className={styles.weekBody}>
                    <p className={styles.weekDimLabel}>{week.dimensions}</p>
                    <p className={styles.weekDesc}>{week.description}</p>
                    <p className={styles.subLabel}>Topics covered</p>
                    <ul className={styles.topicList}>
                      {week.topics.map((topic, j) => (
                        <li key={j} className={styles.topicItem}>
                          <span className={styles.topicTick}>—</span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <p className={styles.subLabel}>Deliverable</p>
                    <p className={styles.weekDeliv}>{week.deliverable}</p>
                    {week.outcomes.length > 0 && (
                      <>
                        <p className={styles.subLabel}>Learning outcomes</p>
                        <ul className={styles.topicList}>
                          {week.outcomes.map((outcome, k) => (
                            <li key={k} className={styles.topicItem}>
                              <span className={styles.topicTick}>—</span>
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── What you will walk away with ─────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>What you will walk away with</p>
            <ul className={styles.outcomeList}>
              {[
                'Describe the architecture and behaviour of a robotic system in plain language — no engineering jargon required',
                'Identify the moments where human-robot interaction is most likely to break down',
                'Apply the Robot Experience Design framework to evaluate any consumer robot deployment',
                'Score a robot across all six RXD dimensions using the Robot Experience Score',
                'Design communication, escalation, and recovery protocols for mixed human-robot environments',
                'Conduct a professional Robot Readiness Audit',
                'Earn the REP credential and badge — issued via Credential.net, shareable on LinkedIn',
              ].map((item, i) => (
                <li key={i} className={styles.outcomeItem}>
                  <span className={styles.outcomeTick}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          </div>

          {/* ── Your platform ─────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>Your platform</p>
            <h2 className={styles.sectionHeadline}>Built around Reachy Mini</h2>
            <p className={styles.sectionBody}>
              Every module uses Reachy Mini — an open-source social humanoid robot developed by Pollen Robotics in partnership with Hugging Face. Reachy Mini is expressive, camera-equipped, voice-capable, and designed for exactly the kind of human-robot interaction this programme evaluates. You do not need to own one. TRA operates the hardware; you analyse the experience.
            </p>
            <div className={styles.pills}>
              {['Open Source', 'Hugging Face', 'Expressive Head + Antennas', 'Camera', '4-Mic Array', 'MuJoCo Simulator Available'].map((pill) => (
                <span key={pill} className={styles.pill}>{pill}</span>
              ))}
            </div>
          </section>

          {/* ── The framework ─────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>The framework behind the curriculum</p>
            <h2 className={styles.sectionHeadline}>Robot Experience Design (RXD)</h2>
            <p className={styles.sectionBody}>
              RXD is the original research framework developed by The Robot Age. It defines six dimensions for evaluating how humans experience robots — not how robots are engineered, but how they show up in human environments. The REP curriculum teaches you to apply it. The Robot Experience Score (RES) is the scored instrument. The Robot Readiness Audit (RRA) is the professional application.
            </p>
            <div className={`${styles.pills} ${styles.pillsMargin}`}>
              {['Signal Clarity', 'Spatial Legibility', 'Perceived Presence', 'Failure Transparency', 'Interaction Fit', 'Recovery Design'].map((dim) => (
                <span key={dim} className={styles.pill}>{dim}</span>
              ))}
            </div>
            <a href="/rxd" className={styles.frameworkLink}>Read the RXD White Paper →</a>
          </section>

          {/* ── Founding Cohort CTA ───────────────────────────────────────────── */}
          <section className={styles.ctaSection}>
            <p className={styles.eyebrow}>Founding Cohort — Limited to 10 Seats</p>
            <h2 className={styles.ctaHeadline}>Be one of the first Robotics Experience Practitioners.</h2>
            <p className={styles.ctaBody}>
              The founding cohort gets direct access to the course creator, input on the curriculum as it evolves, and a permanent founding member designation on their credential. This rate will not be repeated.
            </p>
            <div className={styles.pricingTable}>
              <div className={styles.pricingRow}>
                <span className={styles.pricingLabel}>Founding Cohort Rate</span>
                <span className={styles.pricingValueAccent}>
                  $199 <span className={styles.pricingMeta}>or 2 × $99</span>
                </span>
              </div>
              <div className={styles.pricingRow}>
                <span className={styles.pricingLabel}>General Rate (future cohorts)</span>
                <span className={styles.pricingValue}>$399</span>
              </div>
            </div>
            <a href="https://learn.therobotage.com" className={styles.cta}>Enroll Now →</a>
            <p className={styles.ctaSupport}>Payment handled securely via Lemon Squeezy. Credential issued via Credential.net upon completion.</p>
          </section>

          {/* ── FAQ ──────────────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <p className={styles.eyebrow}>Common questions</p>
            <div className={styles.faqList}>
              {faqs.map((item, i) => (
                <details key={i} className={styles.faqDetails}>
                  <summary className={styles.faqSummary}>
                    <span className={styles.faqQuestion}>{item.q}</span>
                  </summary>
                  <p className={styles.faqAnswer}>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ── Back link ────────────────────────────────────────────────────── */}
          <div className={styles.back}>
            <a href={`/learn/${credential}`} className={styles.backLink}>
              ← Back to {cert.name}
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

import Image from 'next/image'
import type { ReactNode } from 'react'
import {
  agenda,
  audiences,
  faqs,
  included,
  outcomes,
  pricing,
  principles,
  robots,
  testimonials,
  workshopMetrics,
} from './content'
import styles from './live-robot-lab.module.css'

export const requestAnchor = '#request-live-robot-lab'

export function Section({
  id,
  title,
  eyebrow,
  children,
  dark = false,
}: {
  id?: string
  title: string
  eyebrow?: string
  children: ReactNode
  dark?: boolean
}) {
  return (
    <section id={id} className={`${styles.section} ${dark ? styles.dark : ''}`}>
      <div className={styles.container}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  )
}

export function LiveRobotLabHero() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div>
          <p className={styles.eyebrow}>THE ROBOT AGE · LIVE EXPERIENCES</p>
          <h1>Meet the robots shaping our future.</h1>
          <p className={styles.lead}>
            Live Robot Lab is a hands-on robotics experience that brings real
            robots, embodied AI, and human-robot interaction directly to your
            school, organization, or workplace.
          </p>
          <p className={styles.meta}>
            Starting at $1,250 · 2-hour experience · NYC Metro Area
          </p>
          <div className={styles.actions}>
            <a className={styles.button} href={requestAnchor}>
              Request a Robot Lab <span aria-hidden="true">↗</span>
            </a>
            <a className={styles.textLink} href="#live-robot-lab-video">
              Watch the Experience <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <figure className={styles.heroFigure}>
          <div className={styles.heroImage}>
            <Image
              src="/images/robots/unitree-go2-pro/shop-01.png"
              alt="Unitree Go2 Pro, one of the two robots you can meet at Live Robot Lab."
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              preload
            />
          </div>
          <figcaption>Featuring Reachy Mini + Unitree Go2 Pro</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function LiveRobotLabVideo() {
  // Replace this figure with a titled iframe or a video with controls and captions.
  return (
    <section
      id="live-robot-lab-video"
      aria-label="Watch the experience"
      className={styles.section}
    >
      <div className={styles.container}>
        <figure className={styles.video}>
          <span className={styles.mediaMark} aria-hidden="true">
            ↗
          </span>
          <p className={styles.eyebrow}>LIVE ROBOT LAB</p>
          <h2>Video coming soon</h2>
          <figcaption>
            See what happens when people meet embodied AI.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

export function ExperiencePrinciples() {
  return (
    <Section
      title="This isn't a robot demo."
      eyebrow="Learn through experience"
    >
      <p className={styles.subheading}>
        Robots aren&apos;t just something to watch. They&apos;re something to
        understand.
      </p>
      <p className={styles.intro}>
        Live Robot Lab combines demonstration, interaction, experimentation, and
        discussion to help participants understand how modern robots perceive,
        move, communicate, and interact with humans.
      </p>
      <div className={styles.fourGrid}>
        {principles.map(([title, body], i) => (
          <article className={styles.card} key={title}>
            <p className={styles.eyebrow}>0{i + 1}</p>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function RobotShowcase() {
  return (
    <Section title="Meet the robots" eyebrow="Two robots. Two ways to explore.">
      <div className={styles.twoGrid}>
        {robots.map((robot) => (
          <article key={robot.name} className={styles.robotCard}>
            <div className={styles.robotImage}>
              <Image
                src={robot.image}
                alt={robot.alt}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </div>
            <div className={styles.robotCopy}>
              <h3>{robot.name}</h3>
              <p className={styles.eyebrow}>{robot.subtitle}</p>
              <p>{robot.description}</p>
              <ul className={styles.tags} aria-label={`${robot.name} topics`}>
                {robot.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function PricingOptions() {
  return (
    <Section
      title="Choose your Live Robot Lab"
      eyebrow="Bring the experience to your community"
    >
      <div className={styles.fourGrid}>
        {pricing.map((option) => (
          <article className={styles.priceCard} key={option.title}>
            <h3>{option.title}</h3>
            <p className={styles.price}>{option.price}</p>
            {option.details && (
              <p className={styles.meta}>
                {option.details.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            )}
            <p>{option.description}</p>
            {option.items && (
              <div>
                <p className={styles.eyebrow}>{option.listTitle}</p>
                <ul className={styles.list}>
                  {option.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {option.extra && <p>{option.extra}</p>}
            <a className={styles.priceCta} href={requestAnchor}>
              {option.cta} <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function LabTimeline() {
  return (
    <Section
      title="What happens during the two hours?"
      eyebrow="The experience, step by step"
      dark
    >
      <ol className={styles.timeline}>
        {agenda.map(([time, title, description]) => (
          <li key={time}>
            <span className={styles.time}>{time}</span>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function LearningOutcomes() {
  return (
    <Section title="What participants learn" eyebrow="Ideas that stay with you">
      <div className={styles.threeGrid}>
        {outcomes.map(([title, description]) => (
          <article className={styles.card} key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function AudienceLevels() {
  return (
    <Section
      title="Designed for different ages"
      eyebrow="A shared experience. Different depths."
    >
      <div className={styles.fourGrid}>
        {audiences.map((audience) => (
          <article className={styles.card} key={audience.title}>
            <p className={styles.eyebrow}>{audience.label}</p>
            <h3>{audience.title}</h3>
            <ul className={styles.list}>
              {audience.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function SocialProof() {
  return (
    <Section
      title="Robots are better understood when you can actually meet one."
      eyebrow="From the workshop floor"
    >
      <div className={styles.twoGrid}>
        <p className={styles.lead}>
          Live Robot Lab grew out of The Robot Age&apos;s hands-on robotics
          workshops exploring how people understand, trust, and interact with
          intelligent machines.
        </p>
        <figure className={styles.photoPlaceholder}>
          <span className={styles.mediaMark} aria-hidden="true">
            +
          </span>
          <figcaption>Workshop photo coming soon</figcaption>
        </figure>
      </div>
      <div className={styles.threeGrid}>
        {workshopMetrics.map((metric) => (
          <div className={styles.card} key={metric.label}>
            <h3>{metric.label}</h3>
            <p>{metric.value ?? 'Measurement coming soon'}</p>
          </div>
        ))}
      </div>
      <div className={styles.threeGrid}>
        {testimonials.map((item) => (
          <article className={styles.card} key={item.label}>
            <h3>{item.label}</h3>
            {item.quote ? (
              <>
                <blockquote>{item.quote}</blockquote>
                <p>{item.attribution}</p>
              </>
            ) : (
              <p>Testimonial coming soon</p>
            )}
          </article>
        ))}
      </div>
    </Section>
  )
}

export function IncludedSection() {
  return (
    <Section
      title="What's included"
      eyebrow="Everything you need to get started"
    >
      <ul className={`${styles.list} ${styles.included}`}>
        {included.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className={styles.bring}>
        <p>You provide: an indoor space, power, Wi-Fi, and participants.</p>
        <p className={styles.statement}>We bring the robots.</p>
      </div>
    </Section>
  )
}

export function LiveRobotLabFAQ() {
  return (
    <Section
      title="Frequently asked questions"
      eyebrow="Before the robots arrive"
    >
      <div className={styles.faq}>
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

export function FinalCTA() {
  return (
    <Section title="The future of AI isn't only on a screen." dark>
      <p className={styles.subheading}>Meet it in person.</p>
      <a href={requestAnchor} className={styles.button}>
        Request a Live Robot Lab <span aria-hidden="true">↗</span>
      </a>
      <div className={styles.brand}>
        <p>THE ROBOT AGE</p>
        <p>Robot Literacy · Embodied AI · Human-Robot Interaction</p>
      </div>
    </Section>
  )
}

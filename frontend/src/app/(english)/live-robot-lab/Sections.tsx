import { contentHref } from '@/lib/i18n/localize'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
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

export function LiveRobotLabHero({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  const resolveHref = (url: string) => contentHref(url, locale)
  return (
    <section className={styles.hero}>
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div>
          <p className={styles.eyebrow}>{t("THE ROBOT AGE · LIVE EXPERIENCES")}</p>
          <h1>{t("Meet the robots shaping our future.")}</h1>
          <p className={styles.lead}>{t("Live Robot Lab is a hands-on robotics experience that brings real robots, embodied AI, and human-robot interaction directly to your school, organization, or workplace.")}</p>
          <p className={styles.meta}>{t("Starting at $1,250 · 2-hour experience · NYC Metro Area")}</p>
          <div className={styles.actions}>
            <a className={styles.button} href={resolveHref(requestAnchor)}>{t("Request a Robot Lab")}<span aria-hidden="true">↗</span>
            </a>
            <a className={styles.textLink} href="#live-robot-lab-video">{t("Watch the Experience")}<span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LiveRobotLabVideo({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  // Replace this figure with a titled iframe or a video with controls and captions.
  return (
    <section
      id="live-robot-lab-video"
      aria-label={t("Watch the experience")}
      className={styles.section}
    >
      <div className={styles.container}>
        <figure className={styles.video}>
          <span className={styles.mediaMark} aria-hidden="true">
            ↗
          </span>
          <p className={styles.eyebrow}>{t("LIVE ROBOT LAB")}</p>
          <h2>{t("Video coming soon")}</h2>
          <figcaption>{t("See what happens when people meet embodied AI.")}</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function ExperiencePrinciples({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return (
    <Section
      title={t("This isn't a robot demo.")}
      eyebrow={t("Learn through experience")}
    >
      <p className={styles.subheading}>{t("Robots aren't just something to watch. They're something to understand.")}</p>
      <p className={styles.intro}>{t("Live Robot Lab combines demonstration, interaction, experimentation, and discussion to help participants understand how modern robots perceive, move, communicate, and interact with humans.")}</p>
      <div className={styles.fourGrid}>
        {principles.map(([title, body], i) => (
          <article className={styles.card} key={title}>
            <p className={styles.eyebrow}>0{i + 1}</p>
            <h3>{t(title ?? '')}</h3>
            <p>{t(body ?? '')}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function RobotShowcase({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return (
    <Section title={t("Meet the robots")} eyebrow={t("Two robots. Two ways to explore.")}>
      <div className={styles.twoGrid}>
        {robots.map((robot) => (
          <article key={robot.name} className={styles.robotCard}>
            <div className={styles.robotImage}>
              <Image
                src={robot.image}
                alt={t(robot.alt ?? '')}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </div>
            <div className={styles.robotCopy}>
              <h3>{t(robot.name ?? '')}</h3>
              <p className={styles.eyebrow}>{t(robot.subtitle ?? '')}</p>
              <p>{t(robot.description ?? '')}</p>
              <ul className={styles.tags} aria-label={t(`${robot.name} topics`)}>
                {robot.tags.map((tag) => (
                  <li key={tag}>{t(tag ?? '')}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function PricingOptions({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  const resolveHref = (url: string) => contentHref(url, locale)
  return (
    <Section
      title={t("Choose your Live Robot Lab")}
      eyebrow={t("Bring the experience to your community")}
    >
      <div className={styles.fourGrid}>
        {pricing.map((option) => (
          <article className={styles.priceCard} key={option.title}>
            <h3>{t(option.title)}</h3>
            <p className={styles.price}>{t(option.price)}</p>
            {option.details && (
              <p className={styles.meta}>
                {option.details.map((line) => (
                  <span key={line}>
                    {t(line)}
                    <br />
                  </span>
                ))}
              </p>
            )}
            <p>{t(option.description)}</p>
            {option.items && (
              <div>
                <p className={styles.eyebrow}>{t(option.listTitle ?? '')}</p>
                <ul className={styles.list}>
                  {option.items.map((item) => (
                    <li key={item}>{t(item)}</li>
                  ))}
                </ul>
              </div>
            )}
            {option.extra && <p>{t(option.extra)}</p>}
            <a className={styles.priceCta} href={resolveHref(requestAnchor)}>
              {t(option.cta)} <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function LabTimeline({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return (
    <Section
      title={t("What happens during the two hours?")}
      eyebrow={t("The experience, step by step")}
      dark
    >
      <ol className={styles.timeline}>
        {agenda.map(([time, title, description]) => (
          <li key={time}>
            <span className={styles.time}>{t(time ?? '')}</span>
            <div>
              <h3>{t(title ?? '')}</h3>
              <p>{t(description ?? '')}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function LearningOutcomes({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return (
    <Section title={t("What participants learn")} eyebrow={t("Ideas that stay with you")}>
      <div className={styles.threeGrid}>
        {outcomes.map(([title, description]) => (
          <article className={styles.card} key={title}>
            <h3>{t(title ?? '')}</h3>
            <p>{t(description ?? '')}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function AudienceLevels({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return (
    <Section
      title={t("Designed for different ages")}
      eyebrow={t("A shared experience. Different depths.")}
    >
      <div className={styles.fourGrid}>
        {audiences.map((audience) => (
          <article className={styles.card} key={audience.title}>
            <p className={styles.eyebrow}>{t(audience.label)}</p>
            <h3>{t(audience.title)}</h3>
            <ul className={styles.list}>
              {audience.topics.map((topic) => (
                <li key={topic}>{t(topic)}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function SocialProof({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return (
    <Section
      title={t("Robots are better understood when you can actually meet one.")}
      eyebrow={t("From the workshop floor")}
    >
      <div className={styles.twoGrid}>
        <p className={styles.lead}>{t("Live Robot Lab grew out of The Robot Age's hands-on robotics workshops exploring how people understand, trust, and interact with intelligent machines.")}</p>
        <figure className={styles.photoPlaceholder}>
          <span className={styles.mediaMark} aria-hidden="true">
            +
          </span>
          <figcaption>{t("Workshop photo coming soon")}</figcaption>
        </figure>
      </div>
      <div className={styles.threeGrid}>
        {workshopMetrics.map((metric) => (
          <div className={styles.card} key={metric.label}>
            <h3>{t(metric.label)}</h3>
            <p>{t(metric.value ?? 'Measurement coming soon')}</p>
          </div>
        ))}
      </div>
      <div className={styles.threeGrid}>
        {testimonials.map((item) => (
          <article className={styles.card} key={item.label}>
            <h3>{t(item.label)}</h3>
            {item.quote ? (
              <>
                <blockquote>{t(item.quote)}</blockquote>
                <p>{t(item.attribution ?? '')}</p>
              </>
            ) : (
              <p>{t("Testimonial coming soon")}</p>
            )}
          </article>
        ))}
      </div>
    </Section>
  )
}

export function IncludedSection({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return (
    <Section
      title={t("What's included")}
      eyebrow={t("Everything you need to get started")}
    >
      <ul className={`${styles.list} ${styles.included}`}>
        {included.map((item) => (
          <li key={item}>{t(item)}</li>
        ))}
      </ul>
      <div className={styles.bring}>
        <p>{t("You provide: an indoor space, power, Wi-Fi, and participants.")}</p>
        <p className={styles.statement}>{t("We bring the robots.")}</p>
      </div>
    </Section>
  )
}

export function LiveRobotLabFAQ({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return (
    <Section
      title={t("Frequently asked questions")}
      eyebrow={t("Before the robots arrive")}
    >
      <div className={styles.faq}>
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{t(question ?? '')}</summary>
            <p>{t(answer ?? '')}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

export function FinalCTA({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  const resolveHref = (url: string) => contentHref(url, locale)
  return (
    <Section title={t("The future of AI isn't only on a screen.")} dark>
      <p className={styles.subheading}>{t("Meet it in person.")}</p>
      <a href={resolveHref(requestAnchor)} className={styles.button}>{t("Request a Live Robot Lab")}<span aria-hidden="true">↗</span>
      </a>
      <div className={styles.brand}>
        <p>{t("THE ROBOT AGE")}</p>
        <p>{t("Robot Literacy · Embodied AI · Human-Robot Interaction")}</p>
      </div>
    </Section>
  )
}

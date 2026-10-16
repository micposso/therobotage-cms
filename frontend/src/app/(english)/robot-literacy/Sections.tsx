import { imageAsset } from '@/lib/image-assets'
import { contentHref } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'
import Image from '@/components/MediaImage'
import Link from 'next/link'
import MediaPlaceholder from '@/components/MediaPlaceholder/MediaPlaceholder'
import PageHero from '@/components/PageHero/PageHero'
import VerticalStackedCards from '@/components/VerticalStackedCards/VerticalStackedCards'
import { Section } from '@/app/(english)/live-robot-lab/Sections'
import { applications, audiences, decisions, faqs, framework } from './framework-content'
import { PartnershipLink } from './Interactive'
import RobotLiteracyVideo from './RobotLiteracyVideo'
import styles from '@/app/(english)/live-robot-lab/live-robot-lab.module.css'
import local from './robot-literacy.module.css'
import schoolsImageLocal from '../../../../public/images/robot-literacy/schools.webp'
const schoolsImage = imageAsset('/images/robot-literacy/schools.webp', schoolsImageLocal)
import organizationsImageLocal from '../../../../public/images/robot-literacy/organizations.webp'
const organizationsImage = imageAsset('/images/robot-literacy/organizations.webp', organizationsImageLocal)
import societyImageLocal from '../../../../public/images/robot-literacy/society.webp'
const societyImage = imageAsset('/images/robot-literacy/society.webp', societyImageLocal)

const applicationImages = [schoolsImage, organizationsImage, societyImage]

const frameworkHeaderImages = {
  INTERPRET: '/images/signal-icon.png',
  RELATE: '/images/heart.png',
  COEXIST: '/images/human.png',
} as const

export function LiteracyActions({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return <div className={styles.actions}>
    <a className={styles.button} href="#framework">{t("Explore the Framework ")}<span aria-hidden="true">↓</span></a>
    <a className={styles.textLink} href="/enterprise">{t("Bring Robot Literacy to Your Organization")}</a>
  </div>
}

export function FrameworkProgression({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return <ol className={local.progression} aria-label={t("Robot Literacy framework areas")}>
    {framework.map((area) => <li id={area.title.toLowerCase()} key={area.title}>
      <article className={local.progressionCard} aria-labelledby={`${area.title.toLowerCase()}-title`}>
        <h2 id={`${area.title.toLowerCase()}-title`} className={local.progressionTitle}>{t(area.title)}</h2>
        <p className={local.progressionSubtitle}>{t(area.scale)}</p>
        <div className={local.progressionImage}>
          <Image
            src={frameworkHeaderImages[area.title]}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 33vw"
          />
        </div>
        <p className={local.progressionDescription}>{t(area.description)}</p>
        {'principle' in area && area.principle && <p className={local.progressionDescription}>{t(area.principle)}</p>}
        {area.headerQuestions.length > 0 && <ul className={local.progressionQuestions}>
          {area.headerQuestions.map((question) => <li key={question}>{t(question)}</li>)}
        </ul>}
        <p className={local.progressionConcepts}>{area.topics.map(t).join(' · ')}</p>
      </article>
    </li>)}
  </ol>
}

function FrameworkVersionLabel({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return <p className={styles.meta}>{t("The Robot Age Robot Literacy Framework — Version 1.0 · September 2026")}</p>
}

export function RobotLiteracyHero({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return <>
    <PageHero
      eyebrow={t("THE ROBOT AGE")}
      title={t("Robot Literacy")}
      subtitle={t("Understand robots. Interact responsibly. Decide how they belong in our world.")}
      imageSrc="/images/society-family-sm.png"
    >
      <div className={local.heroBody}>
        <p>{t("The Robot Age’s Robot Literacy framework helps people understand what robots can do, how humans and robots should interact, and what changes when robots become part of everyday life.")}</p>
      </div>
      <LiteracyActions locale={locale} />
    </PageHero>
  </>
}

export function RobotLiteracyBridge() {
  return <Section title="Intelligence is becoming physical." eyebrow="AI Literacy + Robot Literacy">
    <p className={styles.intro}>AI literacy helps us understand intelligent digital systems. Robot Literacy extends that understanding into the physical world, where intelligent systems can sense, move, interact and act around people.</p>
  </Section>
}

export function RobotLiteracyFrameworkSummary({ locale = 'en' }: { locale?: Locale } = {}) {
  return <section id="framework" className={styles.section}>
    <div className={styles.container}>
      <FrameworkVersionLabel locale={locale} />
      <FrameworkProgression locale={locale} />
      <RobotLiteracyVideo />
    </div>
  </section>
}

export function RobotLiteracyApplications({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return <Section id="literacy-applications" title={t("What does Robot Literacy mean for you?")} eyebrow={t("Application")}>
    <p className={styles.intro}>{t("The same framework can help people understand robots in very different environments.")}</p>
    <div className={local.applicationRows}>
      {applications.map((item, index) => <article className={local.applicationRow} key={item.audience}>
        <div className={local.applicationImage}>
          <Image src={applicationImages[index]} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" />
        </div>
        <div className={local.applicationCopy}>
          <p className={styles.eyebrow}>{t(item.audience)}</p>
          <h3>{t(item.title)}</h3>
          <p className={local.applicationDescription}>{t(item.description)}</p>
          <div className={local.applicationQuestions}>
            <p className={styles.eyebrow}>{t('Example questions')}</p>
            <ul>{item.questions.map((question) => <li key={question}>{t(question)}</li>)}</ul>
          </div>
          <Link className={styles.button} href={contentHref(item.href, locale)}>{t(item.cta)} <span aria-hidden="true">→</span></Link>
        </div>
      </article>)}
    </div>
  </Section>
}

export function RobotLiteracyLearningFormats({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return <Section id="literacy-learning" title={t("Turn understanding into experience.")} eyebrow={t("Ways to learn")}>
    <VerticalStackedCards cards={[
      { title: t("Professional Programs"), description: t("Professional pathways for people designing robot experiences (RPDP) or preparing organizations for robot deployment (RDP)."), cta: <Link className={styles.textLink} href={contentHref("/learn#programs", locale)}>{t("Explore RPDP and RDP ↗")}</Link> },
      { title: t("Live Robot Lab"), description: t("Hands-on experiences with real robots. Observe behavior, ask questions and practice INTERPRET, RELATE and COEXIST with physical robotic systems."), cta: <Link className={styles.textLink} href={contentHref("/live-robot-lab", locale)}>{t("Explore Live Robot Lab ↗")}</Link> },
      { title: t("Corporate Consulting & Workshops"), description: t("Programs for companies, universities and organizations applying Robot Literacy to workforce readiness, robot deployment, customer experience, governance and responsible adoption."), cta: <a className={styles.textLink} href={contentHref("/enterprise", locale)}>{t("Discuss a Program")}</a> },
    ]} />
    <p className={styles.meta}>{t("The Robot Age’s Robot Literacy framework is hardware-agnostic and can be applied across humanoids, quadrupeds, social robots, autonomous mobile robots, cobots and emerging robotic systems.")}</p>
    <p className={styles.meta}><PartnershipLink>{t("Discuss a curriculum partnership ↗")}</PartnershipLink></p>
  </Section>
}

export function RobotLiteracyFinalStatement({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = (text: string) => uiText(text, locale)
  return <Section id="inquiry" title={t("Robot Literacy will evolve as robots evolve.")} eyebrow={t("The next literacy")}>
    <p className={styles.intro}>{t("Capabilities, regulations, social norms and human relationships with robots will continue changing. The Robot Age is developing Robot Literacy as a shared framework that can be tested, questioned and refined through education, research and real-world interaction.")}</p>
    <Link className={styles.button} href="/connect">{t("Bring Robot Literacy to Your School or Organization")}</Link>
  </Section>
}

export function PhysicalIntelligenceSection() {
  return <Section title="Intelligence is becoming physical." eyebrow="01 / Why Robot Literacy">
    <div className={styles.twoGrid}>
      <p className={styles.intro}>As robots move into schools, workplaces, hospitals, homes and public spaces, people need more than technical knowledge. They need to read behavior, understand limitations, protect privacy and decide when and how robots should be used.</p>
      <p className={styles.intro}>AI literacy often begins with software. Robots can also perceive environments, move through shared spaces, manipulate objects and interact with people. Their actions can have physical consequences.</p>
    </div>
    <div className={`${styles.twoGrid} ${local.comparison}`}>
      <article><h3>AI Literacy</h3><p>Understand intelligent digital systems.</p><p className={styles.meta}>Prompts · Generated content · Algorithms · Digital data</p></article>
      <article><h3>Robot Literacy</h3><p>Understand intelligent systems operating in the physical world.</p><p className={styles.meta}>Perception · Movement · Autonomy · Physical interaction · Sensing · Privacy · Human behavior · Societal impact</p></article>
    </div>
    <p className={styles.meta}>Robot Literacy extends AI literacy into physical environments. The two belong together.</p>
  </Section>
}

export function LiteracyFramework() {
  return <Section id="framework" title="Three areas. One way to make sense of robots." eyebrow="02 / The Robot Literacy Framework">
    <p className={styles.intro}>Learn to read a robot before deciding how to relate to it. Understand the robot. Interact with robots. Learn how to live with robots.</p>
    <FrameworkVersionLabel />
    <div className={local.frameworkStack}>{framework.map((area, index) => <div id={area.title.toLowerCase()} key={area.title} className={local.frameworkArea}>
      <VerticalStackedCards cards={[{
        title: area.title, eyebrow: `0${index + 1} / ${area.scale}`,
        media: <>
          <p className={local.signature}>{area.question}</p>
          <p className={styles.meta}>{area.description}</p>
          {/* TODO: Replace with a contextual photo for this framework area. */}
          <div className={local.frameworkImage}>
            <MediaPlaceholder label={`${area.title} / ${area.scale}`} />
          </div>
        </>,
        content: <>
          <ul className={`${styles.list} ${local.topics}`}>{area.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          <div className={local.example}><p className={styles.eyebrow}>In everyday life</p><p>{area.example}</p></div>
          <div className={styles.faq}><details><summary>Explore {area.title.toLowerCase()} in more depth</summary>
            <dl className={`${local.details} ${local.moduleContent}`}>{area.deeper.map(([title, body]) => <div key={title}><dt>{title}</dt><dd>{body}</dd></div>)}</dl>
          </details></div>
        </>,
      }]} />
    </div>)}</div>
  </Section>
}

export function HumanRobotRelationship() {
  return <Section title="HUMAN ↔ ROBOT" eyebrow="04 / A two-way relationship">
    <p className={styles.intro}><strong>Reciprocal responsibility</strong> means looking at both sides of an encounter. People have expectations of robots; increasingly capable robots also invite questions about appropriate human behavior toward them.</p>
    <div className={styles.twoGrid}>
      <article className={styles.card}><h3>What people should expect from robots</h3><ul className={styles.list}>
        {['Safe behavior', 'Understandable movement', 'Clear feedback', 'Appropriate boundaries', 'Transparency about capabilities and control', 'Privacy', 'Predictable failure behavior'].map((item) => <li key={item}>{item}</li>)}
      </ul></article>
      <article className={styles.card}><h3>What responsible interaction may require from people</h3><ul className={styles.list}>
        {['Avoid intentional interference', 'Respect operating boundaries', 'Understand limitations', 'Avoid unnecessary damage', 'Use appropriate supervision', 'Recognize when someone else depends on the robot', 'Consider emerging questions of moral responsibility'].map((item) => <li key={item}>{item}</li>)}
      </ul></article>
    </div>
    <p className={styles.meta}>Helping, protecting or naming a robot can shape our relationship with it. So can blocking or damaging it. We can examine these choices without assuming robots have feelings or human rights.</p>
  </Section>
}

/** A reusable discussion guide, not a score or automated deployment approval. */
export function ShouldThisBeARobot({ questions = decisions }: { questions?: readonly (readonly [string, string, string])[] }) {
  return <section id="should-this-be-a-robot" className={`${styles.section} ${styles.dark}`}><div className={styles.container}>
    <p className={styles.eyebrow}>05 / Should this be a robot?</p>
    <p className={local.canStatement}>Can a robot do it?</p>
    <h2>Should a robot do it?</h2>
    <p className={styles.intro}>Technical capability alone does not determine whether robotics is the right solution. Start with a real task. Use these questions to examine the decision with the people it affects.</p>
    <div className={`${styles.faq} ${local.decisionGuide}`}>{questions.map(([title, question, guidance], index) => <details key={title}>
      <summary><span className={local.decisionLabel}>0{index + 1} / {title}</span><span>{question}</span></summary>
      <p>{guidance}</p>
    </details>)}</div>
    <p className={styles.meta}>An unanswered question is a reason to investigate. This is a discussion guide, not a certification or a deployment score.</p>
  </div></section>
}

export function LiteracyAudience() {
  return <Section title="A shared language for everyone around robots." eyebrow="07 / Who Robot Literacy is for">
    <dl className={local.audience}>{audiences.map(([title, description]) => <div className={styles.twoGrid} key={title}><dt>{title}</dt><dd>{description}</dd></div>)}</dl>
  </Section>
}

export function LearningFormats() {
  return <Section title="Turn understanding into experience." eyebrow="08 / Ways to learn">
    <p className={local.learningPath}>Robot Literacy Framework <span aria-hidden="true">↓</span> Learning experiences <span aria-hidden="true">↓</span> Real-world application</p>
    <VerticalStackedCards cards={[
      { title: 'Professional Programs', description: 'Professional pathways for people designing robot experiences (RPDP) or preparing organizations for robot deployment (RDP).', cta: <Link className={styles.textLink} href="/learn#programs">Explore RPDP and RDP ↗</Link> },
      { title: 'Live Robot Lab', description: 'Hands-on experiences with real robots. Observe behavior, ask questions and practice INTERPRET, RELATE and COEXIST with physical robotic systems.', cta: <Link className={styles.textLink} href="/live-robot-lab">Explore Live Robot Lab ↗</Link> },
      { title: 'Corporate Consulting & Workshops', description: 'Programs for companies, universities and organizations applying Robot Literacy to workforce readiness, robot deployment, customer experience, governance and responsible adoption.', cta: <a className={styles.textLink} href="/enterprise">Discuss a Program</a> },
    ]} />
  </Section>
}

export function ProgramRobots() {
  return <Section title="Real robots. Transferable understanding." eyebrow="09 / Robots used in programs">
    <div className={styles.twoGrid}>
      {[
        { name: 'Unitree Go2 Pro', image: '/images/robots/unitree-go2-pro/shop-01.png', alt: 'Gray four-legged Unitree Go2 Pro robot.', copy: 'Explore movement, sensing, shared space and the difference between autonomy and human control.' },
        { name: 'Reachy Mini', image: '/images/robots/reachy-mini/hero.png', alt: 'White tabletop Reachy Mini robot with two antennas.', copy: 'Explore communication, expression, trust and how people read social robot behavior.' },
      ].map((robot) => <article key={robot.name}><div className={styles.robotImage}><Image src={robot.image} alt={robot.alt} fill sizes="(max-width: 767px) 100vw, 50vw" /></div><h3>{robot.name}</h3><p>{robot.copy}</p></article>)}
    </div>
    <div className={styles.bring}><h3>Hardware-agnostic by design</h3><p className={styles.intro}>The Robot Age’s Robot Literacy framework is hardware-agnostic and can be applied across humanoids, quadrupeds, social robots, autonomous mobile robots, cobots and emerging robotic systems.</p></div>
  </Section>
}

export function FrameworkEvolution() {
  return <Section title="Robot Literacy will evolve as robots evolve." eyebrow="10 / An evolving framework">
    <div className={styles.twoGrid}><p>Capabilities, regulations, social norms and human relationships with robots are changing. The Robot Age is developing this framework as a shared foundation that can be questioned, tested and refined.</p>
      <div><p>We will continue learning through education, observation, research, Live Robot Labs, real-world deployments and public discussion—and through collaboration with educators and robotics organizations.</p><PartnershipLink>Contribute to the Framework ↗</PartnershipLink></div>
    </div>
  </Section>
}

export function LiteracyFAQ() {
  return <Section title="Questions about Robot Literacy" eyebrow="13 / Frequently asked questions"><div className={styles.faq}>
    {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
  </div></Section>
}

export function LiteracyClosing() {
  return <section className={`${styles.section} ${styles.dark}`}><div className={styles.container}>
    <p className={styles.eyebrow}>14 / The next literacy</p>
    <div className={local.closingPrelude}><p>We learned how to use computers.</p><p>We learned how to navigate the internet.</p><p>We are learning how to work with AI.</p></div>
    <h2>Now we need to learn how to live with robots.</h2>
    <p className={styles.intro}>The Robot Age’s Robot Literacy framework prepares people not simply to use robots, but to understand them, interact with them responsibly and make informed decisions about the role they should play in our world.</p>
    <LiteracyActions />
    <div className={styles.brand}><p>INTERPRET → RELATE → COEXIST</p><p>Preparing people and organizations for a world with robots.</p></div>
  </div></section>
}

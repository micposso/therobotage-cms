import { pageMetadata } from '@/lib/i18n/page-metadata'
import { contentHref } from '@/lib/i18n/localize'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import PageHero from '@/components/PageHero/PageHero'
import VerticalStackedCards from '@/components/VerticalStackedCards/VerticalStackedCards'
import { Section } from '@/app/(english)/live-robot-lab/Sections'
import RobotLiteracyVideo from '../RobotLiteracyVideo'
import PartnerInquiryForm from './PartnerInquiryForm'
import styles from '@/app/(english)/live-robot-lab/live-robot-lab.module.css'
import local from '../robot-literacy.module.css'

const title = 'Robot Literacy Partners | The Robot Age'
const description = 'Partner with The Robot Age to advance Robot Literacy through robotics education, human-robot interaction research, workshops, demonstrations, and real-world collaboration.'

const baseMetadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/robot-literacy/partners' },
  openGraph: {
    title,
    description,
    url: '/robot-literacy/partners',
    images: [{ url: '/images/home.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/home.png'],
  },
}

const frameworkAreas = [
  {
    title: 'INTERPRET',
    scale: 'Understand robot capability',
    image: '/images/signal-icon.png',
    description: 'Help people understand what robots can perceive, decide, record, communicate, and accomplish - as well as where their limitations begin.',
  },
  {
    title: 'RELATE',
    scale: 'Understand human-robot interaction',
    image: '/images/heart.png',
    description: 'Explore trust, behavior, expectations, human intervention, responsibility, attachment, and communication between people and robots.',
  },
  {
    title: 'COEXIST',
    scale: 'Understand robots in society',
    image: '/images/human.png',
    description: 'Study how robots affect workplaces, schools, healthcare, accessibility, privacy, policy, culture, and everyday life.',
  },
] as const

const partnershipTypes = [
  {
    title: 'Supporter',
    eyebrow: '01 / Supporter',
    bestFor: 'Organizations that want to contribute expertise and support Robot Literacy education.',
    contributions: ['Expert interviews', 'Educational materials', 'Technical guidance', 'Guest speakers', 'Industry perspectives', 'Curriculum review'],
    benefits: ['Recognition as a Robot Literacy Supporter', 'Visibility across relevant educational initiatives', 'Opportunities to contribute expertise', 'Access to emerging Robot Literacy research and findings'],
    cta: 'Become a Supporter',
  },
  {
    title: 'Research Partner',
    eyebrow: '02 / Research Partner',
    bestFor: 'Organizations interested in understanding how real people perceive and interact with robots.',
    contributions: ['Access to robots or robotic systems', 'Participation in user studies', 'HRI research collaboration', 'Employee or customer research', 'Research questions and hypotheses', 'Subject-matter experts'],
    benefits: ['Structured human-robot interaction observations', 'Participant feedback', 'Research collaboration', 'Workshop findings', 'Opportunities to test assumptions with non-roboticists'],
    cta: 'Explore Research Partnerships',
  },
  {
    title: 'Robot Partner',
    eyebrow: '03 / Robot Partner',
    bestFor: 'Robot companies that want their systems used in education, research, demonstrations, and public engagement.',
    contributions: ['Loaner robots', 'Demo units', 'Short-term robot access', 'Hardware sponsorship', 'Developer access', 'Technical support'],
    benefits: ['Real-world interaction with diverse audiences', 'Educational demonstrations', 'Structured participant observations', 'Feedback on perception, usability, trust, and expectations', 'Inclusion in selected Robot Literacy workshops and research initiatives'],
    cta: 'Become a Robot Partner',
  },
  {
    title: 'Founding Partner',
    eyebrow: '04 / Founding Partner',
    bestFor: 'Organizations that want to help shape the Robot Literacy Program as it grows.',
    contributions: ['Ongoing collaboration', 'Robots or technology access', 'Research participation', 'Curriculum development', 'Workshops and events', 'Strategic expertise', 'Financial or in-kind support'],
    benefits: ['Founding Partner recognition', 'Early collaboration on Robot Literacy initiatives', 'Opportunities to co-develop educational and research programs', 'Priority participation in workshops, studies, and reports', 'Direct collaboration with The Robot Age'],
    cta: 'Discuss a Founding Partnership',
    featured: true,
  },
] as const satisfies readonly {
  title: string
  eyebrow: string
  bestFor: string
  contributions: readonly string[]
  benefits: readonly string[]
  cta: string
  featured?: boolean
}[]

const studyQuestions = [
  'Do people understand what a robot can actually see?',
  'Can users tell when a robot is autonomous or being controlled by a person?',
  'When do people trust a robot too much?',
  'What happens when a robot fails unexpectedly?',
  'How should robots communicate uncertainty?',
  'How do children, workers, patients, and older adults respond differently to robots?',
  'When does anthropomorphism help - and when does it create unrealistic expectations?',
  'What privacy concerns appear when robots enter shared spaces?',
  'How should workers be prepared before robots become their coworkers?',
  'What new policies, responsibilities, and social norms will organizations need?',
] as const

export async function generateMetadata({ params }: { params: Promise<{ locale?: Locale }> }): Promise<Metadata> {
  const { locale = 'en' } = await params
  return pageMetadata(baseMetadata, '/robot-literacy/partners', locale)
}

export default async function RobotLiteracyPartnersPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const resolveHref = (url: string) => contentHref(url, locale)
  return (
    <>
      <a className={styles.skipLink} href="#partners-main">{t("Skip to content")}</a>
      <div className={styles.navigation}><Nav pinned /></div>
      <main id="partners-main" tabIndex={-1} className={`${styles.page} ${local.page}`}>
        <PageHero
          eyebrow={t("ROBOT LITERACY PARTNERS")}
          title={t("Help prepare people for a world with robots.")}
          subtitle={t("Robot Literacy brings robotics companies, educators, researchers, and communities together to understand how people perceive, trust, use, and coexist with intelligent machines.")}
          imageSrc="/images/society-family-sm.png"
        >
          <div className={local.heroBody}>
            <p>{t("We are building a network of partners who want to help move robotics beyond technical capability and toward successful human adoption.")}</p>
          </div>
          <div className={styles.actions}>
            <a className={styles.button} href="#partner-inquiry">{t("Become a Partner")}</a>
            <Link className={styles.textLink} href={resolveHref("/robot-literacy")}>{t("Explore Robot Literacy")}</Link>
          </div>
        </PageHero>

        <section className={styles.section} aria-label={t("Robot Literacy partner video")}>
          <div className={styles.container}>
            <RobotLiteracyVideo />
          </div>
        </section>

        <Section title={t("Building robots is only part of the challenge.")} eyebrow={t("Why partner")}>
          <p className={styles.intro}>{t("As robots move into workplaces, schools, healthcare environments, homes, and public spaces, people need to understand what these systems can do, what they cannot do, and how to interact with them responsibly.")}</p>
          <p className={styles.intro}>{t("The Robot Literacy Program creates opportunities to study these questions with real people and real robots. Partners can participate in education, field research, demonstrations, curriculum development, workshops, and public engagement.")}</p>
          <ol className={local.progression} aria-label={t("Robot Literacy partner framework areas")}>
            {frameworkAreas.map((area) => (
              <li key={area.title}>
                <a href="#partner-inquiry">
                  <strong>{t(area.title ?? '')}</strong>
                  <span>{t(area.scale ?? '')}</span>
                  <div className={local.progressionImage}>
                    <Image src={area.image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" />
                  </div>
                  <p className={local.progressionDescription}>{t(area.description ?? '')}</p>
                </a>
              </li>
            ))}
          </ol>
        </Section>

        <Section title={t("Ways to partner")} eyebrow={t("Partnership types")}>
          <p className={styles.intro}>{t("Organizations can participate at different levels depending on their goals, resources, and interest in Robot Literacy.")}</p>
          <div>
            {partnershipTypes.map((type) => (
              <article key={type.title} className={`${styles.card} ${styles.twoGrid} ${'featured' in type && type.featured ? local.featuredPartnerCard : ''}`}>
                <div>
                  <p className={styles.eyebrow}>{t(type.eyebrow ?? '')}</p>
                  <h3>{t(type.title ?? '')}</h3>
                  <p>{t(type.bestFor ?? '')}</p>
                </div>
                <div className={local.partnerCardContent}>
                  <div>
                    <p className={styles.eyebrow}>{t("Possible contributions")}</p>
                    <ul className={styles.list}>{type.contributions.map((item) => <li key={item}>{t(item ?? '')}</li>)}</ul>
                  </div>
                  <div>
                    <p className={styles.eyebrow}>{t("Partner benefits")}</p>
                    <ul className={styles.list}>{type.benefits.map((item) => <li key={item}>{t(item ?? '')}</li>)}</ul>
                  </div>
                  <div className={styles.actions}><a className={styles.button} href="#partner-inquiry">{t(type.cta ?? '')}</a></div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section title={t("Questions the robotics industry needs humans to answer.")} eyebrow={t("What partners can help us study")} dark>
          <div className={local.questionGrid}>
            {studyQuestions.map((question, index) => (
              <article className={local.questionCard} key={question}>
                <p className={styles.eyebrow}>{t(String(index + 1).padStart(2, '0'))}</p>
                <h3>{t(question ?? '')}</h3>
              </article>
            ))}
          </div>
          <p className={styles.intro}>{t("Robot Literacy partners can help us turn these questions into structured educational activities, field studies, workshops, and research.")}</p>
        </Section>

        <Section title={t("Real environments. Real people. Real robots.")} eyebrow={t("Where we work")}>
          <div className={styles.fourGrid}>
            {[
              ['Higher Education', 'Workshops, research collaboration, student programs, design and engineering education.'],
              ['K-12 Education', 'Age-appropriate Robot Literacy experiences focused on understanding and interacting with robots rather than programming them.'],
              ['Professional & Enterprise', 'Workshops for organizations preparing employees, teams, and leaders for robotic systems in the workplace.'],
              ['Research & Public Engagement', 'Field studies, demonstrations, community events, and human-robot interaction research.'],
            ].map(([heading, copy]) => (
              <article className={styles.card} key={heading}>
                <h3>{t(heading)}</h3>
                <p>{t(copy)}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section title={t("Start small. Learn together.")} eyebrow={t("How a partnership works")}>
          <VerticalStackedCards locale={locale} cards={[
            { title: 'Conversation', eyebrow: 'STEP 1', description: 'We learn about your robots, research questions, educational goals, or areas of interest.' },
            { title: 'Define an experiment or program', eyebrow: 'STEP 2', description: 'Together we identify a workshop, study, demonstration, curriculum contribution, or other useful collaboration.' },
            { title: 'Engage real participants', eyebrow: 'STEP 3', description: 'The Robot Age brings the technology into appropriate educational, research, professional, or public environments.' },
            { title: 'Share what we learn', eyebrow: 'STEP 4', description: 'Partners receive observations, participant feedback, findings, or other agreed-upon outputs from the collaboration.' },
          ]} />
          <p className={styles.meta}>{t("Partnerships can begin with a single interview or demonstration. They do not require a large sponsorship commitment.")}</p>
        </Section>

        <Section id="partner-inquiry" title={t("Become a Robot Literacy Partner")} eyebrow={t("Partner inquiry")}>
          <p className={styles.intro}>{t("Tell us about your organization and how you would like to participate.")}</p>
          <PartnerInquiryForm />
        </Section>

        <Section title={t("The next robotics challenge is human adoption.")} eyebrow={t("Robot Literacy partners")} dark>
          <p className={styles.intro}>{t("Robotics companies are solving increasingly difficult technical problems.")}</p>
          <p className={styles.intro}>{t("Robot Literacy focuses on the other side of the equation: helping people understand, trust, use, question, and coexist with the systems entering their lives.")}</p>
          <div className={styles.actions}>
            <a href="#partner-inquiry" className={styles.button}>{t("Become a Robot Literacy Partner")}</a>
            <Link href={resolveHref("/robot-literacy")} className={styles.textLink}>{t("Learn about the Robot Literacy framework")}</Link>
          </div>
          <div className={styles.brand}>
            <p>{t("THE ROBOT AGE")}</p>
            <p>{t("Robot Literacy - Robotics Education - Human-Robot Interaction")}</p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}

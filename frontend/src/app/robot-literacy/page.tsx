import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import VerticalStackedCards from '@/components/VerticalStackedCards/VerticalStackedCards'
import MediaPlaceholder from '@/components/MediaPlaceholder/MediaPlaceholder'
import { Section } from '@/app/live-robot-lab/Sections'
import { concepts, faqs, framework, partners, robotPlatforms } from './content'
import { PartnershipLink, RobotLiteracyAudienceSelector, RobotUseCaseExplorer } from './Interactive'
import { RobotLiteracyFramework, RobotLiteracyJourney, RobotLiteracyModuleAccordion } from './Sections'
import RobotLiteracyRequestForm from './RobotLiteracyRequestForm'
import styles from '@/app/live-robot-lab/live-robot-lab.module.css'

const title = 'Robot Literacy | The Robot Age'
const description = 'Learn how robots perceive, decide, move and interact with people. The Robot Age Robot Literacy framework prepares students, educators, professionals and organizations for embodied AI.'
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: '/robot-literacy' },
  openGraph: { title, description, url: '/robot-literacy', images: [{ url: '/images/home.png', alt: 'The Robot Age' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/images/home.png'] },
}

export default function RobotLiteracyPage() {
  return <>
    <a className={styles.skipLink} href="#literacy-main">Skip to content</a>
    <div className={styles.navigation}><Nav pinned /></div>
    <main id="literacy-main" tabIndex={-1} className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <p className={styles.eyebrow}>THE ROBOT AGE</p>
            <h1>Robot Literacy</h1>
            <p className={styles.lead}>Robots are moving out of laboratories and into workplaces, schools, public spaces, homes and businesses.</p>
            <p className={styles.meta}>Robot Literacy is the ability to understand how robots perceive, make decisions, interact with people, and operate in the real world.</p>
            <p className={styles.meta}>The Robot Age is developing an educational framework for students, educators, professionals and organizations preparing for a world of embodied AI.</p>
            <div className={styles.actions}>
              <a className={styles.button} href="#framework">Explore the Framework <span aria-hidden="true">↓</span></a>
              <a className={styles.textLink} href="#inquiry">Bring Robot Literacy to Your Organization</a>
            </div>
          </div>
          <MediaPlaceholder label="ROBOT LITERACY INTRO VIDEO" video />
        </div>
      </section>

      <Section title="AI is leaving the screen." eyebrow="01 / Why Robot Literacy">
        <p className={styles.intro}>Most AI literacy programs focus on software, prompts and digital systems. Robots introduce a different set of questions because intelligent systems can now perceive, move and act in physical environments.</p>
        <VerticalStackedCards cards={concepts.map((concept, index) => ({ ...concept, eyebrow: `0${index + 1}` }))} />
      </Section>

      <Section title="Find your Robot Literacy pathway." eyebrow="02 / Who it’s for">
        <RobotLiteracyAudienceSelector />
      </Section>

      <Section id="framework" title="The Robot Literacy Framework" eyebrow="03 / Six dimensions of understanding">
        <p className={styles.intro}>Robot Literacy combines technical understanding, human interaction, critical evaluation and real-world application.</p>
        <RobotLiteracyFramework dimensions={framework} />
      </Section>

      <Section title="From understanding robots to applying them." eyebrow="04 / What you learn">
        <p className={styles.intro}>Each Robot Literacy module combines concepts, questions, observation and an applied deliverable.</p>
        <RobotLiteracyModuleAccordion />
      </Section>

      <Section title="Robot Literacy becomes useful when robots enter real environments." eyebrow="05 / Real-world use cases">
        <RobotUseCaseExplorer />
      </Section>

      <Section title="Learn Robot Literacy in different ways." eyebrow="06 / Learning formats">
        <VerticalStackedCards cards={[
          { title: 'Robot Literacy Series', description: 'Free educational videos, articles and learning resources.', cta: <a className={styles.textLink} href="/robotics-literacy">Explore the Series <span aria-hidden="true">↗</span></a> },
          { title: 'Live Robot Lab', description: 'Hands-on sessions where participants interact with real robots and explore perception, movement, autonomy and human-robot interaction.', cta: <a className={styles.textLink} href="/live-robot-lab">Explore Live Robot Lab <span aria-hidden="true">↗</span></a> },
          { title: 'Workshops & Training', description: 'Programs for schools, universities, organizations and professional teams.', cta: <a className={styles.textLink} href="#inquiry">Request Information</a> },
          { title: 'Curriculum Partnerships', description: 'Collaborate with The Robot Age on robotics education, curriculum development, research and public literacy initiatives.', cta: <PartnershipLink>Become a Partner</PartnershipLink> },
        ]} />
      </Section>

      <Section title="Robot Literacy should include real robots." eyebrow="07 / Hands-on robots">
        <p className={styles.intro}>Understanding robotics changes when learners can see perception, movement, autonomy and interaction happening in front of them.</p>
        <VerticalStackedCards cards={robotPlatforms.map((robot) => ({ ...robot, media: <MediaPlaceholder label={robot.label} /> }))} />
      </Section>

      <Section title="A progression from awareness to application." eyebrow="08 / The learning journey" dark>
        <RobotLiteracyJourney />
      </Section>

      <Section title="Help build Robot Literacy." eyebrow="09 / Partnerships">
        <div className={styles.twoGrid}>
          <div>
            <p className={styles.intro}>The Robot Age is working with educators, technologists, robotics companies and organizations interested in preparing people for increasingly capable physical AI systems.</p>
            <PartnershipLink>Discuss a Partnership</PartnershipLink>
          </div>
          <MediaPlaceholder label="ROBOT LITERACY PARTNERSHIP / WORKSHOP IMAGE" />
        </div>
        <VerticalStackedCards cards={partners.map(([title, description]) => ({ title, description }))} />
      </Section>

      <Section id="inquiry" title="Bring Robot Literacy to your organization." eyebrow="10 / Start a conversation">
        <p className={styles.intro}>Tell us what you&apos;re exploring. We can discuss educational programs, workshops, Live Robot Labs, curriculum partnerships and organizational training.</p>
        <RobotLiteracyRequestForm />
      </Section>

      <Section title="Frequently asked questions" eyebrow="11 / More about the program">
        <div className={styles.faq}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </Section>

      <Section title="The next generation of AI won’t only answer questions." dark>
        <p className={styles.subheading}>It will move through the world.</p>
        <p className={styles.intro}>Robot Literacy helps people understand what happens when intelligence becomes physical.</p>
        <div className={styles.actions}>
          <a className={styles.button} href="#framework">Explore Robot Literacy <span aria-hidden="true">↑</span></a>
          <a className={styles.textLink} href="#inquiry">Bring Robot Literacy to Your Organization</a>
        </div>
      </Section>
    </main>
    <Footer />
  </>
}

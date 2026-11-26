import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import PageHero from '@/components/PageHero/PageHero'
import Image from '@/components/MediaImage'
import { academyPrograms, rpdpIndependentHours, rpdpLearningHours, rpdpLiveHours, rpdpModules, rpdpProgram } from '@/lib/certifications'
import { imageAsset, imageUrl } from '@/lib/image-assets'
import { contentHref } from '@/lib/i18n/localize'
import { uiText } from '@/lib/i18n/messages'
import { pageMetadata } from '@/lib/i18n/page-metadata'
import type { Locale } from '@/lib/i18n/routing'
import { rpdpInvitation, type RpdpQuery } from '@/lib/rpdp-registration'
import AboutInstructor from '@/components/AboutInstructor/AboutInstructor'
import { michaelBioPath, michaelLinkedIn } from '@/lib/michael-posso'
import { siteOverview } from '@/lib/site'
import certification from '@/components/Certification/Certification.module.css'
import academy from '../learn.module.css'
import credential from './CredentialPage.module.css'
import styles from './RpdpPage.module.css'
import policy from '../../policy/policy.module.css'
import { rpdpCopy as copy } from './rpdp-content'
import RpdpInteractions, { AnimatedMetric } from './RpdpInteractions'
import { RpdpOfferFaqCopy, RpdpOfferPanel, RpdpOfferState, RpdpSignupLink } from './RpdpOffer'
import learningPhoto from '../../../../../public/images/academy/rpdp-feature.webp'
import storyboardPhoto from '../../../../../public/images/academy/rpdp-storyboard.webp'

const program = academyPrograms[0]
const sectionPhotoSizes = '(max-width: 767px) 92vw, (max-width: 991px) 33vw, (max-width: 1440px) calc(35vw - 140px), 364px'
const bannerPath = '/images/academy/rpdp-humanoid-inspection.webp'
const heroImages = [
  bannerPath,
  '/images/academy/rpdp-doorway.webp',
  '/images/academy/rpdp-feature.webp',
  '/images/academy/rpdp-program.webp',
  '/images/academy/rpdp-storyboard.webp',
].map(path => imageUrl(path))
const bannerAlt = 'A designer inspects a humanoid robot’s wrist as the robot looks toward him.'
const route = '/learn/rpdp'
const assessmentWeights = [20, 25, 25, 15, 15]
const toolLogos = [
  ['OpenAI', 'openai.png'],
  ['NVIDIA Isaac Sim', 'nvidia.png'],
  ['Figma', 'figma.png'],
  ['ElevenLabs', 'elevenlabs-wordmark.svg'],
  ['MuJoCo', 'mujoco.png'],
  ['Blender', 'blender.png'],
] as const

export function rpdpMetadata(locale: Locale) {
  const title = `${rpdpProgram.name} (${rpdpProgram.program}) | TheRobotAge Academy`
  const description = program.description
  const image = imageUrl(bannerPath)
  return pageMetadata({
    title: { absolute: title }, description,
    openGraph: { title, description, images: [{ url: image, alt: uiText(bannerAlt, locale) }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }, route, locale)
}

function Section({ title, id, intro, headingList, image, children }: {
  title: ReactNode; id?: string; intro?: string | string[]; headingList?: ReactNode; image?: ReactNode; children: ReactNode
}) {
  return <section id={id} className={academy.section}>
    <div className={styles.sectionColumns}>
      <header className={styles.sectionHeading}>
        <h2 className={certification.headline}>{title}</h2>
        {intro && (Array.isArray(intro) ? intro : [intro]).map(paragraph =>
          <p key={paragraph} className={credential.overviewText}>{paragraph}</p>
        )}
        {headingList}
      </header>
      <div>{image ?? children}</div>
    </div>
    {image && children}
  </section>
}

function FeatureGrid({ items, locale }: { items: readonly (readonly [string, string])[]; locale: Locale }) {
  return <div className={styles.features}>
    {items.map(([title, body]) => <article key={title} className={`${academy.stack} ${styles.feature}`}>
      <h3 className={certification.courseTitle}>{uiText(title, locale)}</h3>
      <p className={certification.trackDescription}>{uiText(body, locale)}</p>
    </article>)}
  </div>
}

function emphasizeText(text: string) {
  return text.split('**').map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  )
}

function Caret() {
  return <svg className={styles.caret} aria-hidden="true" width="12" height="16" viewBox="0 0 12 16">
    <path d="m3 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
}

function TextList({ items, locale }: { items: readonly string[]; locale: Locale }) {
  return <ul className={styles.caretList} role="list">
    {items.map(item => <li key={item}>
      <Caret />
      {uiText(item, locale)}
    </li>)}
  </ul>
}

export default function RpdpPage({ locale, query, active }: { locale: Locale; query: RpdpQuery; active: boolean }) {
  const t = (text: string) => uiText(text, locale)
  const href = (path: string) => contentHref(path, locale)
  const intlLocale = locale === 'es' ? 'es-US' : 'en-US'
  const percent = new Intl.NumberFormat(intlLocale, { style: 'percent' })
  const weeklyTime = t('One {live}-hour live session and about {independent} hours of independent work each week.')
    .replace('{live}', new Intl.NumberFormat(intlLocale).format(rpdpProgram.weeklyLiveHours))
    .replace('{independent}', String(rpdpProgram.weeklyIndependentHours))
  const feedback = t(copy.feedback)
    .replace('{weeks}', new Intl.ListFormat(intlLocale).format(rpdpProgram.milestoneWeeks.map(String)))
    .replace('{final}', String(rpdpProgram.weeks))
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${t(program.name)} (${rpdpProgram.program})`,
    courseCode: `${rpdpProgram.program} v${rpdpProgram.version}`,
    url: new URL(href(route), siteOverview.url).href,
    description: t(program.description),
    provider: { '@type': 'Organization', name: 'TheRobotAge', url: siteOverview.url },
    educationalCredentialAwarded: t('RPDP educational completion credential'),
    timeRequired: `PT${rpdpLearningHours}H`,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      name: t(rpdpProgram.targetStart),
      courseMode: t(rpdpProgram.format),
      duration: `P${rpdpProgram.weeks}W`,
      courseWorkload: weeklyTime,
    },
  }

  return <>
    <Nav pinned />
    <main id="rpdp-program" className={styles.page}>
      <RpdpOfferState active={active}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(course).replace(/</g, '\\u003c') }} />
      <PageHero eyebrow={<><strong>{t(rpdpProgram.name)}</strong> ({rpdpProgram.program})</>}
        title={locale === 'en' ? <>Design how people<br />{' '}interact with robots.</> : t(copy.title)}
        subtitle={t(copy.intro)}
        images={heroImages} backgroundSlides={{ firstSlideAlt: t(bannerAlt) }}
        imageWrapClassName={`${certification.trackImage} ${styles.heroImage}`}>
        <div className={styles.heroDetails}>
          <p className={credential.overviewText}>{t(program.overview)}</p>
          <ul className={`${credential.pills} ${styles.badges}`}>
            {[`${rpdpProgram.weeks} weeks`, `${rpdpLearningHours} hours`, program.format, rpdpProgram.targetStart, 'No robotics programming required', 'Portfolio capstone'].map(item =>
              <li key={item} className={credential.pill}>{t(item)}</li>)}
          </ul>
          <div className={certification.courseCardBottom}>
            <RpdpSignupLink locale={locale} placement="hero" />
            <a className={certification.headerCta} href="#curriculum">{t('Explore Curriculum')}</a>
          </div>
        </div>
      </PageHero>

      <div className={`${academy.container} ${styles.columns}`}>
        <RpdpOfferPanel locale={locale} source={href(route)} query={query} />

        <div className={styles.content}>
          <Section title={t('Why learn product design for robots now?')} id="why-robotics-now">
            <div className={`${policy.overview} ${styles.curriculumHours}`}>
              {([
                ['U.S. robotics and physical AI companies', '281+', 'https://roboticsmap.ai/country/united-states'],
                ['Raised by robotics and physical AI startups in Q2 2026', '$18.6B', 'https://pitchbook.com/news/reports/q2-2026-robotics-physical-ai-report-the-money-is-in-the-motion'],
                ['Job and internship postings on RoboticsCareer.org in 2025', '1,500+', 'https://www.sme.org/globalassets/fusion/events/tux-recap/presentations/2025/growing-an-advanced-manufacturing-workforce-with-manufacturingusa-institutes.pdf'],
                ['“US humanoid robot production could hit 400,000 by 2030” — Reuters on J.P. Morgan', '400,000', 'https://www.investing.com/news/stock-market-news/us-humanoid-robot-production-could-hit-400000-by-2030-as-deployment-ramps-jp-morgan-says-5020778'],
              ] as const).map(([label, value, source]) => (
                <dl key={label} className={`${policy.overviewMetric} ${policy.overviewHighlight}`}>
                  <dt><a href={source}>{t(label)}</a></dt>
                  <dd><AnimatedMetric value={t(value)} locale={locale} /></dd>
                </dl>
              ))}
            </div>
            <div className={styles.marketCopy}>
              <p className={credential.overviewText}>{emphasizeText(t('If you work in **UX, research, or product management**, robotics is a field where you can apply the skills you already have. Alongside mechanical and software engineers, robotics teams need researchers who understand how people work, designers who make a robot’s actions easy to interpret, and product managers who decide which tasks a robot should handle and when a person should take over.'))}</p>
              <p className={credential.overviewText}>{emphasizeText(t('In the U.S. alone, **at least 282 companies** work in robotics and physical AI, from designing hospital delivery robots to training robots for factory tasks and deploying fleets in warehouses. Worldwide, startups in the field raised **$18.6 billion** in the second quarter of 2026.'))}</p>
              <p className={credential.overviewText}>{t('In TheRobotAge’s eight-week Robotics Product Design Practitioner (RPDP) program, you’ll design and test how people interact with a robot and turn that work into a portfolio case study.')}</p>
              <p className={styles.marketClosing}><strong>{t('The opportunity to break into this emerging industry is now.')}</strong></p>
            </div>
          </Section>
          <Section title={t(copy.audienceTitle)} headingList={<TextList items={copy.audienceRoles} locale={locale} />}>
            <p className={credential.overviewText}>{t(copy.experience)}</p>
            <p className={credential.overviewText}>{t(copy.programApproach)}</p>
          </Section>
          <Section title={t('How the program works')}>
            <ul className={styles.caretList} role="list">
              {[t('RPDP is an assessed certificate program. You develop one case study throughout the program.'),
                weeklyTime, feedback, t(copy.delivery)].map(item => (
                <li key={item}><Caret />{item}</li>
              ))}
            </ul>
          </Section>
          <Section id="what-you-will-learn" title={t(copy.skillsTitle)} intro={t(copy.skillsIntro)}
            image={
              <Image src={imageAsset('/images/academy/rpdp-feature.webp', learningPhoto)}
                alt="" className={styles.sectionPhoto} placeholder="blur" loading="lazy"
                sizes={sectionPhotoSizes} />
            }>
            <FeatureGrid items={copy.skills} locale={locale} />
          </Section>
          <Section title={t('Eight-week curriculum')} id="curriculum" intro={`${rpdpProgram.program} v${rpdpProgram.version}`}>
            <div className={`${policy.overview} ${styles.curriculumHours}`}>
              {([
                ['Learning hours', rpdpLearningHours],
                ['Hours of live instruction', rpdpLiveHours],
                ['Hours of independent study', rpdpIndependentHours],
              ] as const).map(([label, hours]) => <dl key={label} className={`${policy.overviewMetric} ${policy.overviewHighlight}`}>
                <dt>{t(label)}</dt><dd><AnimatedMetric value={String(hours)} locale={locale} /></dd>
              </dl>)}
            </div>
            <div className={credential.moduleList}>
              {rpdpModules.map(module => <details key={module.number} data-rpdp-week={module.number} className={styles.module}>
                <summary>
                  <span className={`${credential.moduleTitle} ${styles.weekLabel}`}>
                    {t('Week')} {module.number} <span aria-hidden="true">|</span>
                  </span>
                  <span className={credential.moduleTitle}>{t(module.title)}</span>
                  <Caret />
                </summary>
                <div className={styles.moduleBody}>
                  <p>{t(module.description)}</p>
                  <dl>
                    {[
                      ['Topics', module.topics], ['Tools', module.tools],
                      ['Weekly deliverable', module.deliverable], ['Time allocation', weeklyTime],
                    ].map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}
                  </dl>
                </div>
              </details>)}
            </div>
            <a className={certification.headerCta} href="#capstone" data-rpdp-capstone>{t('Explore the capstone')}</a>
          </Section>
          <Section title={locale === 'en' ? <>Build a robotics<br />{' '}product experience for your portfolio.</> : t(copy.capstoneTitle)} id="capstone" intro={t(copy.capstone)}
            image={
              <Image src={imageAsset('/images/academy/rpdp-storyboard.webp', storyboardPhoto)}
                alt={t('A designer reviews three sketches of a delivery robot approaching a crate, stopping, and flashing an amber light as a person reaches for the crate.')}
                className={styles.sectionPhoto} placeholder="blur" loading="lazy"
                sizes={sectionPhotoSizes} />
            }>
            <FeatureGrid items={copy.tracks} locale={locale} />
            <section className={styles.deliverables} aria-labelledby="final-deliverables">
              <h3 id="final-deliverables" className={certification.courseTitle}>{t('Final deliverables')}</h3>
              <div className={styles.deliverableColumns}>
                <TextList items={copy.finalDeliverables} locale={locale} />
                <div>
                  <p className={credential.overviewText}><strong>{t(copy.capstoneRequirements)}</strong></p>
                  <p className={credential.overviewText}><strong>{t(copy.hardware)}</strong></p>
                </div>
              </div>
            </section>
          </Section>
          <Section id="tools-and-technology" title={t('Tools and technology')} headingList={<TextList items={toolLogos.map(([name]) => name)} locale={locale} />} intro={[t(copy.prototype), t(copy.simulator)]}>
            <ul className={styles.toolGrid} role="list">
              {toolLogos.map(([name, file]) => (
                <li key={name} className={styles.toolLogo}>
                  <Image src={`/logos/${file}`} alt={name} title={name} unoptimized
                    className={name === 'ElevenLabs' ? styles.wordmark : undefined}
                    width={name === 'ElevenLabs' ? 694 : 48}
                    height={name === 'ElevenLabs' ? 90 : 48}
                    sizes={name === 'ElevenLabs' ? '84px' : '48px'} />
                </li>
              ))}
            </ul>
          </Section>
          <Section id="career-paths" title={t(copy.careerTitle)}>
            <FeatureGrid items={copy.careers} locale={locale} />
            <Link className={`${certification.headerCta} ${styles.jobsButton}`} href={href('/jobs')} target="_blank" rel="noopener noreferrer">
              {t('Explore jobs in robotics')}
            </Link>
          </Section>
          <Section title={t(copy.credentialTitle)} intro={t(copy.credential)}>
            <h3 className={certification.courseTitle}>{t('Assessment model')}</h3>
            <dl className={credential.specCard}>
              {copy.assessment.map((criterion, index) => <div className={styles.assessmentRow} key={criterion}>
                <dt>{t(criterion)}</dt>
                <dd>{percent.format(assessmentWeights[index] / 100)}</dd>
              </div>)}
            </dl>
          </Section>
          <Section id="completion-requirements" title={t('Completion requirements')}>
            <TextList items={copy.completion} locale={locale} />
            <p className={credential.overviewText}>{t(copy.disclaimer)}</p>
          </Section>
          <AboutInstructor profile={copy.instructor} compact>
            <Link href={href(michaelBioPath)} className={certification.headerCta}>{t('Read Michael’s full bio')}</Link>
            <a href={michaelLinkedIn} className={certification.headerCta}>{t('Michael on LinkedIn')}</a>
          </AboutInstructor>
          <Section id="faq" title={t('Frequently asked questions')}>
            {([
              ['Who is the program designed for?', `${t(program.audience)} ${t(copy.experience)}`],
              ['Do I need robotics or programming experience?', t('No prior robotics or programming experience is required.')],
              ['Do I need to own a robot?', t(copy.hardware)],
              ['What will I produce?', t(program.overview)],
              ['How much time should I plan each week?', weeklyTime],
              ['What individual feedback is included?', feedback],
              ['What does joining the founding list secure?', <RpdpOfferFaqCopy key="offer" locale={locale} part="answer" />],
              ['When will the schedule and tool requirements be confirmed?', t(rpdpInvitation)],
              ['What credential will I receive?', t(copy.credential)],
            ] as const).map(([question, answer]) => <details key={question} className={`${styles.module} ${styles.faq}`}>
              <summary><span className={credential.moduleTitle}>{question === 'What does joining the founding list secure?'
                ? <RpdpOfferFaqCopy locale={locale} part="question" /> : t(question)}</span>
                <Caret />
              </summary>
              <div className={styles.moduleBody}>{typeof answer === 'string' ? <p>{answer}</p> : answer}</div>
            </details>)}
          </Section>
          <Link className={credential.backLink} href={href('/learn')}>{t('← Back to Academy')}</Link>
        </div>
      </div>
      <RpdpInteractions locale={locale} />
      </RpdpOfferState>
    </main>
    <Footer />
  </>
}

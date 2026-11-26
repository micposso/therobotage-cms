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
import RpdpInteractions from './RpdpInteractions'
import { RpdpOfferFaqCopy, RpdpOfferPanel, RpdpOfferState, RpdpSignupLink } from './RpdpOffer'
import learningPhoto from '../../../../../public/images/academy/rpdp-feature.webp'
import storyboardPhoto from '../../../../../public/images/academy/rpdp-storyboard.webp'

const program = academyPrograms[0]
const sectionPhotoSizes = '(max-width: 767px) 92vw, (max-width: 991px) 33vw, (max-width: 1440px) calc(35vw - 140px), 364px'
const bannerPath = '/images/academy/rpdp-doorway.webp'
const heroImages = [
  bannerPath,
  '/images/academy/rpdp-humanoid-inspection.webp',
  '/images/academy/rpdp-feature.webp',
  '/images/academy/rpdp-program.webp',
  '/images/academy/rpdp-storyboard.webp',
].map(path => imageUrl(path))
const doorwayAlt = 'A designer crouches beside an open door to watch a wheeled service robot carrying a coffee carafe clear the door frame.'
const route = '/learn/rpdp'
const assessmentWeights = [20, 25, 25, 15, 15]
const tools = [
  ['Figma', <g stroke="none"><path fill="#f24e1e" d="M12 3H9a3 3 0 0 0 0 6h3z"/><path fill="#ff7262" d="M12 3h3a3 3 0 0 1 0 6h-3z"/><path fill="#a259ff" d="M12 9H9a3 3 0 0 0 0 6h3z"/><circle fill="#1abcfe" cx="15" cy="12" r="3"/><path fill="#0acf83" d="M12 15H9a3 3 0 1 0 3 3z"/></g>],
  ['FigJam', <path d="M4 4h16v10l-6 6H4z M14 20v-6h6 M7 9q2-4 4 0t4 0"/>],
  ['TheRobotAge RXD Framework', <path d="m12 3 9 5-9 5-9-5z M3 12l9 5 9-5 M3 16l9 5 9-5"/>, '/rxd'],
  ['TheRobotAge RXD Scorecard', <path d="M5 3h14v18H5z M8 8l1 1 2-3 M13 8h3 M8 15l1 1 2-3 M13 15h3"/>, '/rxd-scorecard'],
  ['TheRobotAge Robot Policy Watch', <path d="m3 8 9-5 9 5z M6 11v6 M10 11v6 M14 11v6 M18 11v6 M3 20h18"/>, '/policy'],
  ['Browser-based robotics simulation', <path d="M2 4h20v16H2z M2 8h20 M8 12h8v5H8z M12 10v2 M10 14h.1 M14 14h.1"/>],
  ['Optional ElevenLabs voice prototyping', <path d="M8 4v16 M15 4v16" strokeWidth="3.5"/>],
  ['NIST AI RMF', <path d="m12 2 8 3v6q0 7-8 11-8-4-8-11V5z M8 11l3 3 5-6"/>, 'https://www.nist.gov/itl/ai-risk-management-framework'],
  ['Accessibility resources', <><circle cx="12" cy="5" r="2"/><path d="m4 9 8 2 8-2 M12 11v3 M12 14l-5 7 M12 14l5 7"/></>],
] as const

export function rpdpMetadata(locale: Locale) {
  const title = `${rpdpProgram.name} (${rpdpProgram.program}) | TheRobotAge Academy`
  const description = program.description
  const image = imageUrl(bannerPath)
  return pageMetadata({
    title: { absolute: title }, description,
    openGraph: { title, description, images: [{ url: image, alt: uiText(doorwayAlt, locale) }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }, route, locale)
}

function Section({ title, id, intro, image, children }: {
  title: string; id?: string; intro?: string | string[]; image?: ReactNode; children: ReactNode
}) {
  return <section id={id} className={academy.section}>
    <div className={styles.sectionColumns}>
      <header className={styles.sectionHeading}>
        <h2 className={certification.headline}>{title}</h2>
        {intro && (Array.isArray(intro) ? intro : [intro]).map(paragraph =>
          <p key={paragraph} className={credential.overviewText}>{paragraph}</p>
        )}
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
      <PageHero eyebrow={`${t(rpdpProgram.name)} (${rpdpProgram.program})`}
        title={locale === 'en' ? <>Design how people<br />{' '}interact with robots.</> : t(copy.title)}
        subtitle={t(copy.intro)}
        images={heroImages} backgroundSlides={{ firstSlideAlt: t(doorwayAlt) }}
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
          <Section title={t(copy.audienceTitle)}>
            <p className={credential.overviewText}><strong>{t(program.audience)}</strong></p>
            <p className={credential.overviewText}>{t(copy.experience)}</p>
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
                <dt>{t(label)}</dt><dd>{hours}</dd>
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
          <Section title={t(copy.capstoneTitle)} id="capstone" intro={t(copy.capstone)}
            image={
              <Image src={imageAsset('/images/academy/rpdp-storyboard.webp', storyboardPhoto)}
                alt={t('A designer reviews three sketches of a delivery robot approaching a crate, stopping, and flashing an amber light as a person reaches for the crate.')}
                className={styles.sectionPhoto} placeholder="blur" loading="lazy"
                sizes={sectionPhotoSizes} />
            }>
            <FeatureGrid items={copy.tracks} locale={locale} />
            <section className={styles.deliverables} aria-labelledby="final-deliverables">
              <h3 id="final-deliverables" className={certification.courseTitle}>{t('Final deliverables')}</h3>
              <TextList items={copy.finalDeliverables} locale={locale} />
              <p className={credential.overviewText}>{t(copy.capstoneRequirements)}</p>
              <p className={credential.overviewText}>{t(copy.hardware)}</p>
            </section>
          </Section>
          <Section id="tools-and-technology" title={t('Tools and technology')} intro={[t(copy.prototype), t(copy.simulator)]}>
            <ul className={styles.toolGrid} role="list">
              {tools.map(([name, symbol, url]) => {
                const label = t(name)
                const icon = <svg viewBox="-6 -6 36 36" role="img" aria-label={label} fill="none"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <title>{label}</title>{symbol}
                </svg>
                return <li key={name}>{url ? <Link href={href(url)} aria-label={label}>{icon}</Link> : icon}</li>
              })}
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

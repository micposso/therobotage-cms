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
import { siteOverview } from '@/lib/site'
import certification from '@/components/Certification/Certification.module.css'
import hero from '@/components/PageHero/PageHero.module.css'
import academy from '../learn.module.css'
import credential from './CredentialPage.module.css'
import styles from './RpdpPage.module.css'
import { rpdpCopy as copy } from './rpdp-content'
import RpdpInteractions from './RpdpInteractions'
import { RpdpOfferFaqCopy, RpdpOfferPanel, RpdpOfferState, RpdpSignupLink } from './RpdpOffer'
import doorwayPhoto from '../../../../../public/images/academy/rpdp-doorway.webp'
import storyboardPhoto from '../../../../../public/images/academy/rpdp-storyboard.webp'

const program = academyPrograms[0]
const bannerPath = '/images/academy/rpdp-doorway.webp'
const doorwayAlt = 'A designer crouches beside an open door to watch a wheeled service robot carrying a coffee carafe clear the door frame.'
const route = '/learn/rpdp'
const assessmentWeights = [20, 25, 25, 15, 15]
const tools = [
  ['Figma and FigJam'],
  ['TheRobotAge RXD Framework', '/rxd'],
  ['TheRobotAge RXD Scorecard', '/rxd-scorecard'],
  ['TheRobotAge Robot Policy Watch', '/policy'],
  ['Browser-based robotics simulation'],
  ['Optional ElevenLabs voice prototyping'],
  ['NIST AI RMF and accessibility resources', 'https://www.nist.gov/itl/ai-risk-management-framework'],
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

function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return <section id={id} className={academy.section}>
    <header className={academy.sectionHeader}><h2 className={certification.headline}>{title}</h2></header>
    {children}
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

function TextList({ items, locale }: { items: readonly string[]; locale: Locale }) {
  return <ul className={styles.list}>{items.map(item => <li key={item}>{uiText(item, locale)}</li>)}</ul>
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
      <PageHero eyebrow={t(`THEROBOTAGE ACADEMY / ${rpdpProgram.program} v${rpdpProgram.version}`)} title={t(copy.title)} subtitle={t(copy.intro)}
        imageWrapClassName={styles.heroImage}
        imageContent={<Image src={imageAsset(bannerPath, doorwayPhoto)} alt={t(doorwayAlt)} fill sizes="(max-width: 767px) 90vw, 456px"
          className={hero.image} placeholder="blur" loading="eager" fetchPriority="high" />}>
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
            <p className={credential.overviewText}>{t(program.audience)}</p>
            <p className={credential.overviewText}>{t(copy.experience)}</p>
          </Section>
          <Section title={t('How the program works')}>
            <p className={credential.overviewText}>{t('RPDP is an assessed certificate program. You develop one case study throughout the program.')}</p>
            <p className={credential.overviewText}>{weeklyTime}</p>
            <p className={credential.overviewText}>{feedback}</p>
            <p className={credential.overviewText}>{t(copy.delivery)}</p>
          </Section>
          <AboutInstructor profile={copy.instructor} />
          <Section title={t(copy.whyTitle)}>
            <p className={credential.overviewText}>{t(copy.why)}</p>
            <TextList items={copy.whyItems} locale={locale} />
          </Section>
          <Section title={t(copy.skillsTitle)}><FeatureGrid items={copy.skills} locale={locale} /></Section>
          <Section title={t('Eight-week curriculum')} id="curriculum">
            <p className={credential.overviewText}>{t('{total} learning hours · {live} hours of live instruction · {independent} hours of independent study')
              .replace('{total}', String(rpdpLearningHours))
              .replace('{live}', String(rpdpLiveHours))
              .replace('{independent}', String(rpdpIndependentHours))}</p>
            <div className={credential.moduleList}>
              {rpdpModules.map(module => <details key={module.number} data-rpdp-week={module.number} className={styles.module}>
                <summary>
                  <span className={credential.moduleNumber}>{t('Week')} {module.number}</span>
                  <span className={credential.moduleTitle}>{t(module.title)}</span>
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
          <Section title={t(copy.capstoneTitle)} id="capstone">
            <div className={`${academy.editorial} ${styles.capstoneIntro}`}>
              <p className={credential.overviewText}>{t(copy.capstone)}</p>
              <Image src={imageAsset('/images/academy/rpdp-storyboard.webp', storyboardPhoto)}
                alt={t('A designer reviews three sketches of a delivery robot approaching a crate, stopping, and flashing an amber light as a person reaches for the crate.')}
                className={styles.capstonePhoto} placeholder="blur" loading="lazy"
                sizes="(max-width: 767px) 92vw, (max-width: 991px) 38vw, 390px" />
            </div>
            <FeatureGrid items={copy.tracks} locale={locale} />
            <h3 className={`${certification.courseTitle} ${styles.subheading}`}>{t('Final deliverables')}</h3>
            <TextList items={copy.finalDeliverables} locale={locale} />
            <p className={credential.overviewText}>{t(copy.capstoneRequirements)}</p>
            <p className={credential.overviewText}>{t(copy.hardware)}</p>
            <article className={`${academy.stack} ${styles.feature} ${styles.subheading}`}>
              <p className={certification.eyebrow}>{t(copy.example.label)}</p>
              <h3 className={certification.courseTitle}>{t(copy.example.title)}</h3>
              <p className={credential.overviewText}>{t(copy.example.description)}</p>
              <TextList items={copy.example.contents} locale={locale} />
            </article>
          </Section>
          <Section title={t('Tools and technology')}>
            <ul className={styles.list}>
              {tools.map(([name, url]) => <li key={name}>
                {url ? <Link className={certification.headerCta} href={href(url)}>{t(name)}</Link> : t(name)}
              </li>)}
            </ul>
            <p className={credential.overviewText}>{t(copy.prototype)}</p>
            <p className={credential.overviewText}>{t(copy.simulator)}</p>
          </Section>
          <Section title={t(copy.careerTitle)}><FeatureGrid items={copy.careers} locale={locale} /></Section>
          <Section title={t(copy.credentialTitle)}>
            <p className={credential.overviewText}>{t(copy.credential)}</p>
            <h3 className={certification.courseTitle}>{t('Assessment model')}</h3>
            <dl className={credential.specCard}>
              {copy.assessment.map((criterion, index) => <div className={styles.assessmentRow} key={criterion}>
                <dt>{t(criterion)}</dt><dd>{percent.format(assessmentWeights[index] / 100)}</dd>
              </div>)}
            </dl>
            <h3 className={`${certification.courseTitle} ${styles.subheading}`}>{t('Completion requirements')}</h3>
            <TextList items={copy.completion} locale={locale} />
            <p className={credential.overviewText}>{t(copy.disclaimer)}</p>
          </Section>
          <Section title={t('Frequently asked questions')}>
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
                ? <RpdpOfferFaqCopy locale={locale} part="question" /> : t(question)}</span></summary>
              <div className={styles.moduleBody}><p>{answer}</p></div>
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

from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[2]
def read(p): return (root/p).read_text(encoding='utf-8')
def write(p,s): (root/p).write_text(s,encoding='utf-8')
def replace(p,old,new):
 s=read(p)
 if old not in s: raise ValueError(f'Missing replacement in {p}: {old[:90]}')
 write(p,s.replace(old,new))
p='packages/ui/src/lib/certifications.ts'
s=read(p);s=s[:s.index('export const certifications:')]+'''// Active professional credentials. All public consumers use this catalog.
export const certifications: Certification[] = academyPrograms

export const programLinks = [
  { label: 'Robot Literacy', href: '/robot-literacy', summary: 'Understand robots through READ, RELATE, and COEXIST.', cta: 'Explore Robot Literacy' },
  { label: 'Live Robot Lab', href: '/live-robot-lab', summary: 'Experience real robots through guided, hands-on sessions for schools and organizations.', cta: 'Explore Live Robot Lab' },
  { label: 'Product Design for Robots (RPDP)', href: '/learn/rpdp', summary: academyPrograms[0].description, cta: 'Explore RPDP Curriculum' },
  { label: 'Robot Deployment Practitioner (RDP)', href: '/learn/rdp', summary: academyPrograms[1].description, cta: 'Explore RDP Curriculum' },
]

// Retired marketing routes are retained as notices, never as active offers.
export const legacyCredentialSlugs = ['rep', 'rsp', 'rxr', 'hsp']
export function isLegacyCredential(slug: string): boolean {
  return legacyCredentialSlugs.includes(slug)
}
export function getCertificationBySlug(slug: string): Certification | undefined {
  return certifications.find((program) => program.slug === slug)
}
export function getAllCertificationSlugs(): string[] {
  return certifications.map((program) => program.slug)
}
''';write(p,s)
p='packages/ui/src/components/Nav/LearnMenu.js';s=read(p);s=s.replace("import styles", "import { programLinks } from '../../lib/certifications'\nimport styles");s=re.sub(r'const LEARN_LINKS = \[.*?\n\]',"const LEARN_LINKS = [...programLinks, { label: 'Academy — Compare Programs', href: '/learn' }]",s,flags=re.S);s=s.replace("translate('LEARN')","translate('PROGRAMS')");write(p,s)
p='packages/ui/src/components/Footer/Footer.js';s=read(p).replace("import Link from 'next/link'\n",'').replace("import { certifications }","import { programLinks }");s=s.replace("{ label: 'Learn',         href: '/learn' }","{ label: 'Academy',       href: '/learn' }");s=s.replace("  { label: 'Access',        href: '/access' },","  { label: 'For Organizations', href: '/enterprise' },\n  { label: 'Partners', href: '/robot-literacy/partners' },\n  { label: 'Press', href: '/press' },");s=s.replace("  { label: 'Live Robot Lab', href: '/live-robot-lab#request-live-robot-lab' },\n",'');s=re.sub(r"  \{\n    label: 'YouTube',.*?\n  \},\n",'',s,flags=re.S);s=s.replace(', programs = certifications','');s=s.replace('https://learn.therobotage.com"','https://learn.therobotage.com/signin"').replace("translate('Certifications')","translate('Programs')");s=s.replace('programs.map(({ abbr, slug, name })','programLinks.map(({ label, href })').replace('key={abbr} href={resolveHref(`${baseUrl}/learn/${slug}`)}','key={href} href={resolveHref(`${baseUrl}${href}`)}').replace('<span className={styles.certAbbr}>{abbr}</span> — {translate(name)}','{translate(label)}');write(p,s)
p='frontend/src/components/Footer/Footer.js';s=read(p);s=s.replace('/** @param {{ programs?: import(\'@therobotage/ui/lib/certifications\').Certification[] }} props */\n','');s=s.replace('function Footer({ programs } = {})','function Footer()').replace('<FooterBase programs={programs}','<FooterBase');write(p,s)
p='frontend/src/app/(english)/learn/page.tsx';s=read(p).replace('<Footer programs={academyPrograms} />','<Footer />');s=s.replace('href={href(`/learn/${program.slug}`)}','href={href(`/learn/${program.slug}#curriculum`)}');s=s.replace("<Certification title={t('Robots need more than engineers.')}","<Certification title={t('Robots need more than engineers.')}")
# Add a distinct RDP form while retaining existing Academy and RPDP anchors.
needle='      <AboutInstructor />';s=s.replace(needle,'''      <Certification id="rdp-updates" title={t('Get RDP Launch Updates')}>
        <p className={styles.trackDescription}>{t('Get updates about Robot Deployment Practitioner. Joining this list does not reserve a seat.')}</p>
        <AccessForm locale={locale} interest="rdp" buttonLabel="Get RDP Launch Updates" />
      </Certification>

'''+needle);s=s.replace("<Link href={href('/robot-literacy')}","<Link href={href('/robot-literacy')}")
s=s.replace('      <Footer />', '      <Footer />');write(p,s)
p='frontend/src/app/sitemap.ts';s=read(p);start=s.index('  const certPages:');end=s.index('\n  //',start);s=s[:start]+'''  const certPages: MetadataRoute.Sitemap = certifications.map((program) => ({
    url: `${BASE}/learn/${program.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
'''+s[end:];s=s.replace(".filter((route) => route !== '/search')", ".filter((route) => route !== '/search' && !route.endsWith('/curriculum') && !/\\/learn\\/(rep|rsp|rxr|hsp)$/.test(route))");write(p,s)
p='frontend/src/lib/i18n/learn-routes.ts';s=read(p).replace('getAllCertificationSlugs }','getAllCertificationSlugs, legacyCredentialSlugs }');s=s.replace('  ...getAllCertificationSlugs()',"  ...legacyCredentialSlugs.flatMap(slug => [`/learn/${slug}`, `/learn/${slug}/curriculum`]),\n  ...getAllCertificationSlugs()");write(p,s)
p='frontend/src/lib/searchIndex.ts';s=read(p).replace("title: 'Learn'","title: 'Academy'").replace('Credentials and curricula built for non-engineers who work in, around, or alongside robotic systems.','Explore RPDP for robot product design and RDP for commercial robot deployment.');s=s.replace('const STATIC_PAGES: SearchResult[] = [',"const STATIC_PAGES: SearchResult[] = [\n  { type: 'Page', title: 'Live Robot Lab', excerpt: 'Guided, hands-on experiences with real robots for schools, universities, organizations, and events.', url: '/live-robot-lab' },");write(p,s)
p='frontend/src/lib/site.ts';s=read(p).replace('Robotic literacy education, research, and certification for designers, strategists, and leaders who work alongside robots.','Prepare for a world with robots through Robot Literacy, Live Robot Lab, and professional education in robot product design (RPDP) and deployment (RDP).').replace("    { title: 'Robotics education and certification', url: '/learn' },","    { title: 'Robot Literacy', url: '/robot-literacy' },\n    { title: 'Live Robot Lab', url: '/live-robot-lab' },\n    { title: 'Product Design for Robots (RPDP)', url: '/learn/rpdp' },\n    { title: 'Robot Deployment Practitioner (RDP)', url: '/learn/rdp' },").replace("url: '/news'","url: '/research'");write(p,s)
p='frontend/src/app/(english)/page.tsx';s=read(p).replace("import Summit from '@/components/Summit/Summit'\n",'').replace('      <Summit />\n','').replace("import { siteOverview }", "import { academyPrograms } from '@/lib/certifications'\nimport { siteOverview }");start=s.index('    offers: {');end=s.index('\n  },',start);s=s[:start]+'''    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'The Robot Age Academy',
      itemListElement: academyPrograms.map((program) => ({
        '@type': 'Course', name: program.title, description: program.description,
        url: `https://therobotage.com/learn/${program.slug}`,
        provider: { '@type': 'Organization', name: 'The Robot Age Academy' },
      })),
    },'''+s[end:];write(p,s)
p='frontend/src/components/HeroHomepage/HeroHomepage.js';s=read(p).replace('Become Certified','Explore Professional Programs');write(p,s)
write('frontend/src/components/Certification/Certification.js',''' 'use client'
import Link from 'next/link'
import { programLinks } from '@/lib/certifications'
import { useCopy } from '@/lib/i18n/useCopy'
import styles from './Certification.module.css'

export default function Certification() {
  const { t, href } = useCopy()
  return <section id="programs" className={styles.section}>
    <div className="container-fluid">
      <div className={`row align-items-end ${styles.headerRow}`}>
        <div className="col-lg-6">
          <p className={styles.eyebrow}>{t('Our Programs')}</p>
          <h2 className={styles.headline}>{t('Understand. Experience. Design. Deploy.')}</h2>
        </div>
        <div className="col-lg-5 offset-lg-1">
          <p className={styles.subhead}>{t('Build your robot literacy, meet real robots, or develop professional skills in robot product design and deployment. Choose the starting point that fits your goals.')}</p>
          <Link href={href('/learn#programs')} className={styles.headerCta}>{t('Compare Professional Programs')} →</Link>
        </div>
      </div>
      <div className={styles.tracksGrid}>
        {programLinks.map((program) => <article key={program.href} className={styles.trackCard}>
          <h3 className={styles.trackName}>{t(program.label)}</h3>
          <p className={styles.trackDescription}>{t(program.summary)}</p>
          <Link href={href(program.href.startsWith('/learn/') ? `${program.href}#curriculum` : program.href)} className={styles.headerCta}>{t(program.cta)} →</Link>
        </article>)}
      </div>
      <p className={styles.subhead}>{t('RPDP and RDP are upcoming professional programs. Explore the Academy for dates and interest lists. Joining a list does not reserve a seat.')}</p>
    </div>
  </section>
}
'''.lstrip())
write('frontend/src/components/FoundingCohort/FoundingCohort.tsx',''' 'use client'
import Link from 'next/link'
import { useCopy } from '@/lib/i18n/useCopy'
import styles from './FoundingCohort.module.css'

/** Current next steps shared by robot profiles; no expired cohort promotion. */
export default function FoundingCohort() {
  const { t, href } = useCopy()
  return <section className={styles.block}><div className={styles.grid}>
    <div className={styles.left}>
      <p className={styles.label}>{t('Learn with The Robot Age')}</p>
      <h2 className={styles.headline}>{t('Meet robots. Build practical skills.')}</h2>
      <p className={styles.body}>{t('Experience real robots in Live Robot Lab, or explore RPDP and RDP for professional learning in product design and deployment.')}</p>
    </div>
    <div className={styles.right}><div className={styles.ctaRow}>
      <Link href={href('/live-robot-lab')} className={styles.cta}>{t('Explore Live Robot Lab')} →</Link>
      <Link href={href('/learn#programs')} className={styles.cta}>{t('Explore Professional Programs')} →</Link>
    </div></div>
  </div></section>
}
'''.lstrip())
print('Updated shared catalog, navigation, homepage, sitemap, and program promotions')

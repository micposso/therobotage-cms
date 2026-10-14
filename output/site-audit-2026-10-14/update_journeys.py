from pathlib import Path
import re
root=Path(__file__).resolve().parents[2]
def read(p):return (root/p).read_text(encoding='utf-8')
def write(p,s):(root/p).write_text(s,encoding='utf-8')
p='frontend/src/app/(english)/learn/[credential]/page.tsx';s=read(p).replace("import FoundingCohort from '@/components/FoundingCohort/FoundingCohort'\n",'').replace('getAllCertificationSlugs }','getAllCertificationSlugs, isLegacyCredential }');s=s.replace('  if (!cert) return {}',"  if (isLegacyCredential(credential)) return { title: uiText('Program catalog updated', locale), robots: { index: false, follow: true } }\n  if (!cert) return {}")
s=s.replace('  if (!cert) notFound()', '''  if (isLegacyCredential(credential)) return <>
    <Nav pinned />
    <main className={styles.page}><div className="container-fluid">
      <h1 className={styles.title}>{t('Program catalog updated')}</h1>
      <p className={styles.description}>{t('This credential is no longer part of our current public program catalog. Explore RPDP and RDP at The Robot Age Academy, or start with Robot Literacy and Live Robot Lab.')}</p>
      <Link className={styles.ctaPrimary} href={resolveHref('/learn#programs')}>{t('Compare Professional Programs')} →</Link>
      <p className={styles.overviewText}>{t('Existing learners can sign in to access their learning records. This catalog update does not rename previously issued credentials.')}</p>
      <a className={styles.backLink} href="https://learn.therobotage.com/signin">{t('Learner sign in')} →</a>
    </div></main><Footer />
  </>
  if (!cert) notFound()''')
s=s.replace("  const isAcademy = credential === 'rpdp' || credential === 'rdp'\n",'')
start=s.index('              {isLive ? (');end=s.index('\n            </div>',start)
s=s[:start]+'''              <Link href={resolveHref(`/learn#${credential === 'rpdp' ? 'founding-cohort-list' : 'rdp-updates'}`)} className={styles.ctaPrimary}>
                {t(credential === 'rpdp' ? 'Join the RPDP Founding Cohort List' : 'Get RDP Launch Updates')} →
              </Link>
              <p className={styles.frameworkText}>{t('Joining the list does not reserve a seat.')}</p>'''+s[end:]
s=re.sub(r'<p className=\{styles.frameworkText\}>\{t\(isAcademy .*?</p>', '<p className={styles.frameworkText}>{t("Explore the Robot Experience Design framework for evaluating how people experience robots in real environments.")}</p>',s)
s=re.sub(r'          \{/\* [^\n]*Founding Cohort[^\n]*\*/\}\n.*?\n          \{/\*', '          {/*',s,flags=re.S)
s=re.sub(r'            \{!isAcademy && .*?\n','',s)
s=s.replace('Read the RXD White Paper →','Explore the RXD Framework →').replace('← Back to Curriculum','← Back to Academy')
s=s.replace('          {/* Back', '          {/* Back')
s=s.replace('          <div className={styles.back}>', '''          <p className={styles.frameworkText}>{t('Credentials recognize completion of educational requirements. They are not government licenses, regulated safety certifications, or authorization to operate robots.')}</p>
          <div className={styles.back}>''');write(p,s)
write('frontend/src/app/(english)/learn/[credential]/curriculum/page.tsx','''import { notFound, permanentRedirect } from 'next/navigation'
import { contentHref } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import { getCertificationBySlug, getAllCertificationSlugs, isLegacyCredential } from '@/lib/certifications'
export { generateMetadata } from '../page'

export async function generateStaticParams() {
  return getAllCertificationSlugs().map((credential) => ({ credential }))
}

export default async function CurriculumPage({ params }: { params: Promise<{ credential: string; locale?: Locale }> }) {
  const { credential, locale = 'en' } = await params
  if (isLegacyCredential(credential)) permanentRedirect(contentHref(`/learn/${credential}`, locale))
  if (!getCertificationBySlug(credential)) notFound()
  permanentRedirect(contentHref(`/learn/${credential}#curriculum`, locale))
}
''')
p='frontend/src/app/(english)/access/AccessForm.tsx';s=read(p).replace("interest, buttonLabel = 'Join the Waitlist'","interest = 'academy', buttonLabel = 'Get Academy Updates'").replace("interest?: 'rpdp' | 'academy'","interest?: 'rpdp' | 'rdp' | 'academy'");s=s.replace('t(interest ? "You\'re on the list. Check your inbox for confirmation. Joining does not reserve a seat." : "You\'re on the waitlist. Check your inbox for confirmation.")','t("You\'re on the list. Check your inbox for confirmation. Joining does not reserve a seat.")');s=s.replace('    {interest && <input name="interest" type="hidden" value={interest} />}','    <input name="interest" type="hidden" value={interest} />\n    <input name="locale" type="hidden" value={locale} />');write(p,s)
p='frontend/src/app/(english)/access/page.tsx';s=read(p).replace('Access — The Robot Age','Academy Updates — The Robot Age').replace('Join the waitlist for the REP certification.','Get updates about RPDP and RDP at The Robot Age Academy.').replace('Get Access','Academy Updates').replace('Be first in.','Stay informed about the Academy.').replace("The Robotics Experience Practitioner certification is launching soon. Join the waitlist and we'll notify you when enrollment opens — along with early access offers and pre-launch resources.","Explore professional education in robot product design and deployment. Get updates about RPDP and RDP. Joining the list does not reserve a seat.").replace("We're keeping the first cohort small. Leave your name and email and we'll be in touch before the public announcement.","Leave your name and email to receive Academy program updates.");write(p,s)
p='frontend/src/context/WaitlistContext.tsx';s=read(p).replace('const { t } = useCopy()','const { t, locale } = useCopy()');changes={"We'll reach you first.":'Check your inbox.',"Before the public announcement, you'll hear about the cohort schedule, founding-member pricing, and direct access to the instructor. Nothing in the meantime.":'You have joined the Academy update list. Joining does not reserve a seat.', 'REP Certification':'The Robot Age Academy','The first cohort runs May 2026.':'Get Academy Updates',"Certification dates are being confirmed now. Leave your email and we'll reach you before the public announcement — with the schedule, founding-member pricing, and direct access to the instructor.":'Get updates about RPDP and RDP. Joining the list does not reserve a seat.','Reserve my seat →':'Get Academy Updates',"No noise. Just the announcement when it's ready.":'Program updates by email. No seat reservation or payment.'}
for a,b in changes.items():s=s.replace(a,b)
s=s.replace('<form action={action} className={styles.form} noValidate>','<form action={action} className={styles.form}>\n                    <input type="hidden" name="interest" value="academy" />\n                    <input type="hidden" name="locale" value={locale} />');write(p,s)
p='frontend/src/components/NewsArticle/WaitlistModal.tsx';s=read(p).replace("import { useWaitlist }","import { useCopy } from '@/lib/i18n/useCopy'\nimport { useWaitlist }").replace('  const { open } = useWaitlist()','  const { open } = useWaitlist()\n  const { t } = useCopy()').replace('      Reserve your seat →',"      {t('Get Academy Updates')} →");write(p,s)
p='frontend/src/components/NewsArticle/NewsArticle.tsx';s=read(p).replace("import Link from 'next/link'","import Link from 'next/link'\nimport { contentHref } from '@/lib/i18n/localize'");s=s.replace('<Link href="/learn"','<Link href={contentHref("/learn#programs", locale)}').replace('Get the REP credential','Explore Professional Programs').replace('<Link href="/robot-literacy"','<Link href={contentHref("/robot-literacy", locale)}').replace('<Link href="/summit"','<Link href={contentHref("/live-robot-lab", locale)}').replace('Join the Summit','Explore Live Robot Lab').replace('The REP credential is built for the people who shape how robots land — not the engineers who build them.','Explore RPDP for robot product design and RDP for commercial robot deployment.');write(p,s)
p='frontend/src/app/(english)/rxd-scorecard/Scorecard.tsx';s=read(p).replace('href="/learn/rep"','href="/learn/rpdp#curriculum"').replace('Get the REP credential','Explore RPDP Curriculum');write(p,s)
p='frontend/src/lib/redirects.ts';s=read(p).replace('const redirects: Redirect[] = [',"const redirects: Redirect[] = [\n  { source: '/notify', destination: '/learn#academy-updates', permanent: true },\n  { source: '/es/notify', destination: '/es/learn#academy-updates', permanent: true },");write(p,s)
print('Updated credential routes, legacy notices, interest forms and article CTAs')

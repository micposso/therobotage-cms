from pathlib import Path
import re
root=Path(__file__).resolve().parents[2]
def read(p):return (root/p).read_text(encoding='utf-8')
def write(p,s):(root/p).write_text(s,encoding='utf-8')
write('frontend/src/app/actions/joinWaitlist.ts',''' 'use server'
import { Resend } from 'resend'
import { waitlistConfirmationHtml } from '@/lib/emailTemplate'
import { academyInterests, parseAcademyInterest } from '@/lib/academyInterest'
const FROM_ADDRESS = process.env.EMAIL_FROM_RESEARCH ?? 'onboarding@resend.dev'
const ADMIN_ADDRESS = 'mike@therobotage.com'
export async function joinWaitlist(prevState: { success: boolean; error?: string } | null, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const rawName = formData.get('name')
  const name = typeof rawName === 'string' ? rawName.trim().slice(0, 254) : ''
  const rawEmail = formData.get('email')
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : ''
  const interest = parseAcademyInterest(formData.get('interest'))
  const locale = formData.get('locale') === 'es' ? 'es' : 'en'
  if (!interest) return { success: false, error: 'Please select a valid program interest.' }
  if (!email || email.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return { success: false, error: 'Please enter a valid email address.' }
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Something went wrong. Please try again.' }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS, to: email, bcc: ADMIN_ADDRESS,
      subject: `${locale === 'es' ? 'Estás en la lista' : "You're on the list"} — ${academyInterests[interest][locale]}`,
      html: waitlistConfirmationHtml(interest, locale, name),
    })
    if (error) { console.error('Academy confirmation email error:', error); return { success: false, error: 'Something went wrong. Please try again.' } }
    return { success: true }
  } catch (error) {
    console.error('Academy interest error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
'''.lstrip())
p='frontend/src/lib/emailTemplate.ts';s=read(p);s="import { academyInterests, type AcademyInterest } from './academyInterest'\n"+s;start=s.index('export function waitlistConfirmationHtml');end=s.index('export function escapeHtml',start);s=s[:start]+'''export function waitlistConfirmationHtml(interest: AcademyInterest = 'academy', locale: 'en' | 'es' = 'en', name = ''): string {
  const label = academyInterests[interest][locale]
  const title = locale === 'es' ? 'Gracias por tu interés en The Robot Age Academy' : 'Thanks for your interest in The Robot Age Academy'
  const note = locale === 'es'
    ? 'Recibirás novedades del programa. Inscribirte en esta lista no reserva una plaza ni confirma una matrícula.'
    : 'You will receive program updates. Joining this list does not reserve a seat or confirm enrollment.'
  const url = `https://therobotage.com${locale === 'es' ? '/es' : ''}/learn${interest === 'academy' ? '' : `/${interest}`}`
  return emailHtml(`<h1>${title}</h1><p>${escapeHtml(label)}</p><p>${note}</p>${name ? `<p>${escapeHtml(name)}</p>` : ''}<p><a href="${url}">${locale === 'es' ? 'Explorar el programa' : 'Explore the program'}</a></p>`)
}

'''+s[end:];write(p,s)
for p in ['frontend/src/app/actions/sendWhitepaperEmail.ts','frontend/src/app/api/test-email/route.ts']:
 s=read(p).replace('If you want to go further, the REP credential is the structured path — four tracks, no engineering prerequisites. Explore the research at','Explore Robot Literacy, hands-on Live Robot Lab experiences, and the Academy’s two professional pathways: RPDP for product design and RDP for deployment. Find current programs at').replace('<a href="https://therobotage.com" style="color:#9b5152;text-decoration:none;">therobotage.com</a>','<a href="https://therobotage.com/learn" style="color:#9b5152;text-decoration:none;">The Robot Age Academy</a>');write(p,s)
p='frontend/src/app/(english)/robot-literacy/Sections.tsx';s=read(p).replace("import type { Locale }", "import { contentHref } from '@/lib/i18n/localize'\nimport type { Locale }");s=s.replace('href="#inquiry"','href="/enterprise"').replace('href="/learn/rep"','href="/learn#programs"').replace('Explore the Robotics Experience Practitioner Certification ↗','Explore RPDP and RDP ↗').replace('A structured learning path for people who want to develop foundational knowledge of robots, human–robot interaction and the societal implications of robotics.','Professional pathways for people designing robot experiences (RPDP) or preparing organizations for robot deployment (RDP).').replace('title: t("Build Your Robot Literacy")','title: t("Professional Programs")').replace("title: 'Build Your Robot Literacy'","title: 'Professional Programs'")
# Localize links only inside functions that receive locale; lower legacy helpers are English-only.
cut=s.index('export function RobotLiteracyLearningFormats');end=s.index('\nexport function ',cut+20)
chunk=s[cut:end];chunk=re.sub(r'href="(/[^\"]*)"',r'href={contentHref("\1", locale)}',chunk);s=s[:cut]+chunk+s[end:];s=s.replace('href={item.href}','href={contentHref(item.href, locale)}');write(p,s)
p='frontend/src/app/(english)/robot-literacy/framework-content.ts';s=read(p).replace("href: '/learn/rep'","href: '/learn#programs'").replace("cta: 'Build Your Robot Literacy'","cta: 'Explore Professional Programs'").replace("href: '#inquiry'","href: '/enterprise'");write(p,s)
p='frontend/src/app/(english)/robot-literacy/Interactive.tsx';s=read(p).replace('href="#inquiry" onClick={() => window.dispatchEvent(new Event(\'robot-literacy-partnership\'))}','href="/robot-literacy/partners"');write(p,s)
p='frontend/src/app/(english)/robot-literacy/partners/page.tsx';s=read(p).replace("title: 'INTERPRET'","title: 'READ'");write(p,s)
p='frontend/src/app/(english)/press/page.tsx';s=read(p).replace("['Flagship credential', 'REP — Robotics Experience Practitioner']","['Professional credentials', 'RPDP — Robotics Product Design Practitioner; RDP — Robot Deployment Practitioner']").replace("title: 'Robotics Literacy'","title: 'Robot Literacy'").replace("href: '/robotics-literacy'","href: '/robot-literacy'").replace("title: 'REP Certification'","title: 'Product Design for Robots (RPDP)'").replace('A six-week hybrid credential on the human side of robotics, culminating in a Robot Readiness Audit.','A five-week, 25-hour professional program culminating in a Robot Experience Design portfolio project. The first cohort is planned for February 2027.').replace("href: '/learn/rep'","href: '/learn/rpdp'").replace("title: 'Robot Live Labs'","title: 'Live Robot Lab'").replace('Small, live online sessions where practitioners apply the RXD framework to a real robot, including guided scoring with Reachy Mini.','Guided, in-person experiences with Reachy Mini and Unitree Go2 Pro for schools, universities, organizations, and events.').replace("href: '/rxd-free-workshop'","href: '/live-robot-lab'").replace('the Robot Experience Design framework, the Robotics Experience Practitioner credential, live robot labs, field research','Robot Literacy, Live Robot Lab, RPDP and RDP professional education, the Robot Experience Design framework, field research').replace('Posso holds a master’s degree','Posso is pursuing a master’s degree')
s=s.replace("const PRESS_LINKS = [", "const PRESS_LINKS = [\n  { title: 'Robot Deployment Practitioner (RDP)', body: 'A four-week, 24-hour professional program focused on organizational readiness, workforce training, governance, and adoption. Commercial launch is planned for January 2027.', href: '/learn/rdp', cta: 'Explore the curriculum' },")
write(p,s)
p='frontend/src/app/(english)/enterprise/page.tsx';s=read(p).replace("import Nav from", "import Link from 'next/link'\nimport { programLinks } from '@/lib/certifications'\nimport Nav from").replace('Most deployment failures trace back to the humans around the robot, not the robot itself. Operational teams need a shared language before the machine arrives on the floor.','Deployment outcomes depend on people, workflows, environments, and technology. Prepare teams with a shared language before robots arrive.').replace('Access to certification tracks aligned to your operational context.','A relevant learning pathway: Robot Literacy, Live Robot Lab, RPDP for design teams, or RDP for deployment teams.');s=s.replace('      {/* Request a briefing */}', '''      <section className={styles.whySection}>
        <div className="container-fluid">
          <h2 className={styles.formHeading}>Find the right program for your team</h2>
          <div className={styles.cardGrid}>{programLinks.map((program) => <article className={styles.card} key={program.href}>
            <h3 className={styles.cardTitle}>{program.label}</h3><p className={styles.cardBody}>{program.summary}</p>
            <Link href={program.href}>{program.cta} →</Link>
          </article>)}</div>
        </div>
      </section>
      {/* Request a briefing */}''');write(p,s)
p='frontend/src/app/(english)/connect/page.tsx';s=read(p).replace("Whether you're interested in the certification, the summit, a partnership, or just the work — we'd like to hear from you.","Ask about Robot Literacy, Live Robot Lab, RPDP, RDP, or a partnership. Tell us what you would like to explore.");write(p,s)
# Shared LMS marketing footer uses the same four-offer catalog. Learner data/curricula stay intact.
write('lms/src/components/Footer/Footer.js',"'use client'\nimport FooterBase from '@therobotage/ui/Footer'\nexport default function Footer() { return <FooterBase baseUrl=\"https://therobotage.com\" /> }\n")
print('Updated program inquiry emails, literacy, press, enterprise, and LMS footer')

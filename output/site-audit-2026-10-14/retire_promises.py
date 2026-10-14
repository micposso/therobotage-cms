from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[2]
def read(p):return (root/p).read_text(encoding='utf-8')
def write(p,s):(root/p).write_text(s,encoding='utf-8')
p='frontend/src/app/(english)/learn/[credential]/curriculum/page.tsx';s=read(p).replace('  permanentRedirect(contentHref','  return permanentRedirect(contentHref');write(p,s)
# Keep existing old article URLs as explicit notices rather than relabeling past results.
p='frontend/src/lib/articles.ts';s=read(p)
for slug,title,body in [
 ('rlp-module-1-1-live','Archived program announcement: current learning pathways',[
 'Program update — October 2026. The module availability and credential offer previously described here are no longer part of the current public catalog.',
 'Start with Robot Literacy for foundational understanding, experience real robots through Live Robot Lab, or explore the Academy’s professional pathways: Product Design for Robots (RPDP) and Robot Deployment Practitioner (RDP).',
 'See the Academy for current curricula, planned dates, and interest lists. An interest-list signup does not reserve a seat. Existing learners can sign in to access their learning records.']),
 ('first-rep-workplace','Archived credential announcement: program information under review',[
 'Editorial update — October 2026. The credential-completion and workplace-outcome claims previously published at this URL have been withdrawn from public promotion pending verification.',
 'This page is not evidence of outcomes for RPDP or RDP. The current public offerings are Robot Literacy, Live Robot Lab, Product Design for Robots (RPDP), and Robot Deployment Practitioner (RDP).',
 'Visit the Academy for current professional program information. Existing learner records and previously issued credentials are not renamed by this catalog update.'])]:
 start=s.index("    slug: '"+slug+"'");end=s.index('\n  },',start);block=s[start:end];block=re.sub(r"category: '[^']*'","category: 'ARCHIVE'",block);block=re.sub(r"headline: '[^\n]*'","headline: "+json.dumps(title,ensure_ascii=False),block);bstart=block.index('    body: [');block=block[:bstart]+'    body: '+json.dumps(body,ensure_ascii=False,indent=6)+',';s=s[:start]+block+s[end:]
s=s.replace('The HRF is available as part of the REP curriculum and will be published in full as an open research tool later this year.','Program update — October 2026: this earlier framework article is not a current course-availability announcement. Explore RPDP and RDP on the Academy page for current professional learning pathways.');write(p,s)
p='frontend/src/app/(english)/research/[slug]/page.tsx';s=read(p).replace('    description: article.body[0],',"    description: article.body[0],\n    ...(article.category === 'ARCHIVE' ? { robots: { index: false, follow: true } } : {}),",1);s=s.replace('          {/* Back link */}', '''          <p><Link href={contentHref('/learn#programs', locale)}>{t('Explore Professional Programs')} →</Link></p>
          {/* Back link */}''');write(p,s)
p='frontend/src/app/sitemap.ts';s=read(p).replace('articles.map((a)',"articles.filter((a) => a.category !== 'ARCHIVE').map((a)");s=s.replace("!route.endsWith('/curriculum')", "!route.endsWith('/curriculum') && !['/research/rlp-module-1-1-live', '/research/first-rep-workplace'].includes(route)");write(p,s)
p='frontend/src/lib/searchIndex.ts';s=read(p).replace('articles.map(a => localize',"articles.filter(a => a.category !== 'ARCHIVE').map(a => localize");write(p,s)
# Close the past workshop in both UI and action metadata; no submissions or emails.
p='frontend/src/lib/events.ts';s=read(p).replace("status: 'registration-open' | 'announced'","status: 'registration-open' | 'announced' | 'closed'").replace("availability: 'open' | 'interest-only'","availability: 'open' | 'interest-only' | 'closed'").replace("status: 'registration-open',","status: 'closed',").replace("date: 'Tuesday, June 16'","date: 'June 16, 2026'").replace("date: 'Tuesday, June 23'","date: 'June 23, 2026'").replace("date: 'Tuesday, June 30'","date: 'June 30, 2026'").replace("time: '7:00–7:45 pm'","time: '7:00–7:45 pm ET'").replace("availability: 'open',","availability: 'closed',").replace("adapter: 'workshop-email',","adapter: null,").replace('Registration uses the existing validated workshop email flow and its capacity checks.','Registration for the June 2026 workshop is closed. Explore current Academy programs.');write(p,s)
p='frontend/src/app/actions/sendWorkshopEmail.ts';s=read(p);s="import { workshopEvent } from '@/lib/events'\n"+s if not s.startswith("'use server'") else s.replace("'use server'","'use server'\n\nimport { workshopEvent } from '@/lib/events'",1);needle="  const firstName  =";s=s.replace(needle,"  if (workshopEvent.registration.availability !== 'open') return { success: false, error: 'Registration for this workshop is closed. Explore current programs at /learn.' }\n"+needle);write(p,s)
p='frontend/src/app/(english)/rxd-free-workshop/page.tsx';s=read(p).replace("import WorkshopForm from './WorkshopForm'","import Link from 'next/link'");start=s.index('                <p className={styles.formEyebrow}>');end=s.index('\n              </div>',start);s=s[:start]+'''                <p className={styles.formEyebrow}>Registration closed</p>
                <h3 className={styles.formHeading}>This page describes the June 2026 workshop.</h3>
                <p className={styles.formSubheading}>Explore the Academy for current RPDP and RDP program information, or request a Live Robot Lab for your group.</p>
                <p><Link href="/learn#programs">Explore Professional Programs →</Link></p>
                <p><Link href="/live-robot-lab">Explore Live Robot Lab →</Link></p>'''+s[end:];s=s.replace('eyebrow="Free Workshop"','eyebrow="Past Workshop · June 2026"');write(p,s)
# Summit actions become honest general inquiries, not inactive registration promises.
p='frontend/src/components/Summit/Summit.js';s=read(p).replace('<button className={styles.ctaPrimary}>','<a href="/connect" className={styles.ctaPrimary}>').replace('<button className={styles.ctaSecondary}>','<a href="mailto:summit@therobotage.com" className={styles.ctaSecondary}>').replace('{t("Get Notified")}</button>','{t("Ask About the Summit")}</a>').replace('{t("Apply to Speak")}</button>','{t("Discuss Speaking")}</a>');write(p,s)
# The public machine-readable summary must reflect the same catalog.
write('frontend/public/llms.txt','''# The Robot Age

The Robot Age prepares people and organizations for a world with robots.
Canonical website: https://therobotage.com

## Current programs
- Robot Literacy: READ, RELATE, COEXIST. Foundational understanding and responsible interaction. https://therobotage.com/robot-literacy
- Live Robot Lab: guided, in-person experiences with Reachy Mini and Unitree Go2 Pro for schools, universities, organizations, and events. Initially NYC metropolitan area. https://therobotage.com/live-robot-lab
- Product Design for Robots (RPDP — Robotics Product Design Practitioner): 5 weeks, 25 hours, live and self-paced; first cohort planned February 2027; student $149, professional $299. Capstone: Robot Experience Design portfolio project. https://therobotage.com/learn/rpdp
- Robot Deployment Practitioner (RDP): 4 weeks, 24 hours; commercial launch planned January 2027. Capstone: Robot Deployment Readiness Plan. https://therobotage.com/learn/rdp

## Status and actions
The Academy has two professional credential pathways. Robot Literacy and Live Robot Lab are not additional professional certifications. Dates, prices, and availability should be checked at https://therobotage.com/learn before reuse.
RPDP and RDP are upcoming programs. Joining an interest list does not reserve a seat or confirm enrollment. Lab requests are inquiries, not confirmed bookings.
Credentials recognize educational completion, not government licensing, regulated safety certification, or authorization to operate robots.
Legacy credential URLs display catalog-update notices. Do not advertise them as active offers or rename historical learner credentials.

## Useful destinations
- Compare professional programs: https://therobotage.com/learn#programs
- RPDP interest list: https://therobotage.com/learn#founding-cohort-list
- RDP updates: https://therobotage.com/learn#rdp-updates
- Request a Lab: https://therobotage.com/live-robot-lab#request-live-robot-lab
- Team training: https://therobotage.com/enterprise
- Partnerships: https://therobotage.com/robot-literacy/partners
- RXD framework: https://therobotage.com/rxd
- RXD scorecard: https://therobotage.com/rxd-scorecard
- Research and news: https://therobotage.com/research
- Robot profiles: https://therobotage.com/robots
- Jobs: https://therobotage.com/jobs
- General contact: https://therobotage.com/connect
- Learner sign in: https://learn.therobotage.com/signin

RXD is a six-dimension framework for evaluating robot experiences. It is distinct from the READ/RELATE/COEXIST Robot Literacy framework and from Academy credentials.
''')
print('Retired old announcements, workshop registration, and machine-readable catalog')

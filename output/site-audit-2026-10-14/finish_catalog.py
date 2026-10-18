from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[2]
def read(p):return (root/p).read_text(encoding='utf-8')
def write(p,s):(root/p).write_text(s,encoding='utf-8')
write('lms/src/lib/certifications.ts',"export * from '@therobotage/ui/lib/certifications'\n")
p='lms/src/components/LMSNav/LMSNav.tsx';write(p,read(p).replace("cohortLabel = 'REP · Cohort 1'","cohortLabel = 'Your learning'"))
p='lms/src/lib/email/send.ts';write(p,read(p).replace('your REP credential for','your credential for'))
for p in ['frontend/scripts/form-email.test.mjs','frontend/scripts/live-robot-lab.test.mjs','frontend/scripts/robot-literacy.test.mjs']:
 s=read(p).rstrip()+'\n'
 if p.endswith('live-robot-lab.test.mjs'):s=re.sub(r"  const template = await readFile\(\n    new URL\('../src/lib/emailTemplate.ts', import.meta.url\),\n    'utf8',\n  \)\n",'',s)
 write(p,s)
p='frontend/scripts/translation-layout.test.mjs';s=read(p).replace("['rep', 'rpdp', 'rsp', 'rxr']","['rpdp', 'rdp']").replace('      assert.match(es, /Summit/)','      assert.match(es, /RPDP/)\n      assert.match(es, /RDP/)');write(p,s)
# Retain the speaker announcement URL, but remove obsolete application deadlines and benefits.
p='frontend/src/lib/articles.ts';s=read(p);start=s.index("    slug: 'summit-nyc-call-for-speakers'");end=s.index('\n  },',start);block=s[start:end];block=re.sub(r"headline: '[^\n]*'", "headline: 'Summit announcement: contact us for current event information'",block);bstart=block.index('    body: [');body=['Event update — October 2026. The application deadline and speaker benefits previously announced on this page are no longer being advertised as current offers.', 'For current Summit plans or a speaking inquiry, contact The Robot Age through the Connect page. An inquiry does not confirm a speaking slot or event registration.', 'For current learning programs, explore Robot Literacy, Live Robot Lab, RPDP, and RDP.'];block=block[:bstart]+'    body: '+json.dumps(body,ensure_ascii=False,indent=6)+',';s=s[:start]+block+s[end:];write(p,s)
p='frontend/news/summit-nyc-call-for-speakers.md';s=read(p);parts=s.split('---',2);parts[1]=re.sub(r'title: .*','title: Summit announcement — contact us for current event information',parts[1]);parts[1]=re.sub(r'excerpt: .*','excerpt: Contact The Robot Age for current Summit plans and speaking inquiries. Previous application deadlines and speaker benefits are no longer advertised as current offers.',parts[1]);write(p,'---'+parts[1]+'---\n\n'+'\n\n'.join(body)+'\n\n[Contact The Robot Age](/connect) or [explore current professional programs](/learn#programs).\n')
# Update local editorial reference pages so future changes use the current catalog.
write('site-content/learn.md','''# Academy — /learn

Current catalog reference: October 2026. The shared implementation source is packages/ui/src/lib/certifications.ts.

The Robot Age has four offers: Robot Literacy (/robot-literacy), Live Robot Lab (/live-robot-lab), Product Design for Robots (RPDP, /learn/rpdp), and Robot Deployment Practitioner (RDP, /learn/rdp).

/learn compares the two professional credential pathways. RPDP: 5 weeks, 25 hours, live and self-paced, first cohort planned February 2027, student $149 / professional $299. Capstone: Robot Experience Design portfolio project. RDP: 4 weeks, 24 hours, commercial launch planned January 2027. Capstone: Robot Deployment Readiness Plan. Do not invent an RDP price or schedule.

RPDP interest: /learn#founding-cohort-list. RDP interest: /learn#rdp-updates. General Academy updates: /learn#academy-updates. Joining a list does not reserve a seat or confirm enrollment.

Robot Literacy uses READ / RELATE / COEXIST. Live Robot Lab is a guided, in-person experience, not an Academy credential. Do not present either as a prerequisite unless explicitly required.

Legacy credential pages show a catalog-update notice. Historical learner records and credentials are not renamed.
''')
write('site-content/learn-credential.md','''# Professional credential pages

Current pages: /learn/rpdp and /learn/rdp. See learn.md and packages/ui/src/lib/certifications.ts for canonical program facts.

Show the specific program audience, overview, format, duration, modules, capstone and current status. Link curriculum CTAs to the corresponding #curriculum section. Route RPDP interest to /learn#founding-cohort-list and RDP interest to /learn#rdp-updates.

Credentials recognize educational completion, not government licenses, regulated safety certifications, or authorization to operate robots. An interest-list signup is not a reservation. Legacy URLs display a catalog-update notice and existing-learner sign-in.
''')
write('site-content/learn-curriculum.md','''# Curriculum routes

/learn/rpdp/curriculum redirects to /learn/rpdp#curriculum.
/learn/rdp/curriculum redirects to /learn/rdp#curriculum.

Use each program's actual curriculum from the shared catalog. Never reuse a retired credential's syllabus or enrollment promises. Legacy curriculum URLs lead to their catalog-update notice.
''')
print('Completed legacy LMS marketing and obsolete event promise cleanup')

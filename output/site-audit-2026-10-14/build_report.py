import json, csv, re, html
from pathlib import Path
from urllib.parse import urlsplit
root=Path(__file__).parent
pages=json.loads((root/'crawl.json').read_text(encoding='utf-8'))
issues=json.loads((root/'link-issues.json').read_text(encoding='utf-8'))
def role(path):
    path=re.sub(r'^/es(?=/|$)','',path) or '/'
    if path=='/': return 'Introduce the four offers and route by audience/intent'
    if path.startswith('/learn'): return 'Compare current professional pathways; curriculum; program-specific updates'
    if path.startswith('/live-robot-lab'): return 'Explain guided in-person experience; route to audience-specific inquiry'
    if path.startswith('/robot-literacy/partners'): return 'Partner collaboration inquiry; READ/RELATE/COEXIST'
    if path.startswith('/robot-literacy'): return 'Foundational framework; route to Lab, Academy, or organization inquiry'
    if path.startswith('/jobs'): return 'Career discovery; optional relevant learning; employer facts require independent verification'
    if path.startswith('/news'): return 'Reporting/analysis; contextual current-program next step'
    if path.startswith('/research'): return 'Framework, evidence, and editorial interpretation; verify research claims'
    if path.startswith('/robots'): return 'Evaluated examples; method/date; Lab and RPDP next steps'
    if path.startswith('/what-robot'): return 'Discovery activity; route to literacy and Lab'
    return {'/enterprise':'Map the four offers to organizational needs; request team-training discussion','/press':'Approved four-offer fact sheet and verified biography','/access':'Replace legacy REP waitlist with explicit current program intent','/summit':'Confirm event status; working notification and speaker actions','/rxd-free-workshop':'Archive or update past June workshop; accurate registration state','/rxd':'Explain RXD; white paper; scorecard; RPDP application','/rxd-scorecard':'Educational assessment tool; explain scale and next learning step','/robotics-map':'Source-backed directory; remove unready scoring','/connect':'General contact with direct program inquiry routing'}.get(path,'Utility, policy, redirect, or error route; retain a clear purpose')
with (root/'page-review.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.writer(f); writer.writerow(['URL','Status','Final URL','Recommended role','Detected review flags','Review level'])
    for p in pages:
        flags=[]
        if p['status']!=200: flags.append('HTTP '+str(p['status']))
        if p['final']!=p['url']: flags.append('Redirect: review canonical destination')
        if re.search(r'\bREP\b',p['text']): flags.append('REP in body/template: classify historical versus active promotion')
        if any('/learn/rep' in a['href'] for a in p['links']): flags.append('Legacy REP destination present (often shared footer)')
        if any(a['href']=='#' for a in p['links']): flags.append('YouTube placeholder #')
        if 'May 2026' in p['fullText']: flags.append('May 2026 reference: check past-cohort context')
        if 'The Robot Age — The Robot Age' in p['title']: flags.append('Repeated brand in title')
        if any(i['source']==p['url'] and i['issue'].startswith('HTTP') for i in issues): flags.append('Links to a confirmed HTTP error')
        if '/es/' in p['url']: flags.append('Locale/content parity review')
        level='Automated/template-level' if '/jobs' in p['url'] or '/es' in p['url'] else 'Core/editorial review plus automated scan'
        writer.writerow([p['url'],p['status'],p['final'],role(urlsplit(p['url']).path),'; '.join(flags) or 'No automated flag; not independent factual clearance',level])

text=(root/'report.txt').read_text(encoding='utf-8')
def linked(s):
    s=html.escape(s)
    return re.sub(r'https://[^\s<>]+',lambda m:'<a href="'+m[0]+'">'+m[0]+'</a>',s)
blocks=[]
for paragraph in text.split('\n\n'):
    if re.match(r'^\d+\. [A-Z]',paragraph):
        lines=paragraph.split('\n',1)
        blocks.append('<h2>'+html.escape(lines[0])+'</h2>')
        if len(lines)>1: blocks.append('<p>'+linked(lines[1]).replace('\n','<br>')+'</p>')
    elif paragraph.startswith(('P0 —','P1 —','P2 —')):
        title,_,body=paragraph.partition('\n')
        blocks.append('<section class="finding"><h3>'+html.escape(title)+'</h3><p>'+linked(body).replace('\n','<br>')+'</p></section>')
    elif paragraph.startswith('Home /'):
        blocks.append('<pre>'+html.escape(paragraph)+'</pre>')
    else: blocks.append('<p>'+linked(paragraph).replace('\n','<br>')+'</p>')
head='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>The Robot Age — Site Audit — October 14, 2026</title><style>
body{margin:0;background:#f5f4ef;color:#202820;font:17px/1.65 system-ui,sans-serif}main{max-width:1040px;margin:auto;padding:50px 32px 100px}h1{font-size:42px;line-height:1.1;max-width:800px}h2{font-size:24px;margin-top:56px;border-top:2px solid #b7c4ac;padding-top:24px}h3{font-size:19px;line-height:1.45;margin-top:0}p{white-space:normal}a{color:#285b45;overflow-wrap:anywhere}.intro{font-size:21px;max-width:850px}.facts{display:flex;gap:24px;flex-wrap:wrap;padding:24px 0;border-block:1px solid #b7c4ac}.facts strong{font-size:28px;display:block}.finding{background:white;border-left:4px solid #3d6b50;padding:24px;margin:24px 0}.finding p{margin-bottom:0}pre{white-space:pre-wrap;font:15px/1.7 ui-monospace,monospace;background:#e9eee4;padding:24px}nav{margin:28px 0}footer{border-top:1px solid #b7c4ac;margin-top:40px;padding-top:20px;font-size:14px}@media print{body{background:white;font-size:10pt}main{padding:0;max-width:none}.finding{break-inside:avoid}h2,h3{break-after:avoid}a{color:inherit}}
</style><main><h1>One coherent story.<br>Four clear ways to participate.</h1><p class="intro">Robot Literacy → understand. Live Robot Lab → experience.<br>RPDP → design. RDP → prepare deployments.</p><div class="facts"><div><strong>555</strong>URL checks</div><div><strong>550</strong>successful final responses</div><div><strong>5</strong>404 destinations</div><div><strong>230</strong>Spanish URLs</div></div><nav><a href="page-review.csv">Page-by-page review CSV</a> · <a href="page-inventory.csv">URL inventory</a> · <a href="link-issues.json">Link evidence</a> · <a href="report.txt">Plain-text report</a></nav>'''
(root/'site-audit.html').write_text(head+'\n'.join(blocks)+'<footer>Prepared from direct public-site retrieval and repository inspection. No production changes or form submissions.</footer></main></html>',encoding='utf-8')
(root/'program-reference.txt').write_text('Canonical program reference for future site work — user-directed model, 14 October 2026\n\nRobot Literacy: READ / RELATE / COEXIST; /robot-literacy; foundational understanding.\nLive Robot Lab: guided in-person experience; /live-robot-lab; school/university/corporate/event inquiry.\nRPDP: Product Design for Robots; credential Robotics Product Design Practitioner; /learn/rpdp; 5 weeks / 25 hours; planned February 2027; student $149 / professional $299; interest list is not a seat reservation.\nRDP: Robot Deployment Practitioner; /learn/rdp; 4 weeks / 24 hours; published commercial launch January 2027; price not confirmed in reviewed page.\n\nUse /learn as the current professional-program source. These are four offers, two professional credential pathways. REP/RSP/RXR belong to legacy material pending owner status confirmation. Do not claim they were renamed or transfer prior credentials without confirmation. Published dates/prices may change; verify before reuse. See site-audit.html for evidence, caveats, and recommendations.\n',encoding='utf-8')
print('Created site-audit.html, page-review.csv, and program-reference.txt; reviewed',len(pages),'URL records')

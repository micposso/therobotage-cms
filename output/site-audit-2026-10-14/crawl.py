import concurrent.futures, json, re, urllib.request, urllib.error, urllib.parse, pathlib, csv
from bs4 import BeautifulSoup
BASE='https://therobotage.com'
OUT=pathlib.Path(__file__).parent
def fetch(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'TheRobotAgeContentAudit/1.0'}),timeout=35) as r:
            return r.status,r.url,r.read().decode('utf-8','replace')
    except urllib.error.HTTPError as e: return e.code,url,e.read().decode('utf-8','replace')
    except Exception as e: return 0,url,str(e)
status,_,xml=fetch(BASE+'/sitemap.xml')
urls=set(re.findall(r'<loc>(.*?)</loc>',xml))
urls.update(BASE+p for p in ['/','/learn','/learn/rdp','/learn/rdp/curriculum','/robot-literacy/partners','/press','/rxd-scorecard','/rxd-free-workshop','/what-robot-are-you','/robotics-map','/notify','/research/field-signals'])
def page(url):
    status,final,html=fetch(url)
    soup=BeautifulSoup(html,'html.parser')
    for el in soup(['script','style','noscript','svg']): el.decompose()
    links=[{'label':a.get_text(' ',strip=True),'href':a.get('href','')} for a in soup.find_all('a')]
    ids=[a['id'] for a in soup.find_all(id=True)]
    buttons=[a.get_text(' ',strip=True) for a in soup.find_all('button')]
    full=soup.get_text('\n',strip=True)
    for el in soup.select('nav,footer,header'): el.decompose()
    return {'url':url,'status':status,'final':final,'title':soup.title.get_text() if soup.title else '', 'text':soup.get_text('\n',strip=True),'fullText':full,'links':links,'buttons':buttons,'ids':ids}
pages={}
for round in range(4):
    pending=sorted(urls-set(pages))
    if not pending: break
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for p in pool.map(page,pending): pages[p['url']]=p
    print('Round',round,'pages',len(pages),flush=True)
    for p in list(pages.values()):
        for l in p['links']:
            u=urllib.parse.urlsplit(urllib.parse.urljoin(p['url'],l['href']))
            if u.netloc=='therobotage.com' and not re.search(r'\.[a-zA-Z0-9]+$',u.path) and not u.path.startswith('/api/'):
                urls.add(BASE+(u.path.rstrip('/') or '/'))
json.dump(list(pages.values()),open(OUT/'crawl.json','w',encoding='utf-8'),ensure_ascii=False,indent=2)
with open(OUT/'page-inventory.csv','w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f);w.writerow(['URL','HTTP status','Final URL','Title','Legacy terms in body'])
    for p in pages.values(): w.writerow([p['url'],p['status'],p['final'],p['title'],','.join(sorted(set(re.findall(r'\b(?:REP|RSP|RXR|HSP)\b',p['text']))))])
issues=[]
for p in pages.values():
    for l in p['links']:
        u=urllib.parse.urlsplit(urllib.parse.urljoin(p['url'],l['href'])); target=BASE+(u.path.rstrip('/') or '/')
        if u.netloc!='therobotage.com': continue
        dest=pages.get(target)
        reason=''
        if l['href']=='#': reason='Placeholder #'
        elif dest and dest['status']>=400: reason='HTTP '+str(dest['status'])
        elif dest and u.fragment and urllib.parse.unquote(u.fragment) not in dest['ids']: reason='Fragment absent in server HTML (client review needed)'
        if reason: issues.append({'source':p['url'],**l,'issue':reason})
json.dump(issues,open(OUT/'link-issues.json','w',encoding='utf-8'),indent=2)
print(json.dumps({'pages':len(pages),'statuses':{str(s):sum(p['status']==s for p in pages.values()) for s in set(p['status'] for p in pages.values())},'linkIssues':len(issues)}),flush=True)

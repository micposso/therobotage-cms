"""Read only this repository's DEV checks; credentials stay in process memory."""
import argparse
import json
import os
import subprocess
from urllib.parse import quote
import requests

parser = argparse.ArgumentParser()
parser.add_argument('--ref', default='DEV')
args = parser.parse_args()
repo = 'micposso/therobotage-cms'
session = requests.Session()
session.headers.update({'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'})
environment = dict(os.environ, GIT_TERMINAL_PROMPT='0', GCM_INTERACTIVE='never')
credentials = subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,env=environment)
if credentials.returncode == 0:
    fields = dict(line.split('=',1) for line in credentials.stdout.splitlines() if '=' in line)
    if fields.get('password'):
        session.auth=(fields.get('username','git'),fields['password'])
def get(path):
    response=session.get('https://api.github.com/repos/'+repo+path,timeout=30)
    response.raise_for_status()
    return response.json()
commit=get('/commits/'+quote(args.ref,safe=''))
sha=commit['sha']
statuses=get('/commits/'+sha+'/status')
checks=get('/commits/'+sha+'/check-runs')
deployments=[]
for d in get('/deployments?sha='+sha+'&per_page=10'):
    states=get('/deployments/'+str(d['id'])+'/statuses?per_page=1')
    deployments.append({'environment':d['environment'],'state':states[0].get('state') if states else 'unknown','url':states[0].get('environment_url') if states else None,'log_url':states[0].get('log_url') if states else None})
print(json.dumps({'sha':sha,'combinedStatus':statuses['state'],'statuses':[{k:s.get(k) for k in ('context','state','description','target_url')} for s in statuses['statuses']],'checks':[{k:c.get(k) for k in ('name','status','conclusion','details_url')} for c in checks.get('check_runs',[])],'deployments':deployments},indent=2))

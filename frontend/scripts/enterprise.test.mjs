import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const url = (js) => 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
const stub = url('export class Resend { emails = { send: async (payload) => { globalThis.__enterpriseSent.push(payload); if(globalThis.__enterpriseThrows) throw Error("provider unavailable"); return {error: globalThis.__enterpriseError}; } } }')
function load(file) {
  let code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  code = code.replace(/from ['"]([^'"]+)['"]/g, (match, spec) => {
    if(spec === 'resend') return 'from ' + JSON.stringify(stub)
    if(spec.startsWith('@/')) return 'from ' + JSON.stringify(load(path.join(root, 'src', spec.slice(2) + '.ts')))
    if(spec.startsWith('.')) return 'from ' + JSON.stringify(load(path.resolve(path.dirname(file), spec + '.ts')))
    return match
  })
  return url(code)
}
const { validateEnterpriseRequest, enterpriseFields } = await import(load(path.join(root,'src/lib/enterpriseRequest.ts')))
const { sendEnterpriseRequest } = await import(load(path.join(root,'src/app/actions/sendEnterpriseRequest.ts')))
const priorKey = process.env.RESEND_API_KEY
after(() => { if(priorKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = priorKey })
function payload() {
  const data = new FormData()
  Object.entries({name:'Alex Example',email:'alex@example.com',organization:'Example Robotics',companyType:'Robot manufacturer',robot:'Delivery AMR',stage:'First customer deployments',languages:'English and Spanish\nEvening shift',context:'Pilot for <six> staff & supervisors'}).forEach(([k,v])=>data.set(k,v))
  return data
}
test('requires the four business identity fields and rejects forged select values and oversized input', () => {
  assert.deepEqual(Object.keys(validateEnterpriseRequest(new FormData())), ['name','email','organization','companyType'])
  assert.deepEqual(validateEnterpriseRequest(payload()), {})
  const data = payload()
  data.set('email','person @example.com'); data.set('stage','not a stage'); data.set('companyType','not a company'); data.set('context','x'.repeat(3001))
  assert.deepEqual(Object.keys(validateEnterpriseRequest(data)),['email','companyType','stage','context'])
})
test('optional deployment details may be empty', () => {
  const data=payload()
  for(const field of enterpriseFields.filter(x=>!x.required)) data.delete(field.name)
  assert.deepEqual(validateEnterpriseRequest(data),{})
})
test('server rejects invalid input, honeypots and missing configuration without sending', async () => {
  globalThis.__enterpriseSent=[]
  process.env.RESEND_API_KEY='test-only'
  assert.equal((await sendEnterpriseRequest({success:false},new FormData())).success,false)
  const spam=payload(); spam.set('website','spam')
  assert.equal((await sendEnterpriseRequest({success:false},spam)).success,false)
  delete process.env.RESEND_API_KEY
  assert.equal((await sendEnterpriseRequest({success:false},payload())).success,false)
  assert.equal(globalThis.__enterpriseSent.length,0)
})
test('all eight fields reach the existing notification with escaping; provider failures never claim success', async () => {
  process.env.RESEND_API_KEY='test-only'
  globalThis.__enterpriseSent=[];globalThis.__enterpriseError=null;globalThis.__enterpriseThrows=false
  assert.equal((await sendEnterpriseRequest({success:false},payload())).success,true)
  const sent=globalThis.__enterpriseSent[0]
  assert.equal(sent.to,'mike@therobotage.com')
  assert.equal(sent.replyTo,'alex@example.com')
  for(const field of enterpriseFields) assert.ok(sent.html.includes(field.label),field.name)
  assert.ok(sent.html.includes('English and Spanish<br />Evening shift'))
  assert.ok(sent.html.includes('&lt;six&gt;'))
  assert.ok(!sent.html.includes('<six>'))
  globalThis.__enterpriseError={message:'rejected'}
  assert.equal((await sendEnterpriseRequest({success:false},payload())).success,false)
  globalThis.__enterpriseThrows=true
  assert.equal((await sendEnterpriseRequest({success:false},payload())).success,false)
})
test('enterprise prose, form labels, options, errors and metadata have Spanish copy', async () => {
  const {enterpriseContent}=await import(load(path.join(root,'src/app/(english)/enterprise/content.ts')))
  const es={...JSON.parse(fs.readFileSync(path.join(root,'src/lib/i18n/ui-es.json'),'utf8')),...JSON.parse(fs.readFileSync(path.join(root,'src/lib/i18n/enterprise-es.json'),'utf8'))}
  function check(value) {
    if(typeof value==='string' && !value.startsWith('/')) assert.ok(es[value], 'Missing Spanish: '+value)
    else if(Array.isArray(value)) value.forEach(check)
    else if(value && typeof value==='object') Object.values(value).forEach(check)
  }
  check(enterpriseContent)
  for(const field of enterpriseFields){check(field.label);if('options' in field)check(field.options)}
  check(Object.values(validateEnterpriseRequest(new FormData())))
})

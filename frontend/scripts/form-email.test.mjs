import { testModule } from './test-module.mjs'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')
const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
function setTestKey(t) {
  const previous = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = 'test-only-secret'
  t.after(() => { if (previous === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = previous })
}

const enterprise = await testModule(new URL('../src/lib/enterpriseRequest.ts', import.meta.url))
const template = await testModule(new URL('../src/lib/emailTemplate.ts', import.meta.url))

test('enterprise validates input, includes every field, and requires provider acceptance', async (t) => {
  setTestKey(t)
  t.mock.method(console, 'error', () => {})
  const source = compile(await read('../src/app/actions/sendEnterpriseRequest.ts'))
  for (const mode of ['accepted', 'rejected', 'exception']) {
    const mock = moduleUrl(`export class Resend { emails = { send: async (payload) => {
      globalThis.__formEmailPayload = payload;
      ${mode === 'exception' ? "throw new Error('offline')" : `return { error: ${mode === 'rejected' ? "'rejected'" : 'null'} }`}
    } } }`)
    const { sendEnterpriseRequest } = await import(moduleUrl(source.replace("'resend'", JSON.stringify(mock)).replace("'@/lib/emailTemplate'", JSON.stringify(template)).replace("'@/lib/enterpriseRequest'", JSON.stringify(enterprise))))
    const data = new FormData()
    delete globalThis.__formEmailPayload
    assert.equal((await sendEnterpriseRequest({ success: false }, data)).success, false)
    assert.equal(globalThis.__formEmailPayload, undefined)
    for (const [key, value] of Object.entries({ name: '<script>name</script>', email: 'person@example.com', organization: 'Example', companyType: 'Robot manufacturer', service: 'Robot Community Readiness', robot: 'Warehouse robots' })) data.set(key, value)
    assert.equal((await sendEnterpriseRequest({ success: false }, data)).success, mode === 'accepted')
    const payload = globalThis.__formEmailPayload
    assert.equal(payload.to, 'mike@therobotage.com')
    assert.equal(payload.replyTo, 'person@example.com')
    assert.ok(payload.html.includes('&lt;script&gt;name&lt;/script&gt;'))
    for (const value of ['Example', 'Robot manufacturer', 'Robot Community Readiness', 'Warehouse robots']) assert.ok(payload.html.includes(value))
    data.set('email', 'invalid')
    assert.equal((await sendEnterpriseRequest({ success: false }, data)).success, false)
    data.set('email', 'person@example.com')
    data.set('service', 'Unsupported service')
    assert.equal((await sendEnterpriseRequest({ success: false }, data)).success, false)
  }
  delete globalThis.__formEmailPayload
})

const accessUrl = await testModule(new URL('../src/lib/whitepaper-access.ts', import.meta.url))
const access = await import(accessUrl)

test('whitepaper signup saves contacts before sending and fails closed on provider errors', async (t) => {
  t.mock.method(console, 'error', () => {})
  setTestKey(t)
  const source = compile(await read('../src/app/actions/sendWhitepaperEmail.ts'))
  for (const mode of ['new', 'existing', 'rate-limit', 'lookup-error', 'save-error', 'send-error', 'exception']) {
    globalThis.__whitepaperCalls = []
    const mock = moduleUrl(`export class Resend {
      contacts = {
        get: async (payload) => {
          globalThis.__whitepaperCalls.push(['get', payload]);
          if (${JSON.stringify(mode)} === 'exception') throw new Error('offline');
          return ${mode === 'existing' ? "{data:{id:'saved',unsubscribed:true},error:null}" : mode === 'lookup-error' ? "{data:null,error:{name:'restricted_api_key'}}" : "{data:null,error:{name:'not_found'}}"};
        },
        create: async (payload) => {
          globalThis.__whitepaperCalls.push(['create', payload]);
          return ${mode === 'save-error' ? "{data:null,error:{name:'restricted_api_key'}}" : "{data:{id:'saved'},error:null}"};
        }
      };
      emails = { send: async (payload) => {
        globalThis.__whitepaperCalls.push(['send', payload]);
        if (${JSON.stringify(mode)} === 'rate-limit' && globalThis.__whitepaperCalls.filter(c => c[0] === 'send').length === 1) return {error:{name:'rate_limit_exceeded'}};
        return {error:${mode === 'send-error' ? "{name:'validation_error'}" : 'null'}};
      }};
    }`)
    const { sendWhitepaperEmail } = await import(moduleUrl(source
      .replace("'resend'", JSON.stringify(mock))
      .replace("'@/lib/emailTemplate'", JSON.stringify(template))
      .replace("'@/lib/whitepaper-access'", JSON.stringify(accessUrl))))
    const form = new FormData()
    form.set('email', 'invalid')
    assert.equal((await sendWhitepaperEmail(null, form)).success, false)
    assert.deepEqual(globalThis.__whitepaperCalls, [])
    form.set('email', '  Person@Example.com  ')
    const result = await sendWhitepaperEmail(null, form)
    assert.equal(result.success, ['new', 'existing', 'rate-limit'].includes(mode), mode)
    const calls = globalThis.__whitepaperCalls
    assert.equal(calls[0][1].email, 'person@example.com')
    if (mode === 'existing') assert.deepEqual(calls.map(c => c[0]), ['get', 'send'])
    if (mode === 'new') {
      assert.deepEqual(calls.map(c => c[0]), ['get', 'create', 'send'])
      assert.deepEqual(calls[1][1], {email:'person@example.com',unsubscribed:false})
    }
    if (result.success) {
      const url = new URL(result.downloadUrl, 'https://therobotage.com')
      assert.equal(access.hasWhitepaperAccess(url.searchParams.get('token')), true)
      assert.ok(calls.at(-1)[1].html.includes(result.downloadUrl))
    } else {
      assert.equal(result.downloadUrl, undefined)
      if (mode !== 'send-error') assert.ok(!calls.some(c => c[0] === 'send'))
    }
  }
  delete globalThis.__whitepaperCalls
})

test('download requires a valid, unexpired signup token for GET and HEAD', async (t) => {
  setTestKey(t)
  const source = compile(await read('../src/app/api/download/whitepaper/route.ts'))
  const next = moduleUrl('export const NextResponse = { redirect: (url, status) => new Response(null, {status, headers: {Location: String(url)}}) }')
  const fs = moduleUrl(`export async function readFile() { return new TextEncoder().encode('%PDF-test') }`)
  const { GET, HEAD } = await import(moduleUrl(source
    .replace("'next/server'", JSON.stringify(next))
    .replace("'@/lib/whitepaper-access'", JSON.stringify(accessUrl))
    .replace("'node:fs/promises'", JSON.stringify(fs))))
  const token = access.createWhitepaperToken()
  assert.equal(access.hasWhitepaperAccess(token), true)
  for (const value of [null, '', 'invalid', token + 'x', token.replace(/^\d+/, '1'), token.replace(/^\d+/, '9999999999999')]) {
    for (const handler of [GET, HEAD]) {
      const response = await handler(new Request('https://therobotage.com/api/download/whitepaper' + (value ? '?token=' + value : '')))
      assert.equal(response.status, 307)
      assert.equal(response.headers.get('Location'), 'https://therobotage.com/rxd#whitepaper')
      assert.match(response.headers.get('Cache-Control'), /no-store/)
    }
  }
  const response = await GET(new Request('https://therobotage.com/api/download/whitepaper?token=' + token))
  assert.equal(response.headers.get('Content-Type'), 'application/pdf')
  assert.equal(await response.text(), '%PDF-test')
  const head = await HEAD(new Request('https://therobotage.com/api/download/whitepaper?token=' + token))
  assert.equal(head.status, 200)
  assert.equal(await head.text(), '')
  t.mock.method(Date, 'now', () => Number(token.split('.')[0]) + 1)
  assert.equal(access.hasWhitepaperAccess(token), false)
})

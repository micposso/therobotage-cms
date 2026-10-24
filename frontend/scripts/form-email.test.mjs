import { testModule } from './test-module.mjs'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')
const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const template = await testModule(new URL('../src/lib/emailTemplate.ts', import.meta.url))
const enterprise = await testModule(new URL('../src/lib/enterpriseRequest.ts', import.meta.url))

test('enterprise validates input, includes every field, and requires provider acceptance', async (t) => {
  t.mock.method(console, 'error', () => {})
  const previousKey = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = 'test-placeholder'
  t.after(() => {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = previousKey
  })
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

test('download notifies Mike and still redirects to the PDF when email fails', async (t) => {
  t.mock.method(console, 'error', () => {})
  const source = compile(await read('../src/app/api/download/whitepaper/route.ts'))
  const next = moduleUrl('export const NextResponse = { redirect: (url, status) => new Response(null, {status, headers: {Location: String(url)}}) }')
  for (const mode of ['accepted', 'rejected', 'exception']) {
    const mock = moduleUrl(`export class Resend { emails = { send: async (payload) => {
      globalThis.__downloadEmailPayload = payload;
      ${mode === 'exception' ? "throw new Error('offline')" : `return { error: ${mode === 'rejected' ? "'rejected'" : 'null'} }`}
    } } }`)
    const { GET } = await import(moduleUrl(source.replace("'resend'", JSON.stringify(mock)).replace("'next/server'", JSON.stringify(next))))
    const response = await GET(new Request('https://therobotage.com/api/download/whitepaper'))
    assert.equal(response.status, 307)
    assert.equal(response.headers.get('Location'), 'https://therobotage.com/pdf/rxd-therobotage-v2.pdf')
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
    assert.equal(globalThis.__downloadEmailPayload.to, 'mike@therobotage.com')
  }
  delete globalThis.__downloadEmailPayload
})

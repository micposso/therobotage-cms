import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createClient } from '@supabase/supabase-js'
import ts from 'typescript'
import { testModule } from './test-module.mjs'

const token = '69dd298a-eef3-48d5-b86b-191dc3fc0490'
const origin = 'https://therobotage.com'
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`

async function load(path, aliases) {
  let source = ts.transpileModule(await readFile(new URL(`../src/${path}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  for (const [specifier, url] of Object.entries(aliases)) {
    source = source.replace(`'${specifier}'`, JSON.stringify(url))
  }
  return import(moduleUrl(source))
}

const aliases = {
  'next/server': moduleUrl('export const NextResponse = Response'),
  'next/headers': moduleUrl('export const headers = async () => new Headers()'),
  resend: import.meta.resolve('resend'),
  '@/lib/supabase/admin': moduleUrl('export const getSupabaseJobsService = () => globalThis.jobAlertsDb'),
  '@/lib/jobs': moduleUrl('export const mapPublicJobRow = row => row; export const toJobCard = job => job'),
  '@/lib/jobFilters': await testModule(new URL('../src/lib/jobFilters.ts', import.meta.url)),
  '@/lib/jobsTaxonomy': moduleUrl(`
    export const ROLE_FAMILY_LABELS = { product: 'Product' }, ROLE_FAMILY_SLUGS = ['product'];
    export const SENIORITY_LABELS = {}, SENIORITY_SLUGS = [], STATE_NAMES = {}, STATE_CODES = ['NY'];
  `),
  '@/lib/jobAlertEmail': moduleUrl(`
    export const getJobAlertFromAddress = () => 'jobs@example.com';
    export const getJobAlertAdminAddress = () => 'admin@example.com';
    export const jobAlertUnsubscribeHeaders = token => ({ 'List-Unsubscribe': token });
    export const jobAlertDigestSubject = jobs => jobs.map(job => job.slug).join(',');
    export const jobAlertDigestHtml = () => '<p>Digest</p>';
    export const jobAlertWelcomeHtml = ({ browseUrl }) => browseUrl;
  `),
}

const { GET: digest } = await load('app/api/cron/job-alerts/route.ts', aliases)
const { POST: oneClick } = await load('app/api/jobs/alerts/unsubscribe/route.ts', aliases)
const { subscribeJobAlerts } = await load('app/actions/subscribeJobAlerts.ts', aliases)

function mockServices(t, respond) {
  const env = { ...process.env, CRON_SECRET: 'test-cron', RESEND_API_KEY: 'test-resend', JOB_ALERT_SEND_DAY: '2' }
  t.mock.method(console, 'error', () => {})
  t.mock.method(globalThis, 'fetch', async (url, init) => respond(new URL(url), init))
  const previousEnv = process.env
  process.env = env
  globalThis.jobAlertsDb = createClient('https://test.supabase.co', 'test-key', { auth: { persistSession: false } })
  t.after(() => {
    delete globalThis.jobAlertsDb
    process.env = previousEnv
  })
}

const digestRequest = (query, secret = 'test-cron') =>
  new Request(`${origin}/api/cron/job-alerts?${query}`, { headers: { Authorization: `Bearer ${secret}` } })

test('empty digests succeed and dry runs work off schedule', async (t) => {
  let reads = 0
  mockServices(t, (url, { method }) => {
    assert.equal(method, 'GET')
    assert.equal(url.pathname, '/rest/v1/public_jobs')
    reads += 1
    return Response.json([])
  })
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-11-18T14:00:00Z') })
  assert.equal((await digest(digestRequest('dryRun=1', 'wrong'))).status, 401)
  assert.equal((await (await digest(digestRequest(''))).json()).skipped, 'not send day')
  assert.equal(reads, 0)

  const result = await (await digest(digestRequest('dryRun=1'))).json()
  assert.equal(result.ok, true)
  assert.equal(result.jobsInWindow, 0)
  assert.deepEqual(result.failures, [])
  assert.deepEqual(result.plan, [])
  assert.equal(reads, 1)
})

test('a digest only emails jobs it claimed and reports delivery failures', async (t) => {
  const subscriber = {
    id: 'sub', email: 'person@example.com', role_families: ['product'], seniorities: ['mid'],
    states: ['NY'], remote_only: false, unsubscribe_token: token, send_count: 0, last_sent_at: null,
  }
  const job = { roleFamily: 'product', seniority: 'mid', stateCode: 'CA', remoteType: 'remote-us' }
  const claims = []
  const mail = []
  const mailKeys = []
  const releases = []
  const sendStatuses = []
  let historyStatus = 200
  mockServices(t, (url, { method, body, headers }) => {
    const payload = body && JSON.parse(body)
    if (url.pathname === '/emails/batch') {
      mail.push(...payload)
      mailKeys.push(new Headers(headers).get('Idempotency-Key'))
      const sendStatus = sendStatuses.shift() ?? 200
      return Response.json(sendStatus === 200
        ? { data: [{ id: 'delivered' }] }
        : { name: 'validation_error', message: 'Rejected', statusCode: sendStatus }, { status: sendStatus })
    }
    if (url.pathname === '/rest/v1/public_jobs') {
      return Response.json([
        { ...job, id: 'already-claimed', slug: 'already-claimed' },
        { ...job, id: 'new-closing-job', slug: 'new-closing-job' },
        { ...job, id: 'wrong-state', slug: 'wrong-state', remoteType: 'onsite' },
      ])
    }
    if (url.pathname === '/rest/v1/job_alert_subscribers') {
      if (method === 'PATCH') {
        subscriber.last_sent_at = payload.last_sent_at
        return new Response(null, { status: 204 })
      }
      return Response.json(url.searchParams.has('id') ? [] : [subscriber])
    }
    assert.equal(url.pathname, '/rest/v1/job_alert_sends')
    if (method === 'POST') {
      claims.push(...payload)
      return Response.json(payload.filter(({ job_id }) => job_id !== 'already-claimed'))
    }
    if (method === 'DELETE') {
      releases.push(url.searchParams.get('digest_id'))
      return new Response(null, { status: 204 })
    }
    return Response.json(historyStatus === 200 ? [] : { message: 'Unavailable' }, { status: historyStatus })
  })
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-11-17T14:00:00Z') })

  assert.equal((await (await digest(digestRequest(''))).json()).digestsSent, 1)
  assert.deepEqual(claims.map((row) => row.job_id), ['already-claimed', 'new-closing-job'])
  assert.deepEqual(mail.map((email) => email.subject), ['new-closing-job'])
  assert.equal((await (await digest(digestRequest(''))).json()).digestsSent, 0)

  subscriber.last_sent_at = null
  sendStatuses.push(422)
  const rejected = await (await digest(digestRequest(''))).json()
  assert.equal(rejected.ok, false)
  assert.equal(rejected.digestsSent, 0)
  assert.deepEqual(releases, [`eq.${rejected.digestId}`])

  sendStatuses.push(503, 503)
  assert.equal((await (await digest(digestRequest(''))).json()).ok, false)
  assert.equal(releases.length, 1)
  assert.ok(mailKeys[2])
  assert.equal(mailKeys[2], mailKeys[3])

  sendStatuses.push(503, 200)
  assert.equal((await (await digest(digestRequest(''))).json()).digestsSent, 1)
  assert.ok(mailKeys[4])
  assert.equal(mailKeys[4], mailKeys[5])
  assert.equal(releases.length, 1)

  subscriber.last_sent_at = null
  historyStatus = 400
  assert.deepEqual((await (await digest(digestRequest(''))).json()).failures, ['Failed to load send history'])
  assert.equal(mail.length, 6)
})

test('signup saves fast submissions, normalizes email, and sends a welcome message', async (t) => {
  const calls = []
  mockServices(t, (url, { body }) => {
    calls.push([url.pathname, JSON.parse(body)])
    return Response.json(url.pathname === '/emails' ? { id: 'welcome' } : { unsubscribe_token: token })
  })
  const form = new FormData()
  form.set('email', '  Person@Example.com  ')
  form.set('role_families', 'product')
  form.set('states', 'NY')
  form.set('remote_only', 'on')
  form.set('startedAt', String(Date.now()))
  assert.equal((await subscribeJobAlerts(null, form)).success, true)
  assert.deepEqual(calls.map(([path]) => path), ['/rest/v1/job_alert_subscribers', '/emails'])
  assert.equal(calls[0][1].email, 'person@example.com')
  assert.deepEqual(calls[0][1].role_families, ['product'])
  assert.equal(calls[1][1].to, 'person@example.com')
})

test('one-click unsubscribe requires the form action and retries on database failure', async (t) => {
  let status = 503
  let writes = 0
  mockServices(t, (url, { method, body }) => {
    assert.equal(method, 'PATCH')
    assert.equal(url.searchParams.get('unsubscribe_token'), `eq.${token}`)
    assert.equal(JSON.parse(body).status, 'unsubscribed')
    writes += 1
    return status === 204 ? new Response(null, { status }) : Response.json({ message: 'Unavailable' }, { status })
  })
  const post = (body) => oneClick(new Request(`${origin}/api/jobs/alerts/unsubscribe?token=${token}`, { method: 'POST', body }))
  assert.equal((await post(new URLSearchParams({ ignored: 'One-Click' }))).status, 400)
  assert.equal(writes, 0)
  assert.equal((await post(new URLSearchParams({ 'List-Unsubscribe': 'One-Click' }))).status, 503)
  status = 204
  const multipart = new FormData()
  multipart.set('List-Unsubscribe', 'One-Click')
  assert.equal((await post(multipart)).status, 200)
  assert.equal(writes, 2)
})

test('the scoped Supabase client authenticates with a separate project API key', async (t) => {
  let requestHeaders
  mockServices(t, (_url, { headers }) => {
    requestHeaders = new Headers(headers)
    return Response.json([])
  })
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.SUPABASE_JOBS_SERVICE_KEY = 'test-scoped-token'
  process.env.SUPABASE_PUBLISHABLE_KEY = 'test-publishable-key'
  const { getSupabaseJobsService } = await load('lib/supabase/admin.ts', {
    'server-only': moduleUrl(''),
    '@supabase/supabase-js': import.meta.resolve('@supabase/supabase-js'),
  })
  assert.equal((await getSupabaseJobsService().from('job_alert_subscribers').select('id')).error, null)
  assert.equal(requestHeaders.get('Authorization'), 'Bearer test-scoped-token')
  assert.equal(requestHeaders.get('apikey'), 'test-publishable-key')
})

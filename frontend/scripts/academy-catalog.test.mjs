import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'
import { testModule } from './test-module.mjs'

const catalogUrl = await testModule(new URL('../../packages/ui/src/lib/certifications.ts', import.meta.url))
const catalog = await import(catalogUrl)
const interestsUrl = await testModule(new URL('../src/lib/academyInterest.ts', import.meta.url))
const templateUrl = await testModule(new URL('../src/lib/emailTemplate.ts', import.meta.url))
const { parseAcademyInterest } = await import(interestsUrl)
const { waitlistConfirmationHtml } = await import(templateUrl)
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const offerUrl = await testModule(new URL('../src/lib/rpdp-registration.ts', import.meta.url))
const { foundingPrice, isRpdpPromotionActive, rpdpPrices, rpdpConfirmation } = await import(offerUrl)

test('public catalog contains four offers and only the two current credentials', () => {
  assert.deepEqual(catalog.getAllCertificationSlugs(), ['rpdp', 'rdp'])
  assert.deepEqual(catalog.programLinks.map(p => p.href), ['/robot-literacy', '/live-robot-lab', '/learn/rpdp', '/learn/rdp'])
  for (const slug of ['rep', 'rsp', 'rxr', 'hsp']) {
    assert.equal(catalog.getCertificationBySlug(slug), undefined)
    assert.equal(catalog.isLegacyCredential(slug), true)
  }
  assert.equal(catalog.isLegacyCredential('unknown'), false)
})

test('interest parser preserves RDP and rejects forged fields without breaking generic legacy forms', () => {
  for (const interest of ['rpdp', 'rdp', 'academy']) assert.equal(parseAcademyInterest(interest), interest)
  assert.equal(parseAcademyInterest(null), 'academy')
  for (const invalid of ['rep', 'constructor', '__proto__', '', new Blob(['rdp'])]) assert.equal(parseAcademyInterest(invalid), undefined)
})

test('RPDP founding pricing and eligibility follow the New York campaign dates', () => {
  assert.deepEqual(rpdpPrices, { professional: 50_000, student: 25_000 })
  assert.equal(foundingPrice(rpdpPrices.professional), 40_000)
  assert.equal(foundingPrice(rpdpPrices.student), 20_000)
  assert.equal(catalog.rpdpProgram.weeks, 8)
  assert.equal(catalog.rpdpLiveHours, 20)
  assert.equal(catalog.rpdpIndependentHours, 16)
  assert.equal(catalog.rpdpLearningHours, 36)
  for (const [time, eligible] of [
    ['2026-11-23T04:59:59.999Z', false],
    ['2026-11-23T05:00:00.000Z', true],
    ['2026-12-01T04:59:59.999Z', true],
    ['2026-12-01T05:00:00.000Z', false],
    ['2026-12-01T05:00:00.001Z', false],
  ]) assert.equal(isRpdpPromotionActive(Date.parse(time)), eligible, time)
})

test('RPDP confirmation reflects only the saved offer, including historical quotes and terms', () => {
  const quote = { founding: true, tuitionMinor: 23_920, currency: 'USD', invitationDays: 5 }
  const text = rpdpConfirmation(quote, 'en', line => line).join(' ')
  assert.match(text, /\$239\.20 USD/)
  assert.match(text, /5 days after receiving the complete enrollment invitation/)
  assert.match(text, /does not reserve a seat/)
  assert.match(waitlistConfirmationHtml('rpdp', 'es', '', quote), /5 días desde que reciban la invitación completa/)
  const legacy = rpdpConfirmation({ founding: true, tuitionMinor: null, currency: null, invitationDays: null }, 'en', line => line).join(' ')
  assert.doesNotMatch(legacy, /\$|preserved founding tuition/)
  assert.match(legacy, /earlier interest registration/)
})

test('RPDP storage derives prices from the validated audience and ignores browser offer data', async () => {
  const storage = ts.transpileModule(await readFile(new URL('../src/lib/supabase/academy-interest.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: 'https://local.example.org',
    SUPABASE_PUBLISHABLE_KEY: 'test-only',
    SUPABASE_ACADEMY_INTEREST_SERVICE_KEY: 'test-only',
  }
  const supabase = moduleUrl(`export let call
    export function createClient() { return { rpc: async (name, args) => {
      call = { name, args }
      return { data: { firstRegistration: true, founding: true, tuitionMinor: 20000, currency: 'USD', invitationDays: 7 } }
    } } }`)
  const compiled = storage.replace("import 'server-only';", '')
    .replace("'@supabase/supabase-js'", JSON.stringify(supabase))
    .replace("'zod'", JSON.stringify(import.meta.resolve('zod')))
    .replace("'@/lib/certifications'", JSON.stringify(catalogUrl))
    .replace("'../rpdp-registration'", JSON.stringify(offerUrl))
  const { registerRpdp } = await import(moduleUrl(`const process = { env: ${JSON.stringify(env)} }; ${compiled}`))
  const data = new FormData()
  for (const [field, value] of Object.entries({
    name: 'Mock Registrant', audience: 'student', source_page: '/learn/rpdp', utm_source: 'mock',
    quoted_tuition_minor: '1', promo_eligible: 'false', submitted_at: '2100-01-01',
  })) data.set(field, value)
  const saved = await registerRpdp(data, 'MOCK@example.org')
  assert.equal(saved.quote.tuitionMinor, 20_000)
  const { call } = await import(supabase)
  assert.equal(call.name, 'record_academy_interest_offer')
  assert.equal(call.args.p_founding_tuition_minor, 20_000)
  assert.equal(call.args.p_standard_tuition_minor, 25_000)
  assert.equal(call.args.p_ends_before, '2026-12-01T05:00:00Z')
  assert.equal(call.args.p_email, 'mock@example.org')
  assert.equal(call.args.p_marketing_consent, false)
  assert.deepEqual(call.args.p_utm, { utm_source: 'mock' })
  assert.ok(!Object.hasOwn(call.args, 'p_submitted_at') && !Object.hasOwn(call.args, 'p_promo_eligible'))
  data.set('audience', 'invalid')
  assert.ok((await registerRpdp(data, 'mock@example.org')).error)
})

test('RPDP action confirms saved offers even if email fails and only sends on the first registration', async (t) => {
  t.mock.method(console, 'error', () => {})
  const previousKey = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = 'test-only'
  t.after(() => {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = previousKey
  })
  const action = ts.transpileModule(await readFile(new URL('../src/app/actions/joinWaitlist.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  const mock = moduleUrl(`export let sends = 0
    export class Resend { emails = { send: async payload => {
      if (!payload.html.includes('$400 USD') || !payload.html.includes('7 days after')) {
        throw new Error('Confirmation did not use the stored offer')
      }
      sends++
      return { error: { name: 'mock rejection' } }
    } } }`)
  const storage = moduleUrl(`export async function registerRpdp(form) {
    if (form.get('audience') === 'unavailable') throw new Error('mock outage')
    return { firstRegistration: form.get('audience') === 'professional',
      quote: { founding: true, tuitionMinor: 40000, currency: 'USD', invitationDays: 7 } }
  }`)
  const compiled = action.replace("'resend'", JSON.stringify(mock)).replace("'@/lib/emailTemplate'", JSON.stringify(templateUrl))
    .replace("'@/lib/academyInterest'", JSON.stringify(interestsUrl)).replace("'@/lib/supabase/academy-interest'", JSON.stringify(storage))
  const { joinWaitlist } = await import(moduleUrl(compiled))
  const mailer = await import(mock)
  const data = new FormData()
  data.set('name', 'Mock Registrant')
  data.set('email', 'mock@example.org')
  data.set('interest', 'rpdp')
  data.set('audience', 'professional')
  assert.equal((await joinWaitlist(null, data)).quote.tuitionMinor, 40_000)
  assert.equal(mailer.sends, 1)
  data.set('audience', 'student')
  assert.equal((await joinWaitlist(null, data)).quote.tuitionMinor, 40_000)
  assert.equal(mailer.sends, 1)
  data.set('audience', 'unavailable')
  assert.equal((await joinWaitlist(null, data)).success, false)
  assert.equal(mailer.sends, 1)
})

test('confirmation preserves selected program and locale, escapes input, and never promises a reservation', () => {
  for (const interest of ['rpdp', 'rdp', 'academy']) for (const locale of ['en', 'es']) {
    const body = waitlistConfirmationHtml(interest, locale, '<script>name</script>')
    assert.ok(body.includes('&lt;script&gt;name&lt;/script&gt;'))
    assert.ok(!body.includes('<script>'))
    assert.ok(body.includes(locale === 'es' ? 'no reserva una plaza' : 'does not reserve a seat'))
    assert.ok(body.includes(`https://therobotage.com${locale === 'es' ? '/es' : ''}/learn${interest === 'academy' ? '' : `/${interest}`}`))
    assert.doesNotMatch(body, /\bREP\b|May 2026|first in line|ten seats|seat is reserved/i)
  }
})

test('interest submission reports provider failure and preserves RDP in the delivered payload', async (t) => {
  t.mock.method(console, 'error', () => {})
  const previousKey = process.env.RESEND_API_KEY
  const action = ts.transpileModule(await readFile(new URL('../src/app/actions/joinWaitlist.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  try {
    for (const mode of ['accepted', 'rejected', 'exception', 'missing']) {
      process.env.RESEND_API_KEY = 'test-only'
      if (mode === 'missing') delete process.env.RESEND_API_KEY
      const mock = moduleUrl(`export class Resend { emails = { send: async payload => {
        if (!payload.subject.includes('RDP') || !payload.html.includes('/es/learn/rdp')) throw new Error('Lost program or locale');
        ${mode === 'exception' ? "throw new Error('offline')" : `return { error: ${mode === 'rejected' ? "'rejected'" : 'null'} }`}
      } } }`)
      const storage = moduleUrl("export function registerRpdp() { throw new Error('Unexpected RPDP write') }")
      const compiled = action.replace("'resend'", JSON.stringify(mock)).replace("'@/lib/emailTemplate'", JSON.stringify(templateUrl))
        .replace("'@/lib/academyInterest'", JSON.stringify(interestsUrl)).replace("'@/lib/supabase/academy-interest'", JSON.stringify(storage))
      const { joinWaitlist } = await import(moduleUrl(compiled))
      const data = new FormData()
      data.set('email', 'test@example.org'); data.set('interest', 'rdp'); data.set('locale', 'es')
      assert.equal((await joinWaitlist(null, data)).success, mode === 'accepted', mode)
      data.set('interest', 'rep')
      assert.equal((await joinWaitlist(null, data)).success, false)
      data.set('interest', 'rdp'); data.set('email', new Blob(['not-an-email']), 'file.txt')
      assert.equal((await joinWaitlist(null, data)).success, false)
    }
  } finally {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = previousKey
  }
})

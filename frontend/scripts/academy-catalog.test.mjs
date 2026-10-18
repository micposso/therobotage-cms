import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'
import { testModule } from './test-module.mjs'

const catalog = await import(await testModule(new URL('../../packages/ui/src/lib/certifications.ts', import.meta.url)))
const interestsUrl = await testModule(new URL('../src/lib/academyInterest.ts', import.meta.url))
const templateUrl = await testModule(new URL('../src/lib/emailTemplate.ts', import.meta.url))
const { parseAcademyInterest } = await import(interestsUrl)
const { waitlistConfirmationHtml } = await import(templateUrl)
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`

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
      const compiled = action.replace("'resend'", JSON.stringify(mock)).replace("'@/lib/emailTemplate'", JSON.stringify(templateUrl)).replace("'@/lib/academyInterest'", JSON.stringify(interestsUrl))
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

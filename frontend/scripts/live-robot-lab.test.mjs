import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const source = await readFile(
  new URL('../src/lib/liveRobotLab.ts', import.meta.url),
  'utf8',
)
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { validateLabRequest } = await import(
  `data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`
)
const validData = () => {
  const data = new FormData()
  Object.entries({
    name: 'Test Organizer',
    email: 'organizer@example.org',
    organization: 'Test School',
    organizationType: 'K–12 School',
    groupSize: '16–30',
    location: '10001',
  }).forEach(([key, value]) => data.set(key, value))
  return data
}

test('accepts a complete request with optional fields omitted', () => {
  assert.deepEqual(validateLabRequest(validData()), {})
})
test('rejects all six missing required fields and whitespace-only names', () => {
  assert.equal(Object.keys(validateLabRequest(new FormData())).length, 6)
  const data = validData()
  data.set('name', '   ')
  assert.ok(validateLabRequest(data).name)
})
test('rejects invalid email, tampered selects, oversized text, and impossible dates', () => {
  for (const [key, value] of [
    ['email', 'not-an-email'],
    ['organizationType', 'forged'],
    ['groupSize', '500'],
    ['experience', 'x'.repeat(3001)],
    ['date', '2026-02-30'],
  ]) {
    const data = validData()
    data.set(key, value)
    assert.ok(validateLabRequest(data)[key], key)
  }
})
test('accepts international names, email plus addressing, and leap day', () => {
  const data = validData()
  data.set('name', 'José 李')
  data.set('email', 'organizer+lab@example.org')
  data.set('date', '2028-02-29')
  assert.deepEqual(validateLabRequest(data), {})
})

test('server submission reports provider acceptance, rejection, and missing configuration honestly', async () => {
  const asModule = (code) =>
    `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  const template = await readFile(
    new URL('../src/lib/emailTemplate.ts', import.meta.url),
    'utf8',
  )
  const action = await readFile(
    new URL('../src/app/actions/sendLiveRobotLabRequest.ts', import.meta.url),
    'utf8',
  )
  const compile = (code) =>
    ts.transpileModule(code, {
      compilerOptions: { module: ts.ModuleKind.ESNext },
    }).outputText
  const originalKey = process.env.RESEND_API_KEY
  try {
    for (const mode of ['accepted', 'rejected', 'exception', 'missing']) {
      // Substitute Resend at the module boundary: this test never contacts a provider.
      const mock =
        asModule(`export class Resend { emails = { send: async (payload) => {
        if (!payload.html.includes('&lt;script&gt;')) throw new Error('Unescaped input');
        ${mode === 'exception' ? "throw new Error('Provider unavailable')" : `return { error: ${mode === 'rejected' ? "'Rejected'" : 'null'} }`}
      } } }`)
      const compiled = compile(action)
        .replace("'resend'", JSON.stringify(mock))
        .replace(
          "'@/lib/emailTemplate'",
          JSON.stringify(asModule(compile(template))),
        )
        .replace("'@/lib/liveRobotLab'", JSON.stringify(asModule(javascript)))
      const { sendLiveRobotLabRequest } = await import(asModule(compiled))
      if (mode === 'missing') delete process.env.RESEND_API_KEY
      else process.env.RESEND_API_KEY = 'test-placeholder'
      const data = validData()
      data.set('experience', '<script>example</script>')
      const result = await sendLiveRobotLabRequest(data)
      assert.equal(result.success, mode === 'accepted', mode)
      if (mode !== 'accepted') assert.ok(result.error)
      const invalid = await sendLiveRobotLabRequest(new FormData())
      assert.equal(invalid.success, false)
      assert.equal(Object.keys(invalid.errors).length, 6)
    }
  } finally {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalKey
  }
})

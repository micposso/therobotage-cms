import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const asModule = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')
const validation = asModule(compile(await read('../src/lib/robotLiteracy.ts')))
const { validateLiteracyRequest } = await import(validation)
function validData() {
  const data = new FormData()
  Object.entries({ firstName: 'José', lastName: 'Li', email: 'educator+program@example.org', organization: 'Example school', organizationType: 'K–12 School', consent: 'yes' }).forEach(([key, value]) => data.set(key, value))
  data.append('interests', 'Robot Literacy Curriculum')
  data.append('interests', 'Curriculum Partnership')
  return data
}

test('accepts multiple interests and omitted optional fields', () => {
  assert.deepEqual(validateLiteracyRequest(validData()), {})
})
test('requires identity, organization, interest and affirmative consent', () => {
  assert.equal(Object.keys(validateLiteracyRequest(new FormData())).length, 7)
  for (const [name, value] of [['firstName', '  '], ['email', 'bad-email'], ['consent', 'no'], ['interests', 'Forged'], ['organizationType', 'Forged'], ['audience', 'Forged'], ['groupSize', 'Forged'], ['timeline', 'Forged'], ['message', 'x'.repeat(3001)]]) {
    const data = validData()
    data.set(name, value)
    assert.ok(validateLiteracyRequest(data)[name], name)
  }
})
test('rejects files substituted for text fields', () => {
  const data = validData()
  data.set('role', new Blob(['content']), 'role.txt')
  assert.ok(validateLiteracyRequest(data).role)
})
test('delivery succeeds only on provider acceptance; escapes all fields and includes all interests', async () => {
  const action = compile(await read('../src/app/actions/sendRobotLiteracyRequest.ts'))
  const template = asModule(compile(await read('../src/lib/emailTemplate.ts')))
  const originalKey = process.env.RESEND_API_KEY
  try {
    for (const mode of ['accepted', 'rejected', 'exception', 'missing']) {
      const mock = asModule(`export class Resend { emails = { send: async (payload) => {
        if (!payload.html.includes('&lt;script&gt;') || payload.html.includes('<script>')) throw new Error('Unescaped content');
        if (!payload.html.includes('Robot Literacy Curriculum, Curriculum Partnership')) throw new Error('Missing interests');
        if (payload.replyTo !== 'educator+program@example.org') throw new Error('Invalid reply address');
        ${mode === 'exception' ? "throw new Error('Unavailable')" : `return {error: ${mode === 'rejected' ? "'Rejected'" : 'null'}}`}
      } } }`)
      const source = action.replace("'resend'", JSON.stringify(mock)).replace("'@/lib/emailTemplate'", JSON.stringify(template)).replace("'@/lib/robotLiteracy'", JSON.stringify(validation))
      const { sendRobotLiteracyRequest } = await import(asModule(source))
      if (mode === 'missing') delete process.env.RESEND_API_KEY
      else process.env.RESEND_API_KEY = 'test-only'
      const data = validData()
      data.set('message', '<script>example</script>')
      const result = await sendRobotLiteracyRequest(data)
      assert.equal(result.success, mode === 'accepted', mode)
      if (mode !== 'accepted') assert.ok(result.error)
      assert.equal(Object.keys((await sendRobotLiteracyRequest(new FormData())).errors).length, 7)
    }
  } finally {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalKey
  }
})

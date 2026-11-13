import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'
import { testModule } from './test-module.mjs'

const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const actionNames = ['getJobDetailsForWebMcp', 'getRobotProfileForWebMcp', 'listJobsForWebMcp', 'listRobotProfilesForWebMcp', 'searchSiteForWebMcp']
const imports = {
  '@/app/actions/sendWorkshopEmail': moduleUrl('export async function sendWorkshopEmail() { throw new Error("Event discovery must not send email") }'),
  '@/app/actions/webMcpData': moduleUrl(actionNames.map((name) => `export async function ${name}() { throw new Error("Unrelated server action") }`).join('\n')),
  '@/lib/events': await testModule(new URL('../src/lib/events.ts', import.meta.url)),
  '@/lib/site': await testModule(new URL('../src/lib/site.ts', import.meta.url)),
  './activity': await testModule(new URL('../src/webmcp/activity.ts', import.meta.url)),
}
let source = ts.transpileModule(await readFile(new URL('../src/webmcp/tools.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
for (const [path, url] of Object.entries(imports)) source = source.replace(`from '${path}'`, `from '${url}'`)
const { registerTheRobotAgeTools } = await import(moduleUrl(source))
const registered = new Map()
await registerTheRobotAgeTools({ registerTool(tool) { registered.set(tool.name, tool) } }, new AbortController().signal)
const execute = (name, input = {}) => registered.get(name).execute(input, { signal: new AbortController().signal })

test('MCP lists four Robot Week events with calendar links, eligibility and external actions', async () => {
  const result = await execute('list_events')
  assert.equal(result.ok, true)
  const events = result.events.filter((event) => event.series?.name === 'Robot Week NYC')
  assert.equal(events.length, 4)
  assert.deepEqual(events.map((event) => event.dates[0].isoDate), ['2026-11-17', '2026-11-19', '2026-11-20', '2026-11-21'])
  for (const event of events) {
    assert.match(event.url, /^\/calendar#/)
    assert.ok(event.audience.length)
    assert.ok(event.access)
    assert.equal(new URL(event.registration.url).protocol, 'https:')
  }
  assert.equal(events[0].registration.availability, 'open')
  assert.equal(events[1].access, 'Open only to NYIT students')
  assert.match(events[2].access, /invited guests only/)
  assert.equal(events[3].dates[1].isoDate, '2026-11-22')
  assert.equal(events[1].dates[0].timeZone, 'America/New_York')
  assert.equal(events[0].dates[0].time, undefined)
})

test('MCP details expose panelists, organizers, featured robots and hackathon deliverables by ID or slug', async () => {
  const listed = (await execute('list_events')).events
  for (const event of listed) {
    const byId = await execute('get_event_details', { eventId: event.id })
    const bySlug = await execute('get_event_details', { eventId: event.slug })
    assert.deepEqual(byId, bySlug)
    assert.equal(byId.ok, true)
  }
  const panel = (await execute('get_event_details', { eventId: 'robot-career-panel' })).event
  assert.equal(panel.people.length, 6)
  assert.equal(panel.people.find((person) => person.moderator).name, 'Michael Posso')
  assert.equal(panel.series.organizers.length, 2)
  assert.equal(panel.cost, 'Free')
  const lab = (await execute('get_event_details', { eventId: 'robot-week-live-lab' })).event
  assert.deepEqual(lab.featuredRobots, ['Reachy Mini', 'Unitree GO2'])
  const hackathon = (await execute('get_event_details', { eventId: 'reachy-mini-hackathon' })).event
  assert.equal(hackathon.deliverables.length, 4)
})

test('MCP registration returns an external next step without booking or sending email', async () => {
  assert.deepEqual(registered.get('register_for_event').inputSchema.required, ['eventId'])
  const events = (await execute('list_events')).events.filter((event) => event.series)
  for (const event of events) {
    const result = await execute('register_for_event', { eventId: event.id })
    assert.equal(result.ok, false)
    assert.equal(result.status, 'external-action-required')
    assert.equal(result.error.code, 'EXTERNAL_REGISTRATION_REQUIRED')
    assert.equal(result.registration.url, event.registration.url)
    if (event.registration.availability === 'interest-only') assert.match(result.registration.note, /does not reserve a place or confirm registration/)
  }
})

test('MCP keeps existing events available and handles missing or closed events honestly', async () => {
  assert.equal((await execute('get_event_details', { eventId: 'summit' })).event.title, 'The Robot Age Summit')
  assert.equal((await execute('get_event_details', { eventId: 'missing' })).error.code, 'EVENT_NOT_FOUND')
  assert.equal((await execute('register_for_event', { eventId: 'rxd-free-workshop' })).error.code, 'REGISTRATION_UNAVAILABLE')
  assert.ok((await execute('get_site_overview')).site.primaryAreas.some((area) => area.url === '/calendar'))
})

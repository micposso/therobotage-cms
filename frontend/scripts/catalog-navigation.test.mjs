import assert from 'node:assert/strict'
import test from 'node:test'

const base = process.env.CATALOG_TEST_URL
const routes = ['/', '/learn', '/learn/rpdp', '/learn/rdp', '/robot-literacy', '/live-robot-lab', '/robot-literacy/partners', '/enterprise', '/press', '/access', '/robots/reachy-mini', '/news/robots-threat-pet-shape-bias', '/es', '/es/learn', '/es/learn/rpdp', '/es/learn/rdp']
const text = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
for (const route of routes) test(`current program navigation and no retired promotion: ${route}`, { skip: !base }, async () => {
  const response = await fetch(`${base}${route}`)
  assert.equal(response.status, 200)
  const html = await response.text()
  for (const href of ['/robot-literacy', '/live-robot-lab', '/learn/rpdp', '/learn/rdp']) {
    assert.ok(html.includes(`href="${href}"`) || html.includes(`href="/es${href}"`), `${route}: missing ${href}`)
  }
  assert.doesNotMatch(text(html), /\bREP\b|\bRSP\b|\bRXR\b|Robotics Experience Practitioner|Ten seats|10 seats|Reserve Your Seat|Reserve your seat|first cohort runs May|RXD Certification/)
  assert.doesNotMatch(html, /href="(?:\/es)?\/learn\/(?:rep|rsp|rxr)"/)
})

test('program CTAs target real forms with distinct interest values', { skip: !base }, async () => {
  for (const prefix of ['', '/es']) {
    const html = await (await fetch(`${base}${prefix}/learn`)).text()
    for (const id of ['programs', 'founding-cohort-list', 'rdp-updates', 'academy-updates']) assert.ok(html.includes(`id="${id}"`), id)
    for (const value of ['rpdp', 'rdp', 'academy']) assert.match(html, new RegExp(`name="interest"[^>]*value="${value}"`))
    const rdp = await (await fetch(`${base}${prefix}/learn/rdp`)).text()
    assert.ok(rdp.includes(`href="${prefix}/learn#rdp-updates"`))
  }
})

test('legacy credential URLs are notices and old curriculum URLs lead to those notices', { skip: !base }, async () => {
  for (const prefix of ['', '/es']) for (const slug of ['rep', 'rsp', 'rxr']) {
    const response = await fetch(`${base}${prefix}/learn/${slug}/curriculum`)
    assert.equal(response.status, 200)
    assert.equal(new URL(response.url).pathname, `${prefix}/learn/${slug}`)
    const html = await response.text()
    assert.match(html, /noindex/)
    assert.doesNotMatch(text(html), /\$199|\$399|May 2026|Enroll Now/)
    assert.ok(html.includes('/signin'))
  }
})

test('notification aliases and current curricula resolve to the promised destination', { skip: !base }, async () => {
  const notify = await fetch(`${base}/notify`, { redirect: 'manual' })
  assert.equal(notify.status, 308)
  assert.equal(notify.headers.get('location'), '/learn#academy-updates')
  for (const slug of ['rpdp', 'rdp']) {
    const response = await fetch(`${base}/learn/${slug}/curriculum`, { redirect: 'manual' })
    assert.equal(response.status, 308)
    assert.equal(response.headers.get('location'), `/learn/${slug}#curriculum`)
  }
})

test('past workshop has no active registration form', { skip: !base }, async () => {
  const html = await (await fetch(`${base}/rxd-free-workshop`)).text()
  assert.match(text(html), /Registration closed/)
  assert.doesNotMatch(html, /name="firstName"|name="profession"/)
})

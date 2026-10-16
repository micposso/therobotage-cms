// Test-only approvals do NOT belong to the publication registry.
export function fixtureProtocols(protocols) {
 return protocols.map(p => ({ ...p, id: 'FIXTURE-' + p.id, review: { state: 'approved', reviewer: 'SYNTHETIC TEST FIXTURE — NOT AN EDITOR', date: '2026-01-01', notes: 'Test mechanics only; no real rubric has been approved.' } }))
}

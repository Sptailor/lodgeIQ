/**
 * Quick self-test for the scoring and follow up rules.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS","moduleResolution":"node"}' scripts/check-domain.ts
 */
import { scoreOf } from '../lib/domain/checks'
import { applyInspection, submitBanner } from '../lib/domain/derive'
import { SAMPLE_FOLLOW_UPS, SAMPLE_PROPERTIES } from '../lib/domain/sample-data'
import type { FollowUp } from '../lib/domain/types'

let failures = 0
function expect(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failures++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ` (got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)})`}`)
}

expect('Ewaso latest score', scoreOf('npnfnfnpn'.split('')).s, 2.9)
expect('Ewaso sample answers score', scoreOf('pppppnnpp'.split('')).s, 4.5)
expect('empty answers', scoreOf([]).s, null)
expect('sample properties', SAMPLE_PROPERTIES.length, 20)

const now = new Date('2026-11-07T12:00:00Z')
const fus: FollowUp[] = SAMPLE_FOLLOW_UPS.map((f) => ({
  id: f.id,
  propertyId: f.propertyId,
  checkIndex: f.checkIndex,
  text: f.text,
  photo: f.photo,
  status: f.status === 'OPEN' ? 'open' : f.status === 'DONE' ? 'done' : 'progress',
  owner: f.owner,
  due: new Date(now.getTime() + f.dueInDays * 86400000).toISOString(),
  note: null,
}))

const r = applyInspection(fus, 'ewaso-river-camp', 'pppppnnpp', [[], [], [], [], [], [], [], [], []], now)
expect('Ewaso closes one follow up', r.closed, 1)
expect('Ewaso improves one follow up', r.improved, 1)
expect('Ewaso opens none', r.opened, 0)
expect('Other properties untouched', r.followUps.filter((f) => f.propertyId !== 'ewaso-river-camp').length, 4)
expect('Banner', submitBanner(4.5, 2.9, r), 'Inspection submitted. Score 4.5, up 1.6 since the last visit. 1 follow up closed, 1 improved.')

const r2 = applyInspection(fus, 'red-earth-camp', 'pppfpnppp', [[], [], [], ['/images/evidence-extinguisher.jpg'], [], [], [], [], []], now)
expect('A new fail opens a follow up', r2.opened, 1)
expect('New follow up carries the photo', r2.followUps[0].photo, '/images/evidence-extinguisher.jpg')

if (failures) {
  console.error(`${failures} check(s) failed`)
  process.exit(1)
}
console.log('All checks passed')

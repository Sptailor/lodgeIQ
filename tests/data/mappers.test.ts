import { vi } from 'vitest'
vi.mock('@/auth', () => ({ auth: vi.fn() }))
import { describe, expect, it } from 'vitest'
import { HttpError } from '@/lib/auth-utils'
import { CHECKS } from '@/lib/domain/checks'
import { checkIndexOfSlug, followUpStatusFromDb, followUpStatusToDb, resultsToString } from '@/lib/data/mappers'
import { visitDate } from '@/lib/data/visit-date'

describe('follow up status', () => {
  it('round-trips between the app and the database', () => {
    for (const s of ['open', 'progress', 'done'] as const) expect(followUpStatusFromDb(followUpStatusToDb(s))).toBe(s)
  })
})

describe('checkIndexOfSlug', () => {
  it('finds standard checks and returns -1 otherwise', () => {
    expect(checkIndexOfSlug('door-locks')).toBe(4)
    expect(checkIndexOfSlug('pool')).toBe(-1)
    expect(checkIndexOfSlug(null)).toBe(-1)
  })
})

describe('resultsToString', () => {
  const RESULT = { p: 'PASS', n: 'NEEDS_IMPROVEMENT', f: 'FAIL' } as const
  const rows = (res: string) => res.split('').map((c, i) => ({ result: RESULT[c as 'p'], checklistItem: { slug: CHECKS[i].slug } }))

  it('rebuilds the answer string in checklist order, whatever order the rows arrive in', () => {
    expect(resultsToString(rows('pnfpnfpnf').reverse())).toBe('pnfpnfpnf')
  })

  it('ignores custom checklist items', () => {
    expect(resultsToString([...rows('ppppppppp'), { result: 'FAIL', checklistItem: { slug: 'pool' } }])).toBe('ppppppppp')
  })

  it('returns null when a standard check is missing', () => {
    expect(resultsToString(rows('ppppppppp').slice(1))).toBeNull()
  })
})

describe('visitDate', () => {
  it('stores visits at 09:00 UTC on the chosen day', () => {
    expect(visitDate('2026-11-12T23:30:00Z').toISOString()).toBe('2026-11-12T09:00:00.000Z')
  })

  it.each([undefined, 42, 'not a date'])('rejects %s with a 400', (input) => {
    expect(() => visitDate(input)).toThrow(HttpError)
    try {
      visitDate(input)
    } catch (e) {
      expect((e as HttpError).status).toBe(400)
    }
  })
})

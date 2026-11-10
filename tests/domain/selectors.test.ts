import { describe, expect, it } from 'vitest'
import {
  averageAsOf,
  inspectionsInQuarter,
  monthlyAverages,
  needsYou,
  overdueUnplanned,
  sparklinePoints,
  todaysInspections,
} from '@/lib/domain/selectors'
import { NOW, inspection, property } from '../fixtures'

describe('needsYou', () => {
  const healthy = property({ id: 'healthy' })
  const low = property({ id: 'low', inspections: [inspection('2026-11-01', 'fffnnnnnn')] })
  const oneSafety = property({ id: 'one-safety', inspections: [inspection('2026-11-01', 'ppppfpppp')] })
  const twoSafety = property({ id: 'two-safety', inspections: [inspection('2026-11-01', 'pppffpppp')] })

  it('keeps only properties that need attention, most safety failures first, then lowest score', () => {
    expect(needsYou([healthy, low, oneSafety, twoSafety], NOW).map((p) => p.id)).toEqual(['two-safety', 'one-safety', 'low'])
  })

  it('puts the preferred property first when it needs attention', () => {
    expect(needsYou([low, oneSafety, twoSafety], NOW, 'low').map((p) => p.id)).toEqual(['low', 'two-safety', 'one-safety'])
  })
})

describe('averageAsOf and monthlyAverages', () => {
  const a = property({ id: 'a', inspections: [inspection('2026-09-15', 'nnnnnnnnn'), inspection('2026-10-20')] }) // 3 then 5
  const b = property({ id: 'b', inspections: [inspection('2026-10-05', 'fffffffff')] }) // 1

  it('uses each property latest score at that moment and ignores ones not yet inspected', () => {
    expect(averageAsOf([a, b], Date.parse('2026-09-01'))).toBeNull()
    expect(averageAsOf([a, b], Date.parse('2026-09-30'))).toBe(3)
    expect(averageAsOf([a, b], Date.parse('2026-10-10'))).toBe(2)
    expect(averageAsOf([a, b], Date.parse('2026-10-31'))).toBe(3)
  })

  it('reports month-end averages, oldest first, with the current month ending now', () => {
    expect(monthlyAverages([a, b], NOW, 4)).toEqual([
      { label: 'Aug', value: null },
      { label: 'Sep', value: 3 },
      { label: 'Oct', value: 3 },
      { label: 'Nov', value: 3 },
    ])
  })
})

describe('inspectionsInQuarter', () => {
  it('counts the current and previous quarter', () => {
    const p = property({
      inspections: ['2026-06-30', '2026-07-01', '2026-09-30', '2026-10-01', '2026-11-09T11:00:00Z', '2026-11-20'].map((d) => inspection(d)),
    })
    // Q3: 1 Jul, 30 Sep. Q4 so far: 1 Oct, 9 Nov (the 20 Nov one is in the future).
    expect(inspectionsInQuarter([p], NOW)).toEqual({ current: 2, previous: 2 })
  })

  it('reaches back into last year in the first quarter', () => {
    const p = property({ inspections: [inspection('2025-11-15'), inspection('2026-01-10')] })
    expect(inspectionsInQuarter([p], new Date('2026-02-10T00:00:00Z'))).toEqual({ current: 1, previous: 1 })
  })
})

describe('todaysInspections', () => {
  it('counts inspections dated today and how many beat the previous visit', () => {
    const up = property({ id: 'up', inspections: [inspection('2026-10-01', 'nnnnnnnnn'), inspection('2026-11-09T08:00:00Z')] })
    const down = property({ id: 'down', inspections: [inspection('2026-10-01'), inspection('2026-11-09T08:00:00Z', 'nnnnnnnnn')] })
    const first = property({ id: 'first', inspections: [inspection('2026-11-09T08:00:00Z')] })
    const old = property({ id: 'old' })
    expect(todaysInspections([up, down, first, old], NOW)).toEqual({ added: 3, improved: 1 })
  })
})

describe('overdueUnplanned', () => {
  it('lists overdue properties that have no visit planned', () => {
    const overdue = property({ id: 'overdue', visitStandardDays: 30, inspections: [inspection('2026-08-01')] })
    const planned = property({ id: 'planned', visitStandardDays: 30, inspections: [inspection('2026-08-01')] })
    const visits = [{ id: 'v1', propertyId: 'planned', inspectorId: 'u1', date: '2026-11-12T09:00:00Z' }]
    expect(overdueUnplanned([overdue, planned, property()], visits, NOW).map((p) => p.id)).toEqual(['overdue'])
  })
})

describe('sparklinePoints', () => {
  it('needs at least two values', () => {
    expect(sparklinePoints([])).toBe('')
    expect(sparklinePoints([3, null])).toBe('')
  })

  it('maps the lowest value near the bottom and the highest near the top', () => {
    expect(sparklinePoints([1, 2])).toBe('0.0,34.5 120.0,5.5')
  })

  it('keeps x positions for gaps', () => {
    expect(sparklinePoints([null, 1, 2]).split(' ')[0]).toMatch(/^60\.0,/)
  })
})

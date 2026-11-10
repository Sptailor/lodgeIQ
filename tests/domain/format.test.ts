import { describe, expect, it } from 'vitest'
import {
  countWord,
  greetingWord,
  initialsOf,
  longDate,
  monthShort,
  planningWeekStart,
  relativeTime,
  sameUtcDay,
  shortDate,
  weekdayDayMonth,
} from '@/lib/domain/format'

describe('date text', () => {
  it('formats in UTC so server and browser agree', () => {
    const d = '2026-11-07T23:30:00Z'
    expect(shortDate(d)).toBe('7 Nov')
    expect(weekdayDayMonth(d)).toBe('Sat 7 Nov')
    expect(longDate(d)).toBe('Saturday 7 November')
  })

  it('wraps month indices', () => {
    expect(monthShort(-1)).toBe('Dec')
    expect(monthShort(12)).toBe('Jan')
  })

  it('compares UTC days', () => {
    expect(sameUtcDay('2026-11-09T00:00:00Z', '2026-11-09T23:59:59Z')).toBe(true)
    expect(sameUtcDay('2026-11-09T23:59:59Z', '2026-11-10T00:00:00Z')).toBe(false)
  })
})

describe('planningWeekStart', () => {
  it.each([
    ['2026-11-09T15:00:00Z', 'Monday'],
    ['2026-11-11T15:00:00Z', 'Wednesday'],
    ['2026-11-13T15:00:00Z', 'Friday'],
    ['2026-11-14T15:00:00Z', 'Saturday, so next week'],
    ['2026-11-15T15:00:00Z', 'Sunday, so next week'],
  ])('%s (%s) plans the week of Monday 9 Nov or 16 Nov', (now, label) => {
    const expected = label.includes('next week') ? '2026-11-16T00:00:00.000Z' : '2026-11-09T00:00:00.000Z'
    expect(planningWeekStart(new Date(now)).toISOString()).toBe(expected)
  })
})

describe('relativeTime', () => {
  const now = new Date('2026-11-09T12:00:00Z')
  it.each([
    ['2026-11-09T11:59:00Z', 'Just now'],
    ['2026-11-09T11:48:00Z', '12 min ago'],
    ['2026-11-09T09:00:00Z', '3 hr ago'],
    ['2026-11-07T09:00:00Z', '7 Nov'],
  ])('%s -> %s', (iso, text) => {
    expect(relativeTime(iso, now)).toBe(text)
  })
})

describe('small words', () => {
  it('greets by hour', () => {
    expect([0, 11, 12, 17, 18, 23].map(greetingWord)).toEqual(['morning', 'morning', 'afternoon', 'afternoon', 'evening', 'evening'])
  })

  it('spells small counts', () => {
    expect(countWord(1)).toBe('One')
    expect(countWord(5)).toBe('Five')
    expect(countWord(6)).toBe('6')
  })

  it('takes up to two initials', () => {
    expect(initialsOf('Sarah  Wilson')).toBe('SW')
    expect(initialsOf('mary ann lee')).toBe('MA')
    expect(initialsOf('Cher')).toBe('C')
  })
})

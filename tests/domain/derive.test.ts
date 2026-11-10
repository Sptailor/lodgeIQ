import { describe, expect, it } from 'vitest'
import {
  COLORS,
  applyInspection,
  attn,
  daysSince,
  isImageUrl,
  portfolioAverage,
  safetyFails,
  submitSummary,
  tone,
  why,
} from '@/lib/domain/derive'
import { NOW, followUp, inspection, property } from '../fixtures'

describe('tone', () => {
  it('maps scores to fail, warning and pass colours at 3.0 and 3.5', () => {
    expect(tone(2.9)).toBe(COLORS.fail)
    expect(tone(3)).toBe(COLORS.warn)
    expect(tone(3.4)).toBe(COLORS.warn)
    expect(tone(3.5)).toBe(COLORS.pass)
  })
})

describe('daysSince', () => {
  it('counts whole UTC calendar days, ignoring the time of day', () => {
    const p = property({ inspections: [inspection('2026-11-08T23:59:00Z')] })
    expect(daysSince(p, new Date('2026-11-09T00:01:00Z'))).toBe(1)
    expect(daysSince(p, new Date('2026-11-08T00:00:00Z'))).toBe(0)
  })
})

describe('safetyFails', () => {
  it('returns only failed safety checks (indices 3 to 5)', () => {
    expect(safetyFails('fffpppppp')).toEqual([])
    expect(safetyFails('pppfnfppf')).toEqual([3, 5])
  })
})

describe('attn', () => {
  it('is false for a recent, healthy property', () => {
    expect(attn(property(), NOW)).toBe(false)
  })

  it('flags a score below 3', () => {
    expect(attn(property({ inspections: [inspection('2026-11-01', 'fffnnnnnn')] }), NOW)).toBe(true)
  })

  it('flags a property past its visit standard, but not on the last day', () => {
    const p = (date: string) => property({ visitStandardDays: 30, inspections: [inspection(date)] })
    expect(attn(p('2026-10-10'), NOW)).toBe(false) // 30 days
    expect(attn(p('2026-10-09'), NOW)).toBe(true) // 31 days
  })

  it('flags any failed safety check even when the score is high', () => {
    expect(attn(property({ inspections: [inspection('2026-11-01', 'ppppfpppp')] }), NOW)).toBe(true)
  })
})

describe('why', () => {
  it('names failed safety checks first', () => {
    const p = property({ visitStandardDays: 1, inspections: [inspection('2026-11-07T10:00:00Z', 'pppffpppp')] })
    expect(why(p, NOW)).toBe('Fire safety equipment and Door locks failed on 7 Nov.')
  })

  it('explains an overdue visit', () => {
    const p = property({ visitStandardDays: 90, inspections: [inspection('2026-08-01')] })
    expect(why(p, NOW)).toBe('100 days since the last visit. Your standard is 90.')
  })

  it('explains a low score', () => {
    expect(why(property({ inspections: [inspection('2026-11-01', 'fffnnnnnn')] }), NOW)).toMatch(/^Scored 2\.\d on the last visit\.$/)
  })

  it('is empty when nothing is wrong', () => {
    expect(why(property(), NOW)).toBe('')
  })
})

describe('portfolioAverage', () => {
  it('averages each property latest score and is 0 for an empty portfolio', () => {
    const a = property({ inspections: [inspection('2026-01-01', 'fffffffff'), inspection('2026-11-01')] }) // latest 5
    const b = property({ inspections: [inspection('2026-11-01', 'nnnnnnnnn')] }) // 3
    expect(portfolioAverage([a, b])).toBe(4)
    expect(portfolioAverage([])).toBe(0)
  })
})

describe('isImageUrl', () => {
  it('accepts app paths and https URLs only', () => {
    expect(isImageUrl('/images/a.jpg')).toBe(true)
    expect(isImageUrl('https://blob.example.com/a.jpg')).toBe(true)
    expect(isImageUrl('http://example.com/a.jpg')).toBe(false)
    expect(isImageUrl('placeholder-3')).toBe(false)
    expect(isImageUrl(null)).toBe(false)
  })
})

describe('applyInspection', () => {
  const noPhotos: string[][] = Array.from({ length: 9 }, () => [])
  const ids = (i: number) => `new-${i}`

  it('closes an open follow up whose check now passes', () => {
    const r = applyInspection([followUp({ checkIndex: 3 })], 'p1', 'ppppppppp', noPhotos, NOW, ids)
    expect(r).toMatchObject({ closed: 1, improved: 0, opened: 0 })
    expect(r.followUps[0]).toMatchObject({ status: 'done', note: "Closed by today's inspection" })
  })

  it('keeps a follow up open with a note when the check improved or failed again', () => {
    const fus = [followUp({ id: 'a', checkIndex: 3 }), followUp({ id: 'b', checkIndex: 4, status: 'progress' })]
    const r = applyInspection(fus, 'p1', 'pppnfpppp', noPhotos, NOW, ids)
    expect(r).toMatchObject({ closed: 0, improved: 1, opened: 0 })
    expect(r.followUps.find((f) => f.id === 'a')).toMatchObject({ status: 'open', note: 'Improved to needs work today' })
    expect(r.followUps.find((f) => f.id === 'b')).toMatchObject({ status: 'progress', note: 'Failed again today' })
  })

  it('opens one follow up per new failure, newest check first, due in seven days', () => {
    const photos = noPhotos.map((_, i) => (i === 6 ? ['placeholder', 'https://blob.example.com/wifi.jpg'] : []))
    const r = applyInspection([], 'p1', 'fpppppfpp', photos, NOW, ids)
    expect(r.opened).toBe(2)
    expect(r.followUps.map((f) => f.id)).toEqual(['new-6', 'new-0'])
    expect(r.followUps[0]).toMatchObject({
      checkIndex: 6,
      status: 'open',
      isNew: true,
      photo: 'https://blob.example.com/wifi.jpg',
      text: 'WiFi quality failed today. The photos are attached.',
      due: '2026-11-16T12:00:00.000Z',
    })
    expect(r.followUps[1].photo).toBeNull()
  })

  it('does not open a duplicate when a follow up for that check is still open', () => {
    const r = applyInspection([followUp({ checkIndex: 3 })], 'p1', 'pppfppppp', noPhotos, NOW, ids)
    expect(r.opened).toBe(0)
    expect(r.followUps).toHaveLength(1)
  })

  it('reopens a check whose earlier follow up is already done', () => {
    const r = applyInspection([followUp({ checkIndex: 3, status: 'done' })], 'p1', 'pppfppppp', noPhotos, NOW, ids)
    expect(r.opened).toBe(1)
    expect(r.followUps).toHaveLength(2)
  })

  it('leaves other properties and done follow ups untouched', () => {
    const other = followUp({ id: 'x', propertyId: 'p2', checkIndex: 3 })
    const done = followUp({ id: 'y', checkIndex: 4, status: 'done', note: 'old' })
    const r = applyInspection([other, done], 'p1', 'ppppppppp', noPhotos, NOW, ids)
    expect(r.followUps).toEqual([other, done])
  })
})

describe('submitSummary', () => {
  it('rounds the change to one decimal', () => {
    expect(submitSummary(4.4, 3.7, { closed: 0, improved: 0, opened: 0 })).toEqual({ score: 4.4, diff: 0.7, followUps: '' })
  })

  it.each([
    [{ closed: 1, improved: 0, opened: 0 }, '1 follow up updated'],
    [{ closed: 1, improved: 1, opened: 0 }, '2 follow ups updated'],
    [{ closed: 0, improved: 0, opened: 1 }, '1 follow up opened'],
    [{ closed: 0, improved: 0, opened: 3 }, '3 follow ups opened'],
    [{ closed: 1, improved: 0, opened: 1 }, '1 follow up updated, 1 opened'],
  ])('%o -> %s', (r, text) => {
    expect(submitSummary(4, 4, r).followUps).toBe(text)
  })
})

import { CHECKS } from './checks'
import { addDays, shortDate } from './format'
import type { FollowUp, InspectionSummary, Property } from './types'

/** Colours that carry meaning in the app. */
export const COLORS = {
  pass: '#6FE3C6',
  warn: '#FFC56B',
  fail: '#FF8A7A',
  failInk: '#FFC2B8',
} as const

/** Score colour: below 3.0 fail, below 3.5 warning, otherwise pass. */
export const tone = (v: number): string => (v < 3 ? COLORS.fail : v < 3.5 ? COLORS.warn : COLORS.pass)

export const latest = (p: Property): InspectionSummary => p.inspections[p.inspections.length - 1]

export const previous = (p: Property): InspectionSummary | null =>
  p.inspections.length > 1 ? p.inspections[p.inspections.length - 2] : null

const startOfUtcDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())

/** Whole calendar days (UTC) between the latest inspection and `now`. */
export function daysSince(p: Property, now: Date): number {
  return Math.round((startOfUtcDay(now) - startOfUtcDay(new Date(latest(p).date))) / 86400000)
}

/** Indices of the safety checks (fire, door locks, emergency information) that failed. */
export const safetyFails = (res: string): number[] => [3, 4, 5].filter((i) => res[i] === 'f')

/** A property needs attention when it scores below 3, is overdue, or failed a safety check. */
export function attn(p: Property, now: Date): boolean {
  const l = latest(p)
  return l.score < 3 || daysSince(p, now) > p.visitStandardDays || safetyFails(l.res).length > 0
}

export const portfolioAverage = (props: Property[]): number =>
  props.length ? props.reduce((s, p) => s + latest(p).score, 0) / props.length : 0

export const checkName = (i: number): string => CHECKS[i].name

/** A photo that can be shown as an image: a path in the app or an uploaded https URL. Demo placeholder tiles are not. */
export const isImageUrl = (u: unknown): u is string => typeof u === 'string' && (u.startsWith('/') || u.startsWith('https://'))

/** The line shown for a property in Needs you, and on the globe card. */
export function why(p: Property, now: Date): string {
  const l = latest(p)
  const sf = safetyFails(l.res)
  if (sf.length) return `${sf.map(checkName).join(' and ')} failed on ${shortDate(l.date)}.`
  const days = daysSince(p, now)
  if (days > p.visitStandardDays) return `${days} days since the last visit. Your standard is ${p.visitStandardDays}.`
  if (l.score < 3) return `Scored ${l.score.toFixed(1)} on the last visit.`
  return ''
}

export type ApplyResult = {
  followUps: FollowUp[]
  closed: number
  improved: number
  opened: number
}

/**
 * Apply a submitted set of answers to a property's follow ups.
 * - A not-done follow up whose check is now a pass is closed.
 * - One whose check is now "needs work" stays open with an "improved" note.
 * - One whose check failed again stays open with a "failed again" note.
 * - Every failed check without a not-done follow up opens a new one.
 * `photos[i]` holds the photos added to check i. Placeholder tiles are skipped.
 */
export function applyInspection(
  followUps: FollowUp[],
  propertyId: string,
  res: string,
  photos: string[][],
  now: Date,
  makeId: (checkIndex: number) => string = (i) => `fu-${now.getTime()}-${i}`
): ApplyResult {
  let closed = 0
  let improved = 0
  let opened = 0
  const next = followUps.map((f) => {
    if (f.propertyId !== propertyId || f.status === 'done') return f
    const r = res[f.checkIndex]
    if (r === 'p') {
      closed++
      return { ...f, status: 'done' as const, note: "Closed by today's inspection", isNew: false }
    }
    if (r === 'n') {
      improved++
      return { ...f, note: 'Improved to needs work today' }
    }
    return { ...f, note: 'Failed again today' }
  })
  const created: FollowUp[] = []
  // Newest first: later checks end up above earlier ones, as when each is inserted at the top.
  for (let i = res.length - 1; i >= 0; i--) {
    if (res[i] !== 'f') continue
    if (next.some((f) => f.propertyId === propertyId && f.checkIndex === i && f.status !== 'done')) continue
    opened++
    created.push({
      id: makeId(i),
      propertyId,
      checkIndex: i,
      text: `${CHECKS[i].name} failed today. The photos are attached.`,
      photo: (photos[i] ?? []).find(isImageUrl) ?? null,
      status: 'open',
      owner: null,
      due: addDays(now, 7).toISOString(),
      note: null,
      isNew: true,
    })
  }
  return { followUps: [...created, ...next], closed, improved, opened }
}

/** What the property page shows after an inspection is submitted: the new score, the change, and the follow ups it touched. */
export type SubmitSummary = { score: number; diff: number; followUps: string }

/** followUps reads "2 follow ups updated", "1 follow up opened", "1 follow up updated, 1 opened", or "" when none changed. */
export function submitSummary(score: number, previousScore: number, r: { closed: number; improved: number; opened: number }): SubmitSummary {
  const diff = Math.round((score - previousScore) * 10) / 10
  const updated = r.closed + r.improved
  const fu = (n: number) => `${n} follow up${n > 1 ? 's' : ''}`
  const followUps =
    updated && r.opened ? `${fu(updated)} updated, ${r.opened} opened` : updated ? `${fu(updated)} updated` : r.opened ? `${fu(r.opened)} opened` : ''
  return { score, diff, followUps }
}

/** Spoken description of a score seal. */
export function sealLabel(l: { score: number; cats: number[] }): string {
  return `Score ${l.score.toFixed(1)} out of 5. Cleanliness ${l.cats[0].toFixed(1)}, Safety ${l.cats[1].toFixed(1)}, Amenities ${l.cats[2].toFixed(1)}`
}

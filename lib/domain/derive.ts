import { CHECKS } from './checks'
import { shortDate } from './format'
import type { InspectionSummary, Property } from './types'

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

/**
 * Pure functions that turn app state into the numbers and lists the pages show.
 * They take `now` as an argument so they behave the same on the server and in the browser.
 */

import { CHECKS } from './checks'
import { attn, daysSince, latest, safetyFails } from './derive'
import { monthShort, sameUtcDay } from './format'
import type { FollowUp, InspectionSummary, Property, Visit } from './types'

const DEMO_FIRST = 'ewaso-river-camp'

/** Properties that need the manager: failed safety, low score or overdue. Most urgent first. */
export function needsYou(props: Property[], now: Date, preferFirst?: string): Property[] {
  return props
    .filter((p) => attn(p, now))
    .sort(
      (a, b) =>
        Number(b.id === preferFirst) - Number(a.id === preferFirst) ||
        safetyFails(latest(b).res).length - safetyFails(latest(a).res).length ||
        latest(a).score - latest(b).score
    )
}
export { DEMO_FIRST }

/** Average of every property's latest score on or before a moment in time. Null when none had been inspected. */
export function averageAsOf(props: Property[], at: number): number | null {
  const scores: number[] = []
  for (const p of props) {
    let last: InspectionSummary | null = null
    for (const i of p.inspections) if (new Date(i.date).getTime() <= at) last = i
    if (last) scores.push(last.score)
  }
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null
}

const endOfUtcMonth = (year: number, month: number) => Date.UTC(year, month + 1, 1) - 1

/** The portfolio average at the end of each of the last `count` calendar months (the current month ends now). */
export function monthlyAverages(props: Property[], now: Date, count: number): { label: string; value: number | null }[] {
  const out: { label: string; value: number | null }[] = []
  for (let k = count - 1; k >= 0; k--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - k, 1))
    const end = k === 0 ? now.getTime() : endOfUtcMonth(d.getUTCFullYear(), d.getUTCMonth())
    out.push({ label: monthShort(d.getUTCMonth()), value: averageAsOf(props, end) })
  }
  return out
}

const quarterStart = (year: number, month: number) => Date.UTC(year, Math.floor(month / 3) * 3, 1)

export function inspectionsInQuarter(props: Property[], now: Date): { current: number; previous: number } {
  const y = now.getUTCFullYear()
  const m = now.getUTCMonth()
  const cur = quarterStart(y, m)
  const prev = quarterStart(y, m - 3)
  let current = 0
  let previous = 0
  for (const p of props)
    for (const i of p.inspections) {
      const t = new Date(i.date).getTime()
      if (t >= cur && t <= now.getTime()) current++
      else if (t >= prev && t < cur) previous++
    }
  return { current, previous }
}

/** Inspections dated today, and how many of them scored higher than the visit before. */
export function todaysInspections(props: Property[], now: Date): { added: number; improved: number } {
  let added = 0
  let improved = 0
  for (const p of props) {
    const n = p.inspections.length
    const l = p.inspections[n - 1]
    if (l && sameUtcDay(l.date, now)) {
      added++
      if (n > 1 && l.score > p.inspections[n - 2].score) improved++
    }
  }
  return { added, improved }
}

export const hasVisitPlanned = (p: Property, visits: Visit[]) => visits.some((v) => v.propertyId === p.id)

export function overdueUnplanned(props: Property[], visits: Visit[], now: Date): Property[] {
  return props.filter((p) => daysSince(p, now) > p.visitStandardDays && !hasVisitPlanned(p, visits))
}

export const openFollowUps = (fus: FollowUp[]) => fus.filter((f) => f.status !== 'done')
export const unassigned = (fus: FollowUp[]) => fus.filter((f) => f.status === 'open')

/** Points for a 120 by 40 sparkline. Values are mapped into y = 36 (lowest) to y = 4 (highest). */
export function sparklinePoints(values: (number | null)[]): string {
  const vs = values.filter((v): v is number => v != null)
  if (vs.length < 2) return ''
  const lo = Math.min(...vs) - 0.05
  const hi = Math.max(...vs) + 0.05
  const n = values.length
  const pts: string[] = []
  values.forEach((v, i) => {
    if (v == null) return
    pts.push(`${((i / (n - 1)) * 120).toFixed(1)},${(36 - ((v - lo) / (hi - lo)) * 32).toFixed(1)}`)
  })
  return pts.join(' ')
}

export const checkName = (i: number) => CHECKS[i].name

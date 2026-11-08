/**
 * Sample data for the demo workspace.
 * Used by `prisma/seed.ts` and by the nightly reseed route, so the sample
 * dates always sit relative to "now" and the dashboard never goes stale.
 */

import type { PrismaClient, ResultStatus } from '@prisma/client'
import { CATS, CHECKS, scoreOf } from '../domain/checks'
import { addDays, planningWeekStart, shortDate, startOfUtcDay } from '../domain/format'
import {
  SAMPLE_ACTIVITY,
  SAMPLE_CHECKS,
  SAMPLE_FOLLOW_UPS,
  SAMPLE_PEOPLE,
  SAMPLE_PROPERTIES,
  SAMPLE_VISITS,
} from '../domain/sample-data'

const DAY_MS = 86400000
const HOUR_MS = 3600000
const round1 = (n: number) => Math.round(n * 10) / 10

/** Every combination of nine answers, in the order p, n, f, with its score. */
let combos: { res: string; score: number; fails: number; needs: number }[] | null = null
function allCombos() {
  if (combos) return combos
  const out: { res: string; score: number; fails: number; needs: number }[] = []
  const letters = ['p', 'n', 'f']
  const total = 3 ** CHECKS.length
  for (let n = 0; n < total; n++) {
    let x = n
    const chars: string[] = new Array(CHECKS.length)
    for (let i = CHECKS.length - 1; i >= 0; i--) {
      chars[i] = letters[x % 3]
      x = Math.floor(x / 3)
    }
    const res = chars.join('')
    out.push({
      res,
      score: scoreOf(chars).s as number,
      fails: chars.filter((c) => c === 'f').length,
      needs: chars.filter((c) => c === 'n').length,
    })
  }
  combos = out
  return out
}

const picked = new Map<number, string>()
/** The answers whose score is closest to the target. Ties: fewer fails, fewer needs work, earlier string. */
export function resultsForTarget(target: number): string {
  const key = Math.round(target * 10)
  const hit = picked.get(key)
  if (hit) return hit
  let best = allCombos()[0]
  for (const c of allCombos()) {
    const d = Math.abs(c.score - target)
    const bd = Math.abs(best.score - target)
    if (d < bd - 1e-9 || (Math.abs(d - bd) <= 1e-9 && (c.fails < best.fails || (c.fails === best.fails && c.needs < best.needs)))) best = c
  }
  picked.set(key, best.res)
  return best.res
}

const RESULT_STATUS: Record<string, ResultStatus> = { p: 'PASS', n: 'NEEDS_IMPROVEMENT', f: 'FAIL' }
const RESULT_RATING: Record<string, number> = { p: 5, n: 3, f: 1 }

function olderInspector(countryCode: string, region: string, i: number): string {
  if (countryCode === 'KEN' || countryCode === 'TZA') return i % 2 === 0 ? 'John Davis' : 'Amina Otieno'
  if (region === 'Asia Pacific') return 'Mei Tan'
  return 'Sarah Wilson'
}

export type SeedCounts = {
  hotels: number
  inspections: number
  results: number
  followUps: number
  visits: number
  activities: number
}

export async function resetSampleData(prisma: PrismaClient, now: Date = new Date()): Promise<SeedCounts> {
  // 1. Checklist items (upsert by slug). Anything else is switched off, not deleted.
  const slugs = SAMPLE_CHECKS.map((c) => c.slug)
  for (const c of SAMPLE_CHECKS) {
    const data = {
      category: CATS[c.category],
      itemName: c.name,
      description: c.help,
      weight: c.weight,
      isActive: true,
      order: c.order,
      evidence: c.evidence,
    }
    await prisma.checklistItem.upsert({ where: { slug: c.slug }, create: { slug: c.slug, ...data }, update: data })
  }
  await prisma.checklistItem.updateMany({
    where: { OR: [{ slug: null }, { slug: { notIn: slugs } }] },
    data: { isActive: false },
  })
  const items = await prisma.checklistItem.findMany({ where: { slug: { in: slugs } } })
  const itemIdBySlug = new Map(items.map((i) => [i.slug as string, i.id]))

  // 2. People (upsert by email).
  for (const p of SAMPLE_PEOPLE) {
    const data = { name: p.name, role: p.role, region: p.region, isDemo: p.isDemo }
    await prisma.user.upsert({ where: { email: p.email }, create: { email: p.email, ...data }, update: data })
  }
  const users = await prisma.user.findMany({ where: { email: { in: SAMPLE_PEOPLE.map((p) => p.email) } } })
  const userByName = new Map(users.map((u) => [u.name as string, u]))
  const userByEmail = new Map(users.map((u) => [u.email, u]))

  // 3. Build every row in memory.
  const today = startOfUtcDay(now)
  const hotels = SAMPLE_PROPERTIES.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.place,
    city: p.city,
    country: p.country,
    countryCode: p.countryCode,
    region: p.region,
    latitude: p.lat,
    longitude: p.lon,
    kind: p.kind,
    sizeLabel: p.size,
    photoUrl: p.photo,
    visitStandardDays: 90,
    isSample: true,
  }))

  const inspections: {
    id: string
    hotelId: string
    inspectorId: string
    inspectionDate: Date
    overallRating: number
    status: 'COMPLETED'
    completedAt: Date
    followUpRequired: boolean
  }[] = []
  const results: {
    inspectionId: string
    checklistItemId: string
    result: ResultStatus
    rating: number
    category: string
    categoryRating: number
    photoUrls: string[]
  }[] = []

  for (const p of SAMPLE_PROPERTIES) {
    const latestScore = scoreOf(p.latestResults.split('')).s as number
    const latestDate = new Date(addDays(today, -p.daysSinceLatest).getTime() + 10 * HOUR_MS)
    const defaults = [latestScore + 0.3, latestScore + 0.1, latestScore + 0.2, latestScore + 0.1].map((v) => Math.min(5, round1(v)))
    const targets = p.history ?? defaults
    for (let i = 0; i < 5; i++) {
      const isLatest = i === 4
      const res = isLatest ? p.latestResults : resultsForTarget(targets[i])
      const date = isLatest ? latestDate : new Date(latestDate.getTime() - (4 - i) * 61 * DAY_MS)
      const inspectorName = isLatest ? p.latestInspector : olderInspector(p.countryCode, p.region, i)
      const inspector = userByName.get(inspectorName)
      if (!inspector) throw new Error(`Missing sample inspector: ${inspectorName}`)
      const sc = scoreOf(res.split(''))
      const id = `${p.id}-${i + 1}`
      inspections.push({
        id,
        hotelId: p.id,
        inspectorId: inspector.id,
        inspectionDate: date,
        overallRating: sc.s as number,
        status: 'COMPLETED',
        completedAt: date,
        followUpRequired: res.includes('f'),
      })
      res.split('').forEach((r, k) => {
        const checkId = itemIdBySlug.get(CHECKS[k].slug)
        if (!checkId) throw new Error(`Missing checklist item: ${CHECKS[k].slug}`)
        results.push({
          inspectionId: id,
          checklistItemId: checkId,
          result: RESULT_STATUS[r],
          rating: RESULT_RATING[r],
          category: CATS[CHECKS[k].category],
          categoryRating: sc.c[CHECKS[k].category] as number,
          photoUrls: [],
        })
      })
    }
  }

  const closedAt = addDays(now, -4)
  const followUps = SAMPLE_FOLLOW_UPS.map((f) => ({
    hotelId: f.propertyId,
    checklistItemId: itemIdBySlug.get(CHECKS[f.checkIndex].slug) as string,
    text: f.text,
    photoUrl: f.photo,
    status: f.status,
    ownerName: f.owner,
    note: f.status === 'DONE' ? `Closed by the inspection on ${shortDate(closedAt)}` : null,
    dueDate: addDays(now, f.dueInDays),
    closedAt: f.status === 'DONE' ? closedAt : null,
  }))

  const weekStart = planningWeekStart(now)
  const visits = SAMPLE_VISITS.map((v) => {
    const inspector = userByEmail.get(v.inspectorEmail)
    if (!inspector) throw new Error(`Missing sample inspector: ${v.inspectorEmail}`)
    return { hotelId: v.propertyId, inspectorId: inspector.id, date: new Date(addDays(weekStart, v.dayOffset).getTime() + 9 * HOUR_MS) }
  })

  const activities = SAMPLE_ACTIVITY.slice(0, 5).map((a) => ({
    hotelId: a.propertyId,
    actorName: a.actor,
    actorInitials: a.initials,
    text: a.text,
    createdAt: new Date(now.getTime() - a.minutesAgo * 60000),
  }))

  // 4. Replace the sample hotels (and, by cascade, everything under them) in one transaction.
  await prisma.$transaction([
    prisma.hotel.deleteMany({ where: { isSample: true } }),
    prisma.hotel.createMany({ data: hotels }),
    prisma.inspection.createMany({ data: inspections }),
    prisma.inspectionResult.createMany({ data: results }),
    prisma.followUp.createMany({ data: followUps }),
    prisma.visit.createMany({ data: visits }),
    prisma.activity.createMany({ data: activities }),
  ])

  return {
    hotels: hotels.length,
    inspections: inspections.length,
    results: results.length,
    followUps: followUps.length,
    visits: visits.length,
    activities: activities.length,
  }
}

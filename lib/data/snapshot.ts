/**
 * Loads everything the app needs to render, in one go, on the server.
 * The client keeps this as its starting state (see components/app/AppState.tsx).
 */

import { prisma } from '../prisma'
import { CHECKS, fullScore } from '../domain/checks'
import { initialsOf, planningWeekStart, addDays } from '../domain/format'
import { ACTOR_COLORS, SCHEDULE_PEOPLE } from '../domain/sample-data'
import type { Check, InspectionSummary, Note, Person, PortfolioSnapshot, Property } from '../domain/types'
import { followUpFromDb, resultsToString, visitFromDb } from './mappers'

const FALLBACK_COLORS = ['#6FE3C6', '#FFC56B', '#FFFFFF', '#B8C4FF']
const ROLE_WORD = { MANAGER: 'operations', INSPECTOR: 'inspector', ADMIN: 'admin' } as const

export type SnapshotUser = { id: string; name?: string | null; role: keyof typeof ROLE_WORD; isDemo: boolean }

export async function getPortfolioSnapshot(user: SnapshotUser, now: Date = new Date()): Promise<PortfolioSnapshot> {
  const weekStart = planningWeekStart(now)

  const [hotels, followUps, visits, activities, users, items] = await Promise.all([
    prisma.hotel.findMany({
      where: { inspections: { some: { status: { in: ['COMPLETED', 'APPROVED'] } } } },
      orderBy: { name: 'asc' },
      include: {
        inspections: {
          where: { status: { in: ['COMPLETED', 'APPROVED'] } },
          orderBy: { inspectionDate: 'asc' },
          include: {
            inspector: { select: { name: true } },
            inspectionResults: { include: { checklistItem: { select: { slug: true } } } },
          },
        },
      },
    }),
    prisma.followUp.findMany({ include: { checklistItem: { select: { slug: true } } }, orderBy: { dueDate: 'asc' } }),
    prisma.visit.findMany({ where: { date: { gte: weekStart, lt: addDays(weekStart, 7) } }, orderBy: { date: 'asc' } }),
    prisma.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
    prisma.user.findMany({ where: { OR: [{ role: 'INSPECTOR' }, { id: user.id }] } }),
    prisma.checklistItem.findMany({ where: { slug: { in: CHECKS.map((c) => c.slug) } } }),
  ])

  const itemBySlug = new Map(items.map((i) => [i.slug as string, i]))
  if (CHECKS.some((c) => !itemBySlug.has(c.slug))) {
    throw new Error('The checklist is not set up. Run the database seed.')
  }

  const checks: Check[] = CHECKS.map((c) => ({
    id: (itemBySlug.get(c.slug) as { id: string }).id,
    slug: c.slug,
    category: c.category,
    name: c.name,
    weight: c.weight,
    help: c.help,
    evidence: c.evidence,
    alt: c.alt,
  }))

  const properties: Property[] = []
  for (const h of hotels) {
    // A property can only be shown on the globe when it has a place on the map.
    if (h.latitude == null || h.longitude == null || !h.countryCode) continue
    const inspections: InspectionSummary[] = []
    for (const i of h.inspections) {
      const res = resultsToString(i.inspectionResults)
      if (!res) continue
      const { cats, score } = fullScore(res)
      inspections.push({ id: i.id, date: i.inspectionDate.toISOString(), inspector: i.inspector.name ?? 'A team member', score, cats, res })
    }
    if (!inspections.length) continue
    properties.push({
      id: h.id,
      name: h.name,
      place: h.city === h.country ? h.city : `${h.city}, ${h.country}`,
      city: h.city,
      country: h.country,
      countryCode: h.countryCode,
      region: h.region ?? h.country,
      lat: h.latitude,
      lon: h.longitude,
      photo: h.photoUrl,
      kind: h.kind ?? 'Property',
      size: h.sizeLabel ?? '',
      visitStandardDays: h.visitStandardDays,
      inspections,
    })
  }

  // Who can be scheduled: inspectors, plus the signed in user. In the order used by the schedule.
  const schedulable = users
    .filter((u) => u.role === 'INSPECTOR' || u.id === user.id)
    .sort((a, b) => {
      const ia = SCHEDULE_PEOPLE.indexOf(a.name ?? '')
      const ib = SCHEDULE_PEOPLE.indexOf(b.name ?? '')
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || (a.name ?? '').localeCompare(b.name ?? '')
    })
  const people: Person[] = schedulable.map((u, i) => {
    const initials = initialsOf(u.name ?? u.email)
    return { id: u.id, name: u.name ?? u.email, initials, region: u.region ?? '', color: ACTOR_COLORS[initials] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length] }
  })

  const notes: Note[] = activities.map((a) => ({
    id: a.id,
    initials: a.actorInitials,
    actor: a.actorName,
    text: a.text,
    propertyId: a.hotelId,
    color: ACTOR_COLORS[a.actorInitials] ?? '#FFFFFF',
    at: a.createdAt.toISOString(),
    unread: now.getTime() - a.createdAt.getTime() < 20 * 60000,
  }))

  const name = user.name ?? 'You'
  return {
    takenAt: now.toISOString(),
    weekStart: weekStart.toISOString(),
    user: {
      id: user.id,
      name,
      firstName: name.split(/\s+/)[0],
      initials: initialsOf(name),
      role: ROLE_WORD[user.role],
      isDemo: user.isDemo,
    },
    checks,
    properties,
    followUps: followUps.map(followUpFromDb),
    visits: visits.map(visitFromDb),
    notes,
    people,
  }
}


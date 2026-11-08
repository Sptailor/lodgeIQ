/**
 * Inspections API
 *
 * POST /api/inspections - Submit a completed inspection
 *
 * Body: { propertyId: string, results: string (9 characters of p, n or f), photos?: string[][] }
 * Returns: { inspection, followUps } where followUps are all follow ups for that property.
 * The demo account cannot call this route (403).
 */

import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { HttpError, requireWriter, toErrorResponse } from '@/lib/auth-utils'
import { CATS, CHECKS, fullScore, isValidAnswers } from '@/lib/domain/checks'
import { applyInspection } from '@/lib/domain/derive'
import { initialsOf } from '@/lib/domain/format'
import type { FollowUp, InspectionSummary } from '@/lib/domain/types'
import { followUpFromDb, followUpStatusToDb } from '@/lib/data/mappers'

const RESULT = { p: 'PASS', n: 'NEEDS_IMPROVEMENT', f: 'FAIL' } as const
const RATING = { p: 5, n: 3, f: 1 } as const

/** Keep only plain photo URLs, at most three per check. */
function cleanPhotos(input: unknown): string[][] {
  const out: string[][] = CHECKS.map(() => [])
  if (!Array.isArray(input)) return out
  input.slice(0, CHECKS.length).forEach((list, i) => {
    if (!Array.isArray(list)) return
    out[i] = list
      .filter((u): u is string => typeof u === 'string' && u.length <= 500 && (u.startsWith('https://') || u.startsWith('/')))
      .slice(0, 3)
  })
  return out
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireWriter()
    const body = await request.json().catch(() => null)
    if (!body || typeof body.propertyId !== 'string' || !isValidAnswers(body.results)) {
      throw new HttpError(400, 'Send a propertyId and nine answers made of p, n or f')
    }
    const results: string = body.results
    const photos = cleanPhotos(body.photos)

    const hotel = await prisma.hotel.findUnique({ where: { id: body.propertyId } })
    if (!hotel) throw new HttpError(404, 'Property not found')

    const items = await prisma.checklistItem.findMany({ where: { slug: { in: CHECKS.map((c) => c.slug) } } })
    const itemId = new Map(items.map((i) => [i.slug as string, i.id]))
    if (CHECKS.some((c) => !itemId.has(c.slug))) throw new HttpError(500, 'The checklist is not set up. Run the seed.')

    const now = new Date()
    const { cats, score } = fullScore(results)

    const existing = await prisma.followUp.findMany({
      where: { hotelId: hotel.id },
      include: { checklistItem: { select: { slug: true } } },
    })
    const applied = applyInspection(existing.map(followUpFromDb), hotel.id, results, photos, now)

    const inspectionId = randomUUID()
    const existingIds = new Set(existing.map((f) => f.id))
    const ops = [
      prisma.inspection.create({
        data: {
          id: inspectionId,
          hotelId: hotel.id,
          inspectorId: user.id,
          inspectionDate: now,
          overallRating: score,
          status: 'COMPLETED',
          completedAt: now,
          followUpRequired: results.includes('f'),
          inspectionResults: {
            create: results.split('').map((r, i) => ({
              checklistItemId: itemId.get(CHECKS[i].slug) as string,
              result: RESULT[r as 'p' | 'n' | 'f'],
              rating: RATING[r as 'p' | 'n' | 'f'],
              category: CATS[CHECKS[i].category],
              categoryRating: cats[CHECKS[i].category],
              photoUrls: photos[i],
            })),
          },
        },
      }),
      ...applied.followUps
        .filter((f) => f.propertyId === hotel.id)
        .map((f) =>
          existingIds.has(f.id)
            ? prisma.followUp.update({
                where: { id: f.id },
                data: {
                  status: followUpStatusToDb(f.status),
                  note: f.note,
                  closedAt: f.status === 'done' ? now : undefined,
                },
              })
            : prisma.followUp.create({
                data: {
                  id: f.id,
                  hotelId: hotel.id,
                  checklistItemId: itemId.get(CHECKS[f.checkIndex].slug) as string,
                  inspectionId,
                  text: f.text,
                  photoUrl: f.photo,
                  status: 'OPEN',
                  dueDate: new Date(f.due),
                },
              })
        ),
      prisma.activity.create({
        data: {
          hotelId: hotel.id,
          actorName: user.name ?? 'A team member',
          actorInitials: initialsOf(user.name ?? 'A'),
          text: `submitted ${hotel.name}. Score ${score.toFixed(1)}.`,
        },
      }),
    ]
    await prisma.$transaction(ops)

    const inspection: InspectionSummary = {
      id: inspectionId,
      date: now.toISOString(),
      inspector: user.name ?? 'A team member',
      score,
      cats,
      res: results,
    }
    const followUps: FollowUp[] = applied.followUps.filter((f) => f.propertyId === hotel.id)
    return NextResponse.json({ inspection, followUps, closed: applied.closed, improved: applied.improved, opened: applied.opened }, { status: 201 })
  } catch (e) {
    return toErrorResponse(e)
  }
}

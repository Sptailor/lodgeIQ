/**
 * Visits API
 *
 * POST /api/visits  { propertyId, inspectorId, date }
 * Plans a visit. Any other upcoming visit for the same property is replaced.
 * The demo account cannot call this route (403).
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HttpError, requireWriter, toErrorResponse } from '@/lib/auth-utils'
import { startOfUtcDay } from '@/lib/domain/format'
import { visitFromDb } from '@/lib/data/mappers'
import { visitDate } from '@/lib/data/visit-date'

export async function POST(request: NextRequest) {
  try {
    await requireWriter()
    const body = await request.json().catch(() => null)
    if (!body || typeof body.propertyId !== 'string' || typeof body.inspectorId !== 'string') {
      throw new HttpError(400, 'Send a propertyId, an inspectorId and a date')
    }
    const date = visitDate(body.date)
    const [hotel, inspector] = await Promise.all([
      prisma.hotel.findUnique({ where: { id: body.propertyId } }),
      prisma.user.findUnique({ where: { id: body.inspectorId } }),
    ])
    if (!hotel) throw new HttpError(404, 'Property not found')
    if (!inspector) throw new HttpError(404, 'Inspector not found')

    const [, visit] = await prisma.$transaction([
      prisma.visit.deleteMany({ where: { hotelId: hotel.id, date: { gte: startOfUtcDay(new Date()) } } }),
      prisma.visit.create({ data: { hotelId: hotel.id, inspectorId: inspector.id, date } }),
    ])
    return NextResponse.json({ visit: visitFromDb(visit) }, { status: 201 })
  } catch (e) {
    return toErrorResponse(e)
  }
}

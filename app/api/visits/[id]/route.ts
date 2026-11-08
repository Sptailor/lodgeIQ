/**
 * PATCH /api/visits/:id  { inspectorId, date }
 * Moves a planned visit to another inspector or day.
 * The demo account cannot call this route (403).
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HttpError, requireWriter, toErrorResponse } from '@/lib/auth-utils'
import { visitFromDb } from '@/lib/data/mappers'
import { visitDate } from '@/lib/data/visit-date'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireWriter()
    const body = await request.json().catch(() => null)
    if (!body || typeof body.inspectorId !== 'string') throw new HttpError(400, 'Send an inspectorId and a date')
    const existing = await prisma.visit.findUnique({ where: { id: params.id } })
    if (!existing) throw new HttpError(404, 'Visit not found')
    const inspector = await prisma.user.findUnique({ where: { id: body.inspectorId } })
    if (!inspector) throw new HttpError(404, 'Inspector not found')
    const visit = await prisma.visit.update({
      where: { id: params.id },
      data: { inspectorId: inspector.id, date: visitDate(body.date) },
    })
    return NextResponse.json({ visit: visitFromDb(visit) })
  } catch (e) {
    return toErrorResponse(e)
  }
}

/**
 * Follow ups API
 *
 * PATCH /api/follow-ups/:id
 *   { action: 'assign', owner: string }  open -> in progress, with an owner
 *   { action: 'resolve' }                in progress -> done
 * The demo account cannot call this route (403).
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HttpError, requireWriter, toErrorResponse } from '@/lib/auth-utils'
import { followUpFromDb } from '@/lib/data/mappers'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireWriter()
    const body = await request.json().catch(() => null)
    const row = await prisma.followUp.findUnique({ where: { id: params.id }, include: { checklistItem: { select: { slug: true } } } })
    if (!row) throw new HttpError(404, 'Follow up not found')

    if (body?.action === 'assign') {
      const owner = typeof body.owner === 'string' ? body.owner.trim() : ''
      if (!owner || owner.length > 80) throw new HttpError(400, 'Choose who will fix this')
      if (row.status !== 'OPEN') throw new HttpError(409, 'This follow up already has an owner')
      const updated = await prisma.followUp.update({
        where: { id: row.id },
        data: { status: 'IN_PROGRESS', ownerName: owner },
        include: { checklistItem: { select: { slug: true } } },
      })
      return NextResponse.json({ followUp: followUpFromDb(updated) })
    }

    if (body?.action === 'resolve') {
      if (row.status !== 'IN_PROGRESS') throw new HttpError(409, 'Only a follow up that is being fixed can be marked as fixed')
      const updated = await prisma.followUp.update({
        where: { id: row.id },
        data: { status: 'DONE', closedAt: new Date(), note: 'Marked as fixed. The next inspection confirms it.' },
        include: { checklistItem: { select: { slug: true } } },
      })
      return NextResponse.json({ followUp: followUpFromDb(updated) })
    }

    throw new HttpError(400, 'Unknown action')
  } catch (e) {
    return toErrorResponse(e)
  }
}

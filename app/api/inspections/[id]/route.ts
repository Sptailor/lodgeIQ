/**
 * Single Inspection API Route
 *
 * GET /api/inspections/[id] - Fetch inspection with results
 * PUT /api/inspections/[id] - Update inspection (complete, add notes, etc.)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/inspections/[id]
 * Returns inspection with all results and checklist items
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const inspection = await prisma.inspection.findUnique({
      where: { id: params.id },
      include: {
        hotel: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        inspectionResults: {
          include: {
            checklistItem: true,
          },
          orderBy: [
            { checklistItem: { category: 'asc' } },
            { checklistItem: { order: 'asc' } },
          ],
        },
      },
    })

    if (!inspection) {
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(inspection, { status: 200 })
  } catch (error) {
    console.error('Error fetching inspection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inspection' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/inspections/[id]
 * Updates inspection status, notes, rating, etc.
 *
 * Expected body:
 * {
 *   status?: 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED'
 *   notes?: string
 *   overallRating?: number
 *   followUpRequired?: boolean
 *   followUpNotes?: string
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json()

    const updateData: any = {}

    if (body.status) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.overallRating !== undefined) updateData.overallRating = body.overallRating
    if (body.followUpRequired !== undefined) updateData.followUpRequired = body.followUpRequired
    if (body.followUpNotes !== undefined) updateData.followUpNotes = body.followUpNotes

    // If marking as completed, set completedAt timestamp
    if (body.status === 'COMPLETED') {
      updateData.completedAt = new Date()
    }

    const inspection = await prisma.inspection.update({
      where: { id: params.id },
      data: updateData,
      include: {
        hotel: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(inspection, { status: 200 })
  } catch (error) {
    console.error('Error updating inspection:', error)
    return NextResponse.json(
      { error: 'Failed to update inspection' },
      { status: 500 }
    )
  }
}

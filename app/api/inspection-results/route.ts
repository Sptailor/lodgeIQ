/**
 * Inspection Results API Route
 *
 * POST /api/inspection-results - Save or update inspection result for a checklist item
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/inspection-results
 * Creates or updates an inspection result for a specific checklist item
 *
 * Expected body:
 * {
 *   inspectionId: string (required)
 *   checklistItemId: string (required)
 *   result: 'PENDING' | 'PASS' | 'FAIL' | 'NEEDS_IMPROVEMENT' | 'NOT_APPLICABLE' (required)
 *   rating?: number (0-5)
 *   notes?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.inspectionId || !body.checklistItemId || !body.result) {
      return NextResponse.json(
        { error: 'Missing required fields: inspectionId, checklistItemId, result' },
        { status: 400 }
      )
    }

    // Validate result enum
    const validResults = ['PENDING', 'PASS', 'FAIL', 'NEEDS_IMPROVEMENT', 'NOT_APPLICABLE']
    if (!validResults.includes(body.result)) {
      return NextResponse.json(
        { error: 'Invalid result value' },
        { status: 400 }
      )
    }

    // Use upsert to create or update the result
    // The unique constraint on [inspectionId, checklistItemId] ensures one result per item
    const result = await prisma.inspectionResult.upsert({
      where: {
        inspectionId_checklistItemId: {
          inspectionId: body.inspectionId,
          checklistItemId: body.checklistItemId,
        },
      },
      update: {
        result: body.result,
        rating: body.rating || null,
        notes: body.notes || '',
      },
      create: {
        inspectionId: body.inspectionId,
        checklistItemId: body.checklistItemId,
        result: body.result,
        rating: body.rating || null,
        notes: body.notes || '',
        photoUrls: [], // Empty array for now (photo upload in future step)
      },
      include: {
        checklistItem: true,
      },
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error saving inspection result:', error)
    return NextResponse.json(
      { error: 'Failed to save inspection result' },
      { status: 500 }
    )
  }
}

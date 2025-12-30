/**
 * Checklist Items API Route
 *
 * GET /api/checklist-items - Fetch all active checklist items
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/checklist-items
 * Returns all active checklist items, grouped by category
 */
export async function GET() {
  try {
    const items = await prisma.checklistItem.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
      ],
    })

    return NextResponse.json(items, { status: 200 })
  } catch (error) {
    console.error('Error fetching checklist items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch checklist items' },
      { status: 500 }
    )
  }
}

/**
 * Inspections API Route
 *
 * POST /api/inspections - Create a new inspection
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, canCreateInspection } from '@/lib/auth-utils'

/**
 * POST /api/inspections
 * Creates a new inspection for a hotel
 *
 * Expected body:
 * {
 *   hotelId: string (required)
 *   notes?: string
 * }
 *
 * Requires authentication and INSPECTOR or ADMIN role
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser()

    if (!(await canCreateInspection())) {
      return NextResponse.json(
        { error: 'Only inspectors and admins can create inspections' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.hotelId) {
      return NextResponse.json(
        { error: 'Missing required field: hotelId' },
        { status: 400 }
      )
    }

    // Verify hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: body.hotelId },
    })

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Create inspection in IN_PROGRESS status
    // Use authenticated user as inspector
    const inspection = await prisma.inspection.create({
      data: {
        hotelId: body.hotelId,
        inspectorId: user.id,
        status: 'IN_PROGRESS',
        notes: body.notes || '',
        inspectionDate: new Date(),
      },
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

    return NextResponse.json(inspection, { status: 201 })
  } catch (error) {
    console.error('Error creating inspection:', error)

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create inspection' },
      { status: 500 }
    )
  }
}

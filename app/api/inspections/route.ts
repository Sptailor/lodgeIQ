/**
 * Inspections API Route
 *
 * POST /api/inspections - Create a new inspection
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/inspections
 * Creates a new inspection for a hotel
 *
 * Expected body:
 * {
 *   hotelId: string (required)
 *   inspectorId: string (required)
 *   notes?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.hotelId || !body.inspectorId) {
      return NextResponse.json(
        { error: 'Missing required fields: hotelId, inspectorId' },
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

    // Verify inspector exists
    const inspector = await prisma.user.findUnique({
      where: { id: body.inspectorId },
    })

    if (!inspector) {
      return NextResponse.json(
        { error: 'Inspector not found' },
        { status: 404 }
      )
    }

    // Create inspection in IN_PROGRESS status
    const inspection = await prisma.inspection.create({
      data: {
        hotelId: body.hotelId,
        inspectorId: body.inspectorId,
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
    return NextResponse.json(
      { error: 'Failed to create inspection' },
      { status: 500 }
    )
  }
}

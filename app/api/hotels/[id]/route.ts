/**
 * Single Hotel API Route
 *
 * GET /api/hotels/[id] - Fetch a single hotel by ID
 * PUT /api/hotels/[id] - Update a hotel
 * DELETE /api/hotels/[id] - Delete a hotel
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/hotels/[id]
 * Returns a single hotel with its inspections
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: params.id },
      include: {
        inspections: {
          orderBy: { inspectionDate: 'desc' },
          take: 10, // Get last 10 inspections
          include: {
            inspector: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(hotel, { status: 200 })
  } catch (error) {
    console.error('Error fetching hotel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/hotels/[id]
 * Updates an existing hotel
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json()

    const hotel = await prisma.hotel.update({
      where: { id: params.id },
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        country: body.country,
        phone: body.phone || null,
        email: body.email || null,
        website: body.website || null,
        description: body.description || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
      },
    })

    return NextResponse.json(hotel, { status: 200 })
  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json(
      { error: 'Failed to update hotel' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/hotels/[id]
 * Deletes a hotel (this will cascade delete all related inspections)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await prisma.hotel.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: 'Hotel deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json(
      { error: 'Failed to delete hotel' },
      { status: 500 }
    )
  }
}

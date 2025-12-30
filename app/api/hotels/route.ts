/**
 * Hotels API Route
 *
 * GET /api/hotels - Fetch all hotels
 * POST /api/hotels - Create a new hotel
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/hotels
 * Returns all hotels from the database
 */
export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // Optionally include inspection count
      include: {
        _count: {
          select: { inspections: true },
        },
      },
    })

    return NextResponse.json(hotels, { status: 200 })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hotels
 * Creates a new hotel in the database
 *
 * Expected body:
 * {
 *   name: string (required)
 *   address: string (required)
 *   city: string (required)
 *   country: string (required)
 *   phone?: string
 *   email?: string
 *   website?: string
 *   description?: string
 *   latitude?: number
 *   longitude?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.address || !body.city || !body.country) {
      return NextResponse.json(
        { error: 'Missing required fields: name, address, city, country' },
        { status: 400 }
      )
    }

    // Create hotel in database
    const hotel = await prisma.hotel.create({
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

    return NextResponse.json(hotel, { status: 201 })
  } catch (error) {
    console.error('Error creating hotel:', error)
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    )
  }
}

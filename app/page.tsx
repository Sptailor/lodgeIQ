/**
 * Home Page - Hotel List
 *
 * This page displays all hotels and allows creating new ones
 * Uses Server Components for initial data fetching
 */

import { prisma } from '@/lib/prisma'
import HotelList from '@/components/HotelList'
import AddHotelForm from '@/components/AddHotelForm'

/**
 * Fetch hotels on the server (Server Component)
 * This runs on the server and sends HTML to the client
 */
async function getHotels() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { inspections: true },
        },
      },
    })
    return hotels
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return []
  }
}

export default async function HomePage() {
  const hotels = await getHotels()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Hotels</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your hotel database and track inspections
        </p>
      </div>

      {/* Add hotel form */}
      <div className="mb-8">
        <AddHotelForm />
      </div>

      {/* Hotels list */}
      <div>
        <HotelList initialHotels={hotels} />
      </div>
    </div>
  )
}

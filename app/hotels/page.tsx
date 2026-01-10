/**
 * Hotels List Page
 *
 * Central page for managing all hotels
 * Shows all hotels with search, filter, and management capabilities
 */

import { prisma } from '@/lib/prisma'
import HotelList from '@/components/HotelList'
import AddHotelForm from '@/components/AddHotelForm'

/**
 * Fetch all hotels on the server
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

export default async function HotelsPage() {
  const hotels = await getHotels()

  return (
    <div className="space-y-4">
      {/* Page Header - Glass UI */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/20 dark:border-neutral-700/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Property Management
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-400">
              Manage your property portfolio and inspections
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Properties</p>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">{hotels.length}</p>
          </div>
        </div>
      </div>

      {/* Add Hotel Form - Glass UI */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-2xl p-5 shadow-lg">
        <AddHotelForm />
      </div>

      {/* Hotels List - Glass UI */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-2xl p-5 shadow-lg">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
            All Properties
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} in total
          </p>
        </div>
        <HotelList initialHotels={hotels} />
      </div>
    </div>
  )
}

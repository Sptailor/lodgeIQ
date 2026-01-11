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
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Glass UI */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-white/20 dark:border-neutral-700/50 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-1 sm:mb-2">
              Property Management
            </h1>
            <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">
              Manage your property portfolio and inspections
            </p>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Total Properties</p>
            <p className="text-2xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">{hotels.length}</p>
          </div>
        </div>
      </div>

      {/* Add Hotel Form - Glass UI */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <AddHotelForm />
      </div>

      {/* Hotels List - Glass UI */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1 sm:mb-2">
            All Properties
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} in total
          </p>
        </div>
        <HotelList initialHotels={hotels} />
      </div>
    </div>
  )
}

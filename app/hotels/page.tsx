/**
 * Hotels List Page
 *
 * Central page for managing all hotels
 * Shows all hotels with search, filter, and management capabilities
 */

import { prisma } from '@/lib/prisma'
import HotelList from '@/components/HotelList'
import AddHotelForm from '@/components/AddHotelForm'
import { Breadcrumb } from '@/components/ui/breadcrumb'

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
      {/* Breadcrumb navigation */}
      <Breadcrumb items={[{ label: 'Hotels' }]} />

      {/* Page Header - Glass UI */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-7 border-2 border-white/20 dark:border-neutral-700/50 shadow-lg">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-teal-400 to-accent-500"></div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-teal-500/5 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-1 sm:mb-2">
              Property Management
            </h1>
            <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">
              Manage your property portfolio and inspections
            </p>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 px-4 py-3 bg-accent-50/50 dark:bg-accent-900/20 rounded-xl border border-accent-200/50 dark:border-accent-800/30">
            <p className="text-xs sm:text-sm font-medium text-accent-700 dark:text-accent-300">Total Properties</p>
            <p className="text-2xl sm:text-4xl font-bold text-accent-600 dark:text-accent-400">{hotels.length}</p>
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

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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Hotels
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage your property portfolio and inspections
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-neutral-400 mb-2">Total Properties</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-neutral-50">{hotels.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-neutral-400 mb-2">Active</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-neutral-50">{hotels.length}</p>
        </div>
      </div>

      {/* Add Hotel Form */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-4">
          Add New Property
        </h2>
        <AddHotelForm />
      </div>

      {/* Hotels List */}
      <div>
        <HotelList initialHotels={hotels} />
      </div>
    </div>
  )
}

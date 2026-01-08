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
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-white via-accent-50/20 to-gold-50/30 dark:from-neutral-800/60 dark:via-accent-950/20 dark:to-neutral-900/50 dark:backdrop-blur-xl rounded-lg p-5 border border-accent-200/60 dark:border-accent-800/40 shadow-soft-lg ring-1 ring-accent-100/50 dark:ring-accent-900/20">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
          Properties
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-300 font-medium">
          Manage your property portfolio and inspections
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-accent-50/50 to-white dark:from-accent-950/20 dark:to-neutral-900/40 dark:backdrop-blur-xl border border-accent-200/60 dark:border-accent-800/30 rounded-xl overflow-hidden shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-accent-500 to-accent-600" />
          <div className="p-6">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Total Properties</p>
            <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">{hotels.length}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-neutral-900/40 dark:backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl overflow-hidden shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <div className="p-6">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Active Properties</p>
            <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">{hotels.length}</p>
          </div>
        </div>
      </div>

      {/* Add Hotel Form */}
      <div className="bg-gradient-to-br from-white to-primary-50/30 dark:from-neutral-800/50 dark:to-neutral-900/50 dark:backdrop-blur-xl border border-primary-200/70 dark:border-primary-800/40 rounded-lg p-7 shadow-soft ring-1 ring-primary-100/50 dark:ring-primary-900/20">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-5">
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

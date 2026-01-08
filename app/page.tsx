/**
 * Home Page - Dashboard with KPIs and Hotel List
 *
 * Professional dashboard showing key metrics and hotel management
 * Uses Server Components for initial data fetching
 */

import { prisma } from '@/lib/prisma'
import HotelList from '@/components/HotelList'
import AddHotelForm from '@/components/AddHotelForm'
import { KPICard } from '@/components/ui/kpi-card'

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

/**
 * Fetch dashboard metrics
 */
async function getDashboardMetrics() {
  try {
    const totalHotels = await prisma.hotel.count()
    const totalInspections = await prisma.inspection.count()
    const completedInspections = await prisma.inspection.count({
      where: {
        status: {
          in: ['COMPLETED', 'APPROVED'],
        },
      },
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentInspections = await prisma.inspection.count({
      where: {
        inspectionDate: {
          gte: thirtyDaysAgo,
        },
      },
    })

    const inspectionsWithRatings = await prisma.inspection.findMany({
      where: {
        overallRating: {
          not: null,
        },
      },
      select: {
        overallRating: true,
      },
    })

    const avgRating =
      inspectionsWithRatings.length > 0
        ? inspectionsWithRatings.reduce((sum, i) => sum + (i.overallRating || 0), 0) /
          inspectionsWithRatings.length
        : 0

    return {
      totalHotels,
      totalInspections,
      completedInspections,
      recentInspections,
      avgRating,
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return {
      totalHotels: 0,
      totalInspections: 0,
      completedInspections: 0,
      recentInspections: 0,
      avgRating: 0,
    }
  }
}

export default async function HomePage() {
  const hotels = await getHotels()
  const metrics = await getDashboardMetrics()

  const completionRate = metrics.totalInspections > 0
    ? Math.round((metrics.completedInspections / metrics.totalInspections) * 100)
    : 0

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-white via-accent-50/20 to-gold-50/30 dark:from-neutral-800/60 dark:via-accent-950/20 dark:to-neutral-900/50 dark:backdrop-blur-xl rounded-lg p-5 border border-accent-200/60 dark:border-accent-800/40 shadow-soft-lg ring-1 ring-accent-100/50 dark:ring-accent-900/20">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
          Dashboard
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-300 font-medium">
          Overview of your hotel inspection operations
        </p>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Hotels"
          value={metrics.totalHotels}
          icon="building"
          variant="primary"
          subtitle={`${hotels.length} properties managed`}
        />
        <KPICard
          title="Total Inspections"
          value={metrics.totalInspections}
          icon="clipboard"
          variant="default"
          trend={{
            value: metrics.recentInspections,
            label: `${metrics.recentInspections} in last 30 days`,
            direction: 'neutral',
          }}
        />
        <KPICard
          title="Completed"
          value={metrics.completedInspections}
          icon="check-circle"
          variant="success"
          subtitle={
            metrics.totalInspections > 0
              ? `${completionRate}% completion rate`
              : 'No inspections yet'
          }
        />
        <KPICard
          title="Avg Rating"
          value={metrics.avgRating > 0 ? metrics.avgRating.toFixed(1) : 'N/A'}
          icon="trending-up"
          variant={metrics.avgRating >= 4 ? 'success' : metrics.avgRating >= 3 ? 'warning' : 'danger'}
          subtitle={metrics.avgRating > 0 ? 'Out of 5.0 stars' : 'No ratings yet'}
        />
      </div>

      {/* Hotels Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Properties
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">
              {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} in your portfolio
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-primary-50/30 dark:from-neutral-800/50 dark:to-neutral-900/50 dark:backdrop-blur-xl border border-primary-200/70 dark:border-primary-800/40 rounded-lg p-7 shadow-soft ring-1 ring-primary-100/50 dark:ring-primary-900/20">
          <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-5">Add New Property</h3>
          <AddHotelForm />
        </div>

        <div>
          <HotelList initialHotels={hotels} />
        </div>
      </div>
    </div>
  )
}

/**
 * Home Page - Dashboard with KPIs and Hotel List
 *
 * Professional dashboard showing key metrics and hotel management
 * Uses Server Components for initial data fetching
 */

import { prisma } from '@/lib/prisma'
import HotelList from '@/components/HotelList'
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
    <div className="space-y-4">
      {/* Hero Header - Glass UI */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-2xl p-6 shadow-lg">
        {/* Decorative gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-tertiary-500 to-accent-500"></div>

        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-primary-100 to-tertiary-100 dark:from-primary-900/20 dark:to-tertiary-900/20 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-accent-100 to-primary-100 dark:from-accent-900/20 dark:to-primary-900/20 rounded-full blur-2xl opacity-50"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Overview of your hotel inspection operations
          </p>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Recent Properties Section - Glass UI */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Recent Properties
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Latest {Math.min(hotels.length, 6)} properties in your portfolio
            </p>
          </div>
        </div>
        <div>
          <HotelList initialHotels={hotels.slice(0, 6)} />
        </div>
      </div>
    </div>
  )
}

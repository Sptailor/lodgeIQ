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
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Dashboard
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Welcome to your hotel inspection platform overview
        </p>
      </div>

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

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
              Hotels
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your hotel database and track inspections
            </p>
          </div>
        </div>

        <div className="mb-6">
          <AddHotelForm />
        </div>

        <div>
          <HotelList initialHotels={hotels} />
        </div>
      </div>
    </div>
  )
}

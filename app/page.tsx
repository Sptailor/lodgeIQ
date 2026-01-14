/**
 * Home Page - Dashboard with KPIs and Hotel List
 *
 * Professional dashboard showing key metrics and hotel management
 * Uses Server Components for initial data fetching
 */

import { prisma } from '@/lib/prisma'
import HotelList from '@/components/HotelList'
import { KPICard } from '@/components/ui/kpi-card'
import { InspectionTrendsChart } from '@/components/charts/InspectionTrendsChart'
import { RatingDistributionChart } from '@/components/charts/RatingDistributionChart'
import { CompletionProgressChart } from '@/components/charts/CompletionProgressChart'

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

/**
 * Fetch inspection trends for chart
 */
async function getInspectionTrends() {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const inspections = await prisma.inspection.findMany({
      where: {
        inspectionDate: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        inspectionDate: true,
      },
    })

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyData: Record<string, number> = {}

    inspections.forEach((inspection) => {
      const date = new Date(inspection.inspectionDate)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })

    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      last6Months.push({
        month: monthNames[date.getMonth()],
        inspections: monthlyData[monthKey] || 0,
      })
    }

    return last6Months
  } catch (error) {
    console.error('Error fetching inspection trends:', error)
    return []
  }
}

/**
 * Fetch rating distribution for chart
 */
async function getRatingDistribution() {
  try {
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

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    inspectionsWithRatings.forEach((inspection) => {
      const rating = Math.floor(inspection.overallRating || 0)
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++
      }
    })

    return [
      { rating: '1 Star', count: distribution[1] },
      { rating: '2 Stars', count: distribution[2] },
      { rating: '3 Stars', count: distribution[3] },
      { rating: '4 Stars', count: distribution[4] },
      { rating: '5 Stars', count: distribution[5] },
    ]
  } catch (error) {
    console.error('Error fetching rating distribution:', error)
    return []
  }
}

/**
 * Fetch inspection status counts
 */
async function getInspectionStatusCounts() {
  try {
    const completed = await prisma.inspection.count({
      where: { status: { in: ['COMPLETED', 'APPROVED'] } },
    })

    const inProgress = await prisma.inspection.count({
      where: { status: 'IN_PROGRESS' },
    })

    const pending = await prisma.inspection.count({
      where: { status: 'SCHEDULED' },
    })

    return { completed, inProgress, pending }
  } catch (error) {
    console.error('Error fetching inspection status counts:', error)
    return { completed: 0, inProgress: 0, pending: 0 }
  }
}

export default async function HomePage() {
  const hotels = await getHotels()
  const metrics = await getDashboardMetrics()
  const trendsData = await getInspectionTrends()
  const ratingData = await getRatingDistribution()
  const statusCounts = await getInspectionStatusCounts()

  const completionRate = metrics.totalInspections > 0
    ? Math.round((metrics.completedInspections / metrics.totalInspections) * 100)
    : 0

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Header - Glass UI */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        {/* Decorative gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-tertiary-500 to-accent-500"></div>

        {/* Decorative circles - hidden on mobile */}
        <div className="hidden sm:block absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-primary-100 to-tertiary-100 dark:from-primary-900/20 dark:to-tertiary-900/20 rounded-full blur-2xl opacity-50"></div>
        <div className="hidden sm:block absolute -left-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-accent-100 to-primary-100 dark:from-accent-900/20 dark:to-primary-900/20 rounded-full blur-2xl opacity-50"></div>

        <div className="relative z-10">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 sm:mb-3">
            Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-base md:text-lg">
            Overview of your hotel inspection operations
          </p>
        </div>
      </div>

      {/* KPI Metrics Grid - Improved spacing and layout */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Inspection Trends Chart */}
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Inspection Trends
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Last 6 months
            </p>
          </div>
          <InspectionTrendsChart data={trendsData} />
        </div>

        {/* Rating Distribution Chart */}
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Rating Distribution
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              All completed inspections
            </p>
          </div>
          <RatingDistributionChart data={ratingData} />
        </div>
      </div>

      {/* Completion Progress Chart */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 sm:mb-2.5">
            Inspection Status
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Current status breakdown across all inspections
          </p>
        </div>
        <CompletionProgressChart
          completed={statusCounts.completed}
          inProgress={statusCounts.inProgress}
          pending={statusCounts.pending}
        />
      </div>

      {/* Recent Properties Section - Glass UI */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 sm:mb-2.5">
            Recent Properties
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Latest {Math.min(hotels.length, 6)} properties in your portfolio
          </p>
        </div>
        <div>
          <HotelList initialHotels={hotels.slice(0, 6)} />
        </div>
      </div>
    </div>
  )
}

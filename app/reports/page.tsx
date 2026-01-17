/**
 * Reports Page - Comprehensive Analytics Dashboard
 *
 * Displays detailed analytics, trends, and charts
 * Filterable by hotel, date range, and inspection category
 */

import { prisma } from '@/lib/prisma'
import { InspectionTrendsChart } from '@/components/charts/InspectionTrendsChart'
import { RatingDistributionChart } from '@/components/charts/RatingDistributionChart'
import { CompletionProgressChart } from '@/components/charts/CompletionProgressChart'
import { HotelPerformanceChart } from '@/components/charts/HotelPerformanceChart'
import { InspectorActivityChart } from '@/components/charts/InspectorActivityChart'
import { CategoryRatingsChart } from '@/components/charts/CategoryRatingsChart'

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

async function getInspectionStatusCounts() {
  try {
    const completed = await prisma.inspection.count({
      where: { status: { in: ['COMPLETED', 'APPROVED'] } },
    })

    const inProgress = await prisma.inspection.count({
      where: { status: 'IN_PROGRESS' },
    })

    const rejected = await prisma.inspection.count({
      where: { status: 'REJECTED' },
    })

    return { completed, inProgress, pending: rejected }
  } catch (error) {
    console.error('Error fetching inspection status counts:', error)
    return { completed: 0, inProgress: 0, pending: 0 }
  }
}

async function getHotelPerformance() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        inspections: {
          where: {
            overallRating: { not: null },
          },
          select: {
            overallRating: true,
          },
        },
      },
    })

    return hotels.map((hotel) => {
      const ratings = hotel.inspections.map((i) => i.overallRating || 0)
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
      return {
        hotel: hotel.name.length > 20 ? hotel.name.substring(0, 18) + '...' : hotel.name,
        avgRating,
        inspections: hotel.inspections.length,
      }
    }).sort((a, b) => b.avgRating - a.avgRating).slice(0, 10)
  } catch (error) {
    console.error('Error fetching hotel performance:', error)
    return []
  }
}

async function getInspectorActivity() {
  try {
    const inspectors = await prisma.user.findMany({
      where: { role: 'INSPECTOR' },
      include: {
        inspections: {
          where: {
            status: { in: ['COMPLETED', 'APPROVED'] },
          },
          select: {
            overallRating: true,
          },
        },
      },
    })

    return inspectors.map((inspector) => {
      const ratings = inspector.inspections.map((i) => i.overallRating || 0).filter((r) => r > 0)
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
      return {
        inspector: inspector.name || 'Unknown',
        completed: inspector.inspections.length,
        avgRating,
      }
    }).sort((a, b) => b.completed - a.completed)
  } catch (error) {
    console.error('Error fetching inspector activity:', error)
    return []
  }
}

async function getCategoryRatings() {
  try {
    const categories = ['Cleanliness', 'Safety', 'Amenities']

    const categoryData = await Promise.all(
      categories.map(async (category) => {
        const items = await prisma.checklistItem.findMany({
          where: { category },
          include: {
            inspectionResults: {
              where: {
                rating: { not: null },
              },
              select: {
                rating: true,
              },
            },
          },
        })

        const allRatings = items.flatMap((item) => item.inspectionResults.map((r) => r.rating || 0))
        const avgRating = allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0

        return {
          category,
          rating: avgRating,
        }
      })
    )

    return categoryData
  } catch (error) {
    console.error('Error fetching category ratings:', error)
    return []
  }
}

export default async function ReportsPage() {
  const trendsData = await getInspectionTrends()
  const ratingData = await getRatingDistribution()
  const statusCounts = await getInspectionStatusCounts()
  const hotelPerformance = await getHotelPerformance()
  const inspectorActivity = await getInspectorActivity()
  const categoryRatings = await getCategoryRatings()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-tertiary-500 to-accent-500"></div>
        <div className="hidden sm:block absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-primary-100 to-tertiary-100 dark:from-primary-900/20 dark:to-tertiary-900/20 rounded-full blur-2xl opacity-50"></div>
        <div className="hidden sm:block absolute -left-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-accent-100 to-primary-100 dark:from-accent-900/20 dark:to-primary-900/20 rounded-full blur-2xl opacity-50"></div>

        <div className="relative z-10">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 sm:mb-3">
            Reports & Analytics
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-base md:text-lg">
            Detailed insights and trends from your inspection data
          </p>
        </div>
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

        {/* Hotel Performance Chart */}
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Hotel Performance
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Average ratings by hotel
            </p>
          </div>
          <HotelPerformanceChart data={hotelPerformance} />
        </div>

        {/* Inspector Activity Chart */}
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Inspector Activity
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Completed inspections and ratings
            </p>
          </div>
          <InspectorActivityChart data={inspectorActivity} />
        </div>

        {/* Category Ratings Chart */}
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Category Ratings
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Average ratings by category
            </p>
          </div>
          <CategoryRatingsChart data={categoryRatings} />
        </div>
      </div>

      {/* Completion Progress Chart */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 sm:mb-2.5">
            Inspection Status Overview
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Current status breakdown across all inspections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="flex items-center justify-center">
            <CompletionProgressChart
              completed={statusCounts.completed}
              inProgress={statusCounts.inProgress}
              pending={statusCounts.pending}
            />
          </div>

          {/* Status Cards */}
          <div className="flex flex-col justify-center gap-4">
            {/* Completed Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Completed</h3>
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{statusCounts.completed}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Total completed inspections
              </p>
            </div>

            {/* In Progress Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">In Progress</h3>
              </div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">{statusCounts.inProgress}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Currently in progress
              </p>
            </div>

            {/* Rejected Card */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-violet-200/50 dark:border-violet-800/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Rejected</h3>
              </div>
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-1">{statusCounts.pending}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Rejected inspections
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

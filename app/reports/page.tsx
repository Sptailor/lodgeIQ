/**
 * Reports Page - Comprehensive Analytics Dashboard
 *
 * Displays detailed analytics, trends, and charts with global filtering
 * Filters apply to ALL sections: status overview, charts, and geographic view
 */

import { prisma } from '@/lib/prisma'
import { InspectionTrendsChart } from '@/components/charts/InspectionTrendsChart'
import { RatingDistributionChart } from '@/components/charts/RatingDistributionChart'
import { CompletionProgressChart } from '@/components/charts/CompletionProgressChart'
import { InspectorActivityChart } from '@/components/charts/InspectorActivityChart'
import { CategoryRatingsChart } from '@/components/charts/CategoryRatingsChart'
import { GeographicMap } from '@/components/charts/GeographicMap'
import { ReportsClientWrapper } from '@/components/ReportsClientWrapper'

interface SearchParams {
  hotel?: string
  inspector?: string
  dateFrom?: string
  dateTo?: string
  categories?: string
  statuses?: string
}

async function getFilteredInspections(filters: SearchParams) {
  const whereClause: any = {}

  // Apply hotel filter
  if (filters.hotel) {
    whereClause.hotelId = filters.hotel
  }

  // Apply inspector filter
  if (filters.inspector) {
    whereClause.inspectorId = filters.inspector
  }

  // Apply date range filters
  if (filters.dateFrom || filters.dateTo) {
    whereClause.inspectionDate = {}
    if (filters.dateFrom) {
      whereClause.inspectionDate.gte = new Date(filters.dateFrom)
    }
    if (filters.dateTo) {
      whereClause.inspectionDate.lte = new Date(filters.dateTo)
    }
  }

  // Apply status filter
  if (filters.statuses) {
    const statusArray = filters.statuses.split(',').filter(Boolean)
    if (statusArray.length > 0) {
      whereClause.status = { in: statusArray }
    }
  }

  return prisma.inspection.findMany({
    where: whereClause,
    include: {
      hotel: true,
      inspector: true,
      inspectionResults: {
        select: {
          category: true,
          categoryRating: true,
        },
      },
    },
  })
}

async function getInspectionTrends(inspections: any[]) {
  try {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyData: Record<string, { total: number; completed: number }> = {}

    inspections.forEach((inspection) => {
      const date = new Date(inspection.inspectionDate)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, completed: 0 }
      }
      monthlyData[monthKey].total++
      if (inspection.status === 'COMPLETED' || inspection.status === 'APPROVED') {
        monthlyData[monthKey].completed++
      }
    })

    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      last6Months.push({
        month: monthNames[date.getMonth()],
        inspections: monthlyData[monthKey]?.total || 0,
        completed: monthlyData[monthKey]?.completed || 0,
      })
    }

    return last6Months
  } catch (error) {
    console.error('Error calculating inspection trends:', error)
    return []
  }
}

async function getRatingDistribution(inspections: any[]) {
  try {
    const inspectionsWithRatings = inspections.filter((i) => i.overallRating !== null)

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
    console.error('Error calculating rating distribution:', error)
    return []
  }
}

function getInspectionStatusCounts(inspections: any[]) {
  try {
    const completed = inspections.filter((i) => i.status === 'COMPLETED' || i.status === 'APPROVED').length
    const inProgress = inspections.filter((i) => i.status === 'IN_PROGRESS').length
    const rejected = inspections.filter((i) => i.status === 'REJECTED').length

    return { completed, inProgress, pending: rejected }
  } catch (error) {
    console.error('Error calculating inspection status counts:', error)
    return { completed: 0, inProgress: 0, pending: 0 }
  }
}

function getInspectorActivity(inspections: any[]) {
  try {
    const inspectorMap: Record<
      string,
      { name: string; completed: number; ratings: number[] }
    > = {}

    inspections.forEach((inspection) => {
      if (inspection.status === 'COMPLETED' || inspection.status === 'APPROVED') {
        const inspectorId = inspection.inspectorId
        if (!inspectorMap[inspectorId]) {
          inspectorMap[inspectorId] = {
            name: inspection.inspector?.name || 'Unknown',
            completed: 0,
            ratings: [],
          }
        }
        inspectorMap[inspectorId].completed++
        if (inspection.overallRating) {
          inspectorMap[inspectorId].ratings.push(inspection.overallRating)
        }
      }
    })

    return Object.values(inspectorMap)
      .map((inspector) => {
        const avgRating =
          inspector.ratings.length > 0
            ? inspector.ratings.reduce((a, b) => a + b, 0) / inspector.ratings.length
            : 0
        return {
          inspector: inspector.name,
          completed: inspector.completed,
          avgRating,
        }
      })
      .sort((a, b) => b.completed - a.completed)
  } catch (error) {
    console.error('Error calculating inspector activity:', error)
    return []
  }
}

async function getCategoryRatings(inspections: any[], filters: SearchParams) {
  try {
    // Get category-level ratings from InspectionResults
    const categoryMap: Record<string, { total: number; count: number }> = {}

    inspections.forEach((inspection) => {
      inspection.inspectionResults.forEach((result: any) => {
        if (result.category && result.categoryRating !== null) {
          // Apply category filter if specified
          if (filters.categories) {
            const categoryFilter = filters.categories.split(',').filter(Boolean)
            if (!categoryFilter.includes(result.category.toLowerCase())) {
              return
            }
          }

          if (!categoryMap[result.category]) {
            categoryMap[result.category] = { total: 0, count: 0 }
          }
          categoryMap[result.category].total += result.categoryRating
          categoryMap[result.category].count += 1
        }
      })
    })

    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      rating: data.count > 0 ? data.total / data.count : 0,
    }))
  } catch (error) {
    console.error('Error calculating category ratings:', error)
    return []
  }
}

function getGeographicData(inspections: any[]) {
  try {
    const hotelMap: Record<
      string,
      {
        id: string
        name: string
        city: string
        country: string
        inspectionCount: number
        ratings: number[]
      }
    > = {}

    inspections.forEach((inspection) => {
      if (inspection.hotel) {
        const hotelId = inspection.hotel.id
        if (!hotelMap[hotelId]) {
          hotelMap[hotelId] = {
            id: inspection.hotel.id,
            name: inspection.hotel.name,
            city: inspection.hotel.city,
            country: inspection.hotel.country,
            inspectionCount: 0,
            ratings: [],
          }
        }
        hotelMap[hotelId].inspectionCount++
        if (inspection.overallRating) {
          hotelMap[hotelId].ratings.push(inspection.overallRating)
        }
      }
    })

    return Object.values(hotelMap).map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      inspectionCount: hotel.inspectionCount,
      avgRating:
        hotel.ratings.length > 0 ? hotel.ratings.reduce((a, b) => a + b, 0) / hotel.ratings.length : 0,
    }))
  } catch (error) {
    console.error('Error calculating geographic data:', error)
    return []
  }
}

async function getFilterOptions() {
  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  const inspectors = await prisma.user.findMany({
    where: { role: 'INSPECTOR' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return {
    hotels: hotels.map((h) => ({ id: h.id, label: h.name })),
    inspectors: inspectors.map((i) => ({ id: i.id, label: i.name || 'Unknown' })),
  }
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Get filter options for FilterBar
  const filterOptions = await getFilterOptions()

  // Get filtered inspections based on URL params
  const inspections = await getFilteredInspections(searchParams)

  // Calculate analytics from filtered data
  const trendsData = await getInspectionTrends(inspections)
  const ratingData = await getRatingDistribution(inspections)
  const statusCounts = getInspectionStatusCounts(inspections)
  const inspectorActivity = getInspectorActivity(inspections)
  const categoryRatings = await getCategoryRatings(inspections, searchParams)
  const geographicData = getGeographicData(inspections)

  // Build active filters summary for display
  const activeFilters: Record<string, any> = {}
  if (searchParams.hotel) {
    const hotel = filterOptions.hotels.find((h) => h.id === searchParams.hotel)
    if (hotel) activeFilters.Hotel = hotel.label
  }
  if (searchParams.inspector) {
    const inspector = filterOptions.inspectors.find((i) => i.id === searchParams.inspector)
    if (inspector) activeFilters.Inspector = inspector.label
  }
  if (searchParams.dateFrom) activeFilters['Date From'] = searchParams.dateFrom
  if (searchParams.dateTo) activeFilters['Date To'] = searchParams.dateTo
  if (searchParams.categories) {
    activeFilters.Categories = searchParams.categories.split(',').join(', ')
  }
  if (searchParams.statuses) {
    activeFilters.Statuses = searchParams.statuses.split(',').join(', ')
  }

  // Prepare data for inspections table
  const inspectionsTableData = inspections.map((inspection) => {
    const categoryRatings = inspection.inspectionResults.reduce(
      (acc: Record<string, number>, result: any) => {
        if (result.category && result.categoryRating !== null) {
          acc[result.category] = result.categoryRating
        }
        return acc
      },
      {}
    )

    return {
      id: inspection.id,
      date: inspection.inspectionDate,
      hotel: inspection.hotel?.name || 'Unknown',
      hotelId: inspection.hotel?.id,
      inspector: inspection.inspector?.name || 'Unknown',
      rating: inspection.overallRating || 0,
      cleanliness: categoryRatings.Cleanliness || 0,
      safety: categoryRatings.Safety || 0,
      amenities: categoryRatings.Amenities || 0,
      status: inspection.status,
    }
  })

  // Prepare data for hotel performance table
  const hotelPerformanceData = Object.values(
    inspections.reduce((acc: Record<string, any>, inspection) => {
      if (!inspection.hotel) return acc

      const hotelId = inspection.hotel.id
      if (!acc[hotelId]) {
        acc[hotelId] = {
          id: hotelId,
          name: inspection.hotel.name,
          city: inspection.hotel.city,
          country: inspection.hotel.country,
          inspections: [],
          categoryRatings: { Cleanliness: [], Safety: [], Amenities: [] },
          hasPendingIssues: false,
        }
      }

      acc[hotelId].inspections.push({
        rating: inspection.overallRating || 0,
        date: inspection.inspectionDate,
        status: inspection.status,
      })

      // Collect category ratings
      inspection.inspectionResults.forEach((result: any) => {
        if (result.category && result.categoryRating !== null) {
          if (acc[hotelId].categoryRatings[result.category]) {
            acc[hotelId].categoryRatings[result.category].push(result.categoryRating)
          }
        }
      })

      // Check for pending issues
      if (inspection.status === 'REJECTED' || inspection.status === 'IN_PROGRESS') {
        acc[hotelId].hasPendingIssues = true
      }

      return acc
    }, {})
  ).map((hotel: any) => {
    const completedInspections = hotel.inspections.filter(
      (i: any) => i.rating > 0
    )
    const avgRating =
      completedInspections.length > 0
        ? completedInspections.reduce((sum: number, i: any) => sum + i.rating, 0) /
          completedInspections.length
        : 0

    // Calculate category averages
    const avgCleanliness =
      hotel.categoryRatings.Cleanliness.length > 0
        ? hotel.categoryRatings.Cleanliness.reduce((a: number, b: number) => a + b, 0) /
          hotel.categoryRatings.Cleanliness.length
        : 0
    const avgSafety =
      hotel.categoryRatings.Safety.length > 0
        ? hotel.categoryRatings.Safety.reduce((a: number, b: number) => a + b, 0) /
          hotel.categoryRatings.Safety.length
        : 0
    const avgAmenities =
      hotel.categoryRatings.Amenities.length > 0
        ? hotel.categoryRatings.Amenities.reduce((a: number, b: number) => a + b, 0) /
          hotel.categoryRatings.Amenities.length
        : 0

    // Calculate trend
    const sortedInspections = [...completedInspections].sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    let trend: 'improving' | 'stable' | 'declining' = 'stable'
    if (sortedInspections.length >= 3) {
      const recent = sortedInspections.slice(-3)
      const previous = sortedInspections.slice(-6, -3)
      if (previous.length > 0) {
        const recentAvg = recent.reduce((sum: number, i: any) => sum + i.rating, 0) / recent.length
        const previousAvg =
          previous.reduce((sum: number, i: any) => sum + i.rating, 0) / previous.length
        const diff = recentAvg - previousAvg
        if (diff > 0.3) trend = 'improving'
        else if (diff < -0.3) trend = 'declining'
      }
    }

    // Determine if at risk
    const isAtRisk = hotel.hasPendingIssues || avgRating < 3.0 || trend === 'declining'

    // Find last inspection date
    const lastInspectionDate =
      hotel.inspections.length > 0
        ? new Date(
            Math.max(...hotel.inspections.map((i: any) => new Date(i.date).getTime()))
          )
        : null

    return {
      id: hotel.id,
      name: hotel.name,
      location: `${hotel.city}, ${hotel.country}`,
      totalInspections: hotel.inspections.length,
      avgRating,
      cleanliness: avgCleanliness,
      safety: avgSafety,
      amenities: avgAmenities,
      lastInspection: lastInspectionDate,
      trend,
      isAtRisk,
    }
  })

  // Sort: At-risk first, then by average rating descending
  hotelPerformanceData.sort((a, b) => {
    if (a.isAtRisk && !b.isAtRisk) return -1
    if (!a.isAtRisk && b.isAtRisk) return 1
    return b.avgRating - a.avgRating
  })

  // Prepare data for inspector leaderboard
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const inspectorLeaderboardData = Object.values(
    inspections.reduce((acc: Record<string, any>, inspection) => {
      if (!inspection.inspector) return acc

      const inspectorId = inspection.inspector.id
      if (!acc[inspectorId]) {
        acc[inspectorId] = {
          id: inspectorId,
          name: inspection.inspector.name || 'Unknown',
          total: 0,
          completed: 0,
          completedThisMonth: 0,
          ratings: [],
          categoryRatings: { Cleanliness: [], Safety: [], Amenities: [] },
        }
      }

      acc[inspectorId].total++

      if (inspection.status === 'COMPLETED' || inspection.status === 'APPROVED') {
        acc[inspectorId].completed++

        if (inspection.inspectionDate >= thisMonthStart) {
          acc[inspectorId].completedThisMonth++
        }

        if (inspection.overallRating) {
          acc[inspectorId].ratings.push(inspection.overallRating)
        }

        // Collect category ratings
        inspection.inspectionResults.forEach((result: any) => {
          if (result.category && result.categoryRating !== null) {
            if (acc[inspectorId].categoryRatings[result.category]) {
              acc[inspectorId].categoryRatings[result.category].push(result.categoryRating)
            }
          }
        })
      }

      return acc
    }, {})
  )
    .map((inspector: any) => {
      const avgRating =
        inspector.ratings.length > 0
          ? inspector.ratings.reduce((a: number, b: number) => a + b, 0) / inspector.ratings.length
          : 0

      const avgCleanliness =
        inspector.categoryRatings.Cleanliness.length > 0
          ? inspector.categoryRatings.Cleanliness.reduce((a: number, b: number) => a + b, 0) /
            inspector.categoryRatings.Cleanliness.length
          : 0

      const avgSafety =
        inspector.categoryRatings.Safety.length > 0
          ? inspector.categoryRatings.Safety.reduce((a: number, b: number) => a + b, 0) /
            inspector.categoryRatings.Safety.length
          : 0

      const avgAmenities =
        inspector.categoryRatings.Amenities.length > 0
          ? inspector.categoryRatings.Amenities.reduce((a: number, b: number) => a + b, 0) /
            inspector.categoryRatings.Amenities.length
          : 0

      const completionRate = inspector.total > 0 ? (inspector.completed / inspector.total) * 100 : 0

      return {
        id: inspector.id,
        name: inspector.name,
        total: inspector.total,
        completed: inspector.completed,
        completedThisMonth: inspector.completedThisMonth,
        avgRating,
        cleanliness: avgCleanliness,
        safety: avgSafety,
        amenities: avgAmenities,
        completionRate,
      }
    })
    .sort((a, b) => b.completed - a.completed) // Sort by completed inspections

  return (
    <ReportsClientWrapper
      hotels={filterOptions.hotels}
      inspectors={filterOptions.inspectors}
      totalInspections={inspections.length}
      activeFilters={activeFilters}
      inspectionsData={inspectionsTableData}
      hotelPerformanceData={hotelPerformanceData}
      inspectorLeaderboardData={inspectorLeaderboardData}
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Inspection Status Overview */}
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
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {statusCounts.completed}
                </p>
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
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {statusCounts.inProgress}
                </p>
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
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                  {statusCounts.pending}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Rejected inspections</p>
              </div>
            </div>
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

        {/* Geographic View */}
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 sm:mb-2.5">
              Geographic View
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Hotel locations and inspection activity
            </p>
          </div>
          <GeographicMap hotels={geographicData} />
        </div>
      </div>
    </ReportsClientWrapper>
  )
}

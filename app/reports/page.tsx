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
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { TrendingUp, Star, Users, BarChart3, MapPin } from 'lucide-react'

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
        {/* Breadcrumb navigation */}
        <Breadcrumb items={[{ label: 'Reports' }]} />

        {/* Page Header - Glass UI */}
        <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-7 border-2 border-white/20 dark:border-neutral-700/50 shadow-lg">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-accent-500 to-teal-500"></div>

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-accent-500/5 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-1 sm:mb-2">
                Reports & Analytics
              </h1>
              <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">
                Comprehensive insights and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 px-4 py-3 bg-teal-50/50 dark:bg-teal-900/20 rounded-xl border border-teal-200/50 dark:border-teal-800/30">
                <p className="text-xs sm:text-sm font-medium text-teal-700 dark:text-teal-300">Total Records</p>
                <p className="text-2xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400">{inspections.length}</p>
              </div>
            </div>
          </div>
        </div>

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
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                  Total completed inspections
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-emerald-200/30 dark:bg-emerald-900/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (statusCounts.completed /
                          (statusCounts.completed + statusCounts.inProgress + statusCounts.pending)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 text-right">
                  {Math.round(
                    (statusCounts.completed /
                      (statusCounts.completed + statusCounts.inProgress + statusCounts.pending)) *
                      100
                  )}
                  % of total
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
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                  Currently in progress
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-amber-200/30 dark:bg-amber-900/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-amber-500 transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (statusCounts.inProgress /
                          (statusCounts.completed + statusCounts.inProgress + statusCounts.pending)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 text-right">
                  {Math.round(
                    (statusCounts.inProgress /
                      (statusCounts.completed + statusCounts.inProgress + statusCounts.pending)) *
                      100
                  )}
                  % of total
                </p>
              </div>

              {/* Rejected Card */}
              <div className="bg-primary-50 dark:bg-primary-800/30 rounded-xl p-4 border border-primary-200 dark:border-primary-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300">Rejected</h3>
                </div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {statusCounts.pending}
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 mb-3">Rejected inspections</p>
                {/* Progress Bar */}
                <div className="w-full bg-primary-200/30 dark:bg-primary-700/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-500 transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (statusCounts.pending /
                          (statusCounts.completed + statusCounts.inProgress + statusCounts.pending)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 text-right">
                  {Math.round(
                    (statusCounts.pending /
                      (statusCounts.completed + statusCounts.inProgress + statusCounts.pending)) *
                      100
                  )}
                  % of total
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Inspection Trends Chart */}
          <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative mb-5 sm:mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                  Inspection Trends
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Last 6 months activity
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <div className="relative">
              <InspectionTrendsChart data={trendsData} />
            </div>
          </div>

          {/* Rating Distribution Chart */}
          <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative mb-5 sm:mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                  Rating Distribution
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  All completed inspections
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="relative">
              <RatingDistributionChart data={ratingData} />
            </div>
          </div>

          {/* Inspector Activity Chart */}
          <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-violet-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative mb-5 sm:mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                  Inspector Activity
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Completed inspections and ratings
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
            </div>
            <div className="relative">
              <InspectorActivityChart data={inspectorActivity} />
            </div>
          </div>

          {/* Category Ratings Chart */}
          <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative mb-5 sm:mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                  Category Ratings
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Average ratings by category
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <div className="relative">
              <CategoryRatingsChart data={categoryRatings} />
            </div>
          </div>
        </div>

        {/* Geographic View */}
        <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative mb-5 sm:mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1 sm:mb-2">
                Geographic View
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Hotel locations and inspection activity
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
          <div className="relative">
            <GeographicMap hotels={geographicData} />
          </div>
        </div>
      </div>
    </ReportsClientWrapper>
  )
}

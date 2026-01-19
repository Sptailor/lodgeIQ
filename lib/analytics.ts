/**
 * Analytics Utility Functions
 *
 * Data transformation and analytics calculations for Reports page
 */

import { Inspection, Hotel, User } from '@prisma/client'

// Types for analytics data
export interface MonthlyTrend {
  month: string
  count: number
  change: number // % change from previous month
}

export interface HotelPerformance {
  hotel: Hotel
  totalInspections: number
  avgRating: number
  categoryScores: {
    cleanliness: number
    safety: number
    amenities: number
  }
  lastInspectionDate: Date | null
  trend: 'improving' | 'stable' | 'declining'
  isTopPerformer: boolean
  isAtRisk: boolean
}

export interface InspectorStats {
  inspector: User
  totalInspections: number
  completedThisMonth: number
  avgRating: number
  categoryBreakdown: {
    cleanliness: number
    safety: number
    amenities: number
  }
  completionRate: number
}

export interface CategoryBreakdown {
  category: string
  avgRating: number
  count: number
}

/**
 * Calculate month-over-month trends from inspection data
 */
export function calculateMonthlyTrends(
  inspections: Array<Inspection & { createdAt?: Date; inspectionDate: Date }>
): MonthlyTrend[] {
  // Group inspections by month
  const monthlyData: Record<string, number> = {}

  inspections.forEach((inspection) => {
    const date = inspection.inspectionDate
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
  })

  // Sort by month
  const sortedMonths = Object.keys(monthlyData).sort()

  // Calculate trends
  return sortedMonths.map((month, index) => {
    const count = monthlyData[month]
    const prevCount = index > 0 ? monthlyData[sortedMonths[index - 1]] : count
    const change = prevCount > 0 ? ((count - prevCount) / prevCount) * 100 : 0

    return {
      month,
      count,
      change: Math.round(change * 10) / 10,
    }
  })
}

/**
 * Get top performing hotels sorted by average rating
 */
export function getTopPerformers(
  hotels: Array<Hotel & { inspections: Inspection[] }>,
  limit: number = 3
): Hotel[] {
  return hotels
    .map((hotel) => {
      const completedInspections = hotel.inspections.filter(
        (i) => i.status === 'COMPLETED' || i.status === 'APPROVED'
      )
      const avgRating =
        completedInspections.reduce((sum, i) => sum + (i.overallRating || 0), 0) /
        (completedInspections.length || 1)
      return { hotel, avgRating }
    })
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, limit)
    .map((item) => item.hotel)
}

/**
 * Get bottom performing hotels with lowest ratings
 */
export function getBottomPerformers(
  hotels: Array<Hotel & { inspections: Inspection[] }>,
  limit: number = 3
): Hotel[] {
  return hotels
    .map((hotel) => {
      const completedInspections = hotel.inspections.filter(
        (i) => i.status === 'COMPLETED' || i.status === 'APPROVED'
      )
      const avgRating =
        completedInspections.reduce((sum, i) => sum + (i.overallRating || 0), 0) /
        (completedInspections.length || 1)
      return { hotel, avgRating }
    })
    .filter((item) => item.avgRating > 0) // Exclude hotels with no ratings
    .sort((a, b) => a.avgRating - b.avgRating)
    .slice(0, limit)
    .map((item) => item.hotel)
}

/**
 * Identify at-risk hotels (low ratings, pending issues, or declining trends)
 */
export function getAtRiskHotels(
  hotels: Array<Hotel & { inspections: Array<Inspection & { inspectionDate: Date }> }>
): Hotel[] {
  return hotels.filter((hotel) => {
    const inspections = hotel.inspections
    if (inspections.length === 0) return false

    // Check for pending/rejected inspections
    const hasPendingIssues = inspections.some(
      (i) => i.status === 'REJECTED' || i.status === 'IN_PROGRESS'
    )

    // Check average rating
    const completedInspections = inspections.filter(
      (i) => i.status === 'COMPLETED' || i.status === 'APPROVED'
    )
    const avgRating =
      completedInspections.reduce((sum, i) => sum + (i.overallRating || 0), 0) /
      (completedInspections.length || 1)

    // Check for declining trend
    const trend = getHotelTrend(hotel)

    return hasPendingIssues || avgRating < 3.0 || trend === 'declining'
  })
}

/**
 * Get inspector leaderboard with stats
 */
export function getInspectorLeaderboard(
  inspectors: Array<User & { inspections: Inspection[] }>
): InspectorStats[] {
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  return inspectors
    .map((inspector) => {
      const inspections = inspector.inspections
      const completed = inspections.filter(
        (i) => i.status === 'COMPLETED' || i.status === 'APPROVED'
      )
      const completedThisMonth = inspections.filter(
        (i) =>
          (i.status === 'COMPLETED' || i.status === 'APPROVED') &&
          i.inspectionDate >= thisMonthStart
      )

      const avgRating =
        completed.reduce((sum, i) => sum + (i.overallRating || 0), 0) / (completed.length || 1)

      const completionRate =
        inspections.length > 0 ? (completed.length / inspections.length) * 100 : 0

      return {
        inspector,
        totalInspections: inspections.length,
        completedThisMonth: completedThisMonth.length,
        avgRating: Math.round(avgRating * 10) / 10,
        categoryBreakdown: {
          cleanliness: 0,
          safety: 0,
          amenities: 0,
        },
        completionRate: Math.round(completionRate * 10) / 10,
      }
    })
    .sort((a, b) => b.totalInspections - a.totalInspections)
}

/**
 * Get category breakdown from inspection results
 */
export function getCategoryBreakdown(
  inspectionResults: Array<{
    category: string | null
    categoryRating: number | null
  }>
): CategoryBreakdown[] {
  const categories: Record<string, { total: number; count: number }> = {}

  inspectionResults.forEach((result) => {
    if (result.category && result.categoryRating !== null) {
      if (!categories[result.category]) {
        categories[result.category] = { total: 0, count: 0 }
      }
      categories[result.category].total += result.categoryRating
      categories[result.category].count += 1
    }
  })

  return Object.entries(categories).map(([category, data]) => ({
    category,
    avgRating: Math.round((data.total / data.count) * 10) / 10,
    count: data.count,
  }))
}

/**
 * Determine if hotel trend is improving, stable, or declining
 */
export function getHotelTrend(
  hotel: Hotel & { inspections: Array<Inspection & { inspectionDate: Date }> }
): 'improving' | 'stable' | 'declining' {
  const completed = hotel.inspections
    .filter((i) => i.status === 'COMPLETED' || i.status === 'APPROVED')
    .sort((a, b) => a.inspectionDate.getTime() - b.inspectionDate.getTime())

  if (completed.length < 3) return 'stable'

  // Compare recent 3 inspections vs previous 3
  const recent = completed.slice(-3)
  const previous = completed.slice(-6, -3)

  if (previous.length === 0) return 'stable'

  const recentAvg =
    recent.reduce((sum, i) => sum + (i.overallRating || 0), 0) / recent.length
  const previousAvg =
    previous.reduce((sum, i) => sum + (i.overallRating || 0), 0) / previous.length

  const diff = recentAvg - previousAvg

  if (diff > 0.3) return 'improving'
  if (diff < -0.3) return 'declining'
  return 'stable'
}

/**
 * Get detailed hotel trends with all metrics
 */
export function getHotelTrends(
  hotels: Array<Hotel & { inspections: Array<Inspection & { inspectionDate: Date }> }>
): Array<{ hotel: Hotel; trend: 'improving' | 'stable' | 'declining' }> {
  return hotels.map((hotel) => ({
    hotel,
    trend: getHotelTrend(hotel),
  }))
}

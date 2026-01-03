/**
 * Reports Page
 *
 * Analytics and reporting dashboard for inspection data
 * Future: Charts, trends, and data exports
 */

import { prisma } from '@/lib/prisma'
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react'
import { KPICard } from '@/components/ui/kpi-card'

/**
 * Fetch report metrics
 */
async function getReportMetrics() {
  try {
    const totalInspections = await prisma.inspection.count()
    const completedInspections = await prisma.inspection.count({
      where: {
        status: {
          in: ['COMPLETED', 'APPROVED'],
        },
      },
    })

    const totalHotels = await prisma.hotel.count()

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
      totalInspections,
      completedInspections,
      totalHotels,
      recentInspections,
      avgRating,
    }
  } catch (error) {
    console.error('Error fetching report metrics:', error)
    return {
      totalInspections: 0,
      completedInspections: 0,
      totalHotels: 0,
      recentInspections: 0,
      avgRating: 0,
    }
  }
}

export default async function ReportsPage() {
  const metrics = await getReportMetrics()

  const completionRate =
    metrics.totalInspections > 0
      ? Math.round((metrics.completedInspections / metrics.totalInspections) * 100)
      : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-tertiary-600 dark:from-primary-700 dark:to-tertiary-700 rounded-2xl p-8 shadow-soft-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                Reports & Analytics
              </h1>
              <p className="text-primary-100 dark:text-primary-200 text-lg">
                Insights and trends from your inspection data
              </p>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
          Overview Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Hotels"
            value={metrics.totalHotels}
            icon="building"
            variant="primary"
            subtitle="Properties managed"
          />
          <KPICard
            title="Total Inspections"
            value={metrics.totalInspections}
            icon="clipboard"
            variant="default"
            subtitle={`${metrics.recentInspections} in last 30 days`}
          />
          <KPICard
            title="Completion Rate"
            value={`${completionRate}%`}
            icon="check-circle"
            variant="success"
            subtitle={`${metrics.completedInspections} completed`}
          />
          <KPICard
            title="Avg Rating"
            value={metrics.avgRating > 0 ? metrics.avgRating.toFixed(1) : 'N/A'}
            icon="trending-up"
            variant={
              metrics.avgRating >= 4 ? 'success' : metrics.avgRating >= 3 ? 'warning' : 'danger'
            }
            subtitle={metrics.avgRating > 0 ? 'Out of 5.0 stars' : 'No ratings yet'}
          />
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-soft">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-950/20 rounded-2xl">
            <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Advanced Analytics Coming Soon
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We are building powerful analytics features including trend charts, comparative
              analysis, and custom reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
              <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                Time-based Trends
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Track performance over time with interactive charts
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
              <Download className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                Data Export
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Export reports to PDF, Excel, and CSV formats
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

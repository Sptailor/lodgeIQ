/**
 * Reports Page
 *
 * Analytics and reporting dashboard for inspection data
 * Future: Charts, trends, and data exports
 */

import { prisma } from '@/lib/prisma'
import { TrendingUp, Calendar, Download } from 'lucide-react'
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-neutral-900/90 dark:via-neutral-900/80 dark:to-neutral-900/90 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-950/50">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <h1 className="text-3xl font-black bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent mb-2">
            Reports & Analytics
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
            Insights and trends from your inspection data
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-6">
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
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-50 dark:bg-accent-950/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              Advanced Analytics Coming Soon
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              We are building powerful analytics features including trend charts, comparative
              analysis, and custom reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <Calendar className="w-4 h-4 text-accent-600 dark:text-accent-400 mb-2" />
              <h4 className="font-medium text-neutral-900 dark:text-neutral-50 mb-1 text-sm">
                Time-based Trends
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Track performance over time with interactive charts
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <Download className="w-4 h-4 text-accent-600 dark:text-accent-400 mb-2" />
              <h4 className="font-medium text-neutral-900 dark:text-neutral-50 mb-1 text-sm">
                Data Export
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Export reports to PDF, Excel, and CSV formats
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

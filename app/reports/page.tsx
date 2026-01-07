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
      <div className="relative bg-gradient-to-br from-white to-primary-50/30 dark:from-neutral-900 dark:to-primary-950/10 border border-primary-100 dark:border-neutral-800 rounded-xl p-8 shadow-sm overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/20 dark:bg-primary-900/5 rounded-full blur-3xl -z-0" />

        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-3 shadow-md">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                Reports & Analytics
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Insights and trends from your inspection data
              </p>
            </div>
          </div>
        </div>
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
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-50 dark:bg-accent-950/20 rounded-lg">
            <TrendingUp className="w-7 h-7 text-accent-600 dark:text-accent-400" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Advanced Analytics Coming Soon
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We are building powerful analytics features including trend charts, comparative
              analysis, and custom reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <Calendar className="w-5 h-5 text-accent-600 dark:text-accent-400 mb-2" />
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1 text-sm">
                Time-based Trends
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Track performance over time with interactive charts
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <Download className="w-5 h-5 text-accent-600 dark:text-accent-400 mb-2" />
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1 text-sm">
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

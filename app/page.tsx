/**
 * Dashboard - High-level summary metrics and recent activity
 */

import { prisma } from '@/lib/prisma'
import { KPICard } from '@/components/ui/kpi-card'
import { DashboardAlerts } from '@/components/DashboardAlerts'
import Link from 'next/link'

async function getDashboardMetrics() {
  try {
    const totalHotels = await prisma.hotel.count()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    // Recent inspections (last 30 days)
    const recentInspections = await prisma.inspection.count({
      where: {
        inspectionDate: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Previous period inspections (30-60 days ago)
    const previousInspections = await prisma.inspection.count({
      where: {
        inspectionDate: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    })

    const completedInspections = await prisma.inspection.count({
      where: {
        status: {
          in: ['COMPLETED', 'APPROVED'],
        },
      },
    })

    // Previous completed inspections for trend
    const previousCompleted = await prisma.inspection.count({
      where: {
        status: {
          in: ['COMPLETED', 'APPROVED'],
        },
        inspectionDate: {
          lt: thirtyDaysAgo,
        },
      },
    })

    const pendingInspections = await prisma.inspection.count({
      where: {
        status: {
          not: {
            in: ['COMPLETED', 'APPROVED'],
          },
        },
      },
    })

    // Recent ratings (last 30 days)
    const recentRatings = await prisma.inspection.findMany({
      where: {
        overallRating: {
          not: null,
        },
        inspectionDate: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        overallRating: true,
      },
    })

    // Previous ratings (30-60 days ago)
    const previousRatings = await prisma.inspection.findMany({
      where: {
        overallRating: {
          not: null,
        },
        inspectionDate: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
      select: {
        overallRating: true,
      },
    })

    const avgRating =
      recentRatings.length > 0
        ? recentRatings.reduce((sum, i) => sum + (i.overallRating || 0), 0) / recentRatings.length
        : 0

    const previousAvgRating =
      previousRatings.length > 0
        ? previousRatings.reduce((sum, i) => sum + (i.overallRating || 0), 0) / previousRatings.length
        : 0

    // Calculate trends
    const inspectionsTrend =
      previousInspections > 0 ? ((recentInspections - previousInspections) / previousInspections) * 100 : 0

    const completedTrend =
      previousCompleted > 0 ? ((completedInspections - previousCompleted) / previousCompleted) * 100 : 0

    const ratingTrend = previousAvgRating > 0 ? ((avgRating - previousAvgRating) / previousAvgRating) * 100 : 0

    return {
      totalHotels,
      recentInspections,
      completedInspections,
      pendingInspections,
      avgRating,
      inspectionsTrend,
      completedTrend,
      ratingTrend,
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return {
      totalHotels: 0,
      recentInspections: 0,
      completedInspections: 0,
      pendingInspections: 0,
      avgRating: 0,
      inspectionsTrend: 0,
      completedTrend: 0,
      ratingTrend: 0,
    }
  }
}

async function getRecentActivity() {
  try {
    const recentInspections = await prisma.inspection.findMany({
      take: 5,
      orderBy: {
        inspectionDate: 'desc',
      },
      include: {
        hotel: {
          select: {
            name: true,
          },
        },
      },
    })

    return recentInspections
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

async function getAlerts() {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Pending inspections
    const pendingInspections = await prisma.inspection.count({
      where: {
        status: {
          in: ['IN_PROGRESS', 'REJECTED'],
        },
      },
    })

    // Low ratings in last 7 days
    const lowRatings = await prisma.inspection.count({
      where: {
        inspectionDate: {
          gte: sevenDaysAgo,
        },
        overallRating: {
          lt: 3.0,
        },
      },
    })

    // Hotels without recent inspections (no inspection in last 30 days)
    const allHotels = await prisma.hotel.count()
    const hotelsWithRecentInspections = await prisma.hotel.count({
      where: {
        inspections: {
          some: {
            inspectionDate: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
    })
    const hotelsWithoutRecentInspections = allHotels - hotelsWithRecentInspections

    return {
      pendingInspections,
      lowRatings,
      hotelsWithoutRecentInspections,
    }
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return {
      pendingInspections: 0,
      lowRatings: 0,
      hotelsWithoutRecentInspections: 0,
    }
  }
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics()
  const alerts = await getAlerts()
  const recentActivity = await getRecentActivity()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Header - Glass UI */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-7 border-2 border-white/20 dark:border-neutral-700/50 shadow-lg">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-teal-500"></div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-teal-500/5 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-1 sm:mb-2">
              Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-base">
              High-level overview of your operations
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-200 dark:border-accent-800/50">
            <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></div>
            <span className="text-sm font-medium text-accent-700 dark:text-accent-300">Live Data</span>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Hotels"
          value={metrics.totalHotels}
          icon="building"
          variant="primary"
          subtitle="Properties managed"
          href="/hotels"
        />
        <KPICard
          title="Inspections"
          value={metrics.recentInspections}
          icon="clipboard"
          variant="default"
          subtitle="Last 30 days"
          href="/inspections"
          trend={{
            value: Number(Math.abs(metrics.inspectionsTrend).toFixed(1)),
            label: 'vs previous period',
            direction: metrics.inspectionsTrend > 0 ? 'up' : metrics.inspectionsTrend < 0 ? 'down' : 'neutral',
          }}
        />
        <KPICard
          title="Completed"
          value={metrics.completedInspections}
          icon="check-circle"
          variant="success"
          subtitle="Total completed"
          trend={{
            value: Number(Math.abs(metrics.completedTrend).toFixed(1)),
            label: 'vs previous period',
            direction: metrics.completedTrend > 0 ? 'up' : metrics.completedTrend < 0 ? 'down' : 'neutral',
          }}
        />
        <KPICard
          title="Avg Rating"
          value={metrics.avgRating > 0 ? metrics.avgRating.toFixed(1) : 'N/A'}
          icon="trending-up"
          variant={metrics.avgRating >= 4 ? 'success' : metrics.avgRating >= 3 ? 'warning' : 'danger'}
          subtitle="Overall rating"
          trend={
            metrics.avgRating > 0
              ? {
                  value: Number(Math.abs(metrics.ratingTrend).toFixed(1)),
                  label: 'vs previous period',
                  direction: metrics.ratingTrend > 0 ? 'up' : metrics.ratingTrend < 0 ? 'down' : 'neutral',
                }
              : undefined
          }
        />
      </div>

      {/* Alerts & Notifications */}
      <DashboardAlerts alerts={alerts} />

      {/* Recent Activity Feed */}
      <div className="bg-white dark:bg-primary-800/50 border border-primary-200 dark:border-primary-700 rounded-xl p-5 sm:p-7 shadow-sm">
        <div className="mb-5 sm:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-primary-900 dark:text-white mb-2">
              Recent Activity
            </h2>
            <p className="text-xs sm:text-sm text-primary-500 dark:text-primary-400">
              Latest inspection activity across all properties
            </p>
          </div>
          <Link
            href="/reports"
            className="text-sm font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-primary-400 text-sm">No recent activity</p>
          ) : (
            recentActivity.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-4 rounded-lg bg-primary-50 dark:bg-primary-800 border border-primary-200 dark:border-primary-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-900 dark:text-white">
                    {inspection.hotel.name}
                  </h3>
                  <p className="text-sm text-primary-500 dark:text-primary-400">
                    {new Date(inspection.inspectionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {inspection.overallRating && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-primary-900 dark:text-white">
                        {inspection.overallRating.toFixed(1)}
                      </span>
                      <span className="text-amber-500">★</span>
                    </div>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400'
                        : inspection.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        : 'bg-primary-100 text-primary-700 dark:bg-primary-700 dark:text-primary-300'
                    }`}
                  >
                    {inspection.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

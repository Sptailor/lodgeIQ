/**
 * Dashboard - High-level summary metrics and recent activity
 */

import { prisma } from '@/lib/prisma'
import { KPICard } from '@/components/ui/kpi-card'
import { DashboardAlerts } from '@/components/DashboardAlerts'
import { StaggerContainer, StaggerItem, ScrollReveal } from '@/components/ui/stagger-animation'
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
      {/* Hero Header - Clean Glass UI */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-teal-500"></div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/3 via-transparent to-teal-500/3 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-1 sm:mb-2">
              Dashboard
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              High-level overview of your operations
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 rounded-full border border-teal-200/50 dark:border-teal-700/30">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            <span className="text-xs font-medium text-teal-700 dark:text-teal-400">Live</span>
          </div>
        </div>
      </div>

      {/* Summary Metrics with staggered animation */}
      <div>
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4 uppercase tracking-wide">Key Metrics</h2>
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StaggerItem>
          <KPICard
            title="Total Hotels"
            value={metrics.totalHotels}
            icon="building"
            variant="primary"
            subtitle="Properties managed"
            href="/hotels"
          />
        </StaggerItem>
        <StaggerItem>
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
        </StaggerItem>
        <StaggerItem>
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
        </StaggerItem>
        <StaggerItem>
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
        </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Alerts & Notifications */}
      <DashboardAlerts alerts={alerts} />

      {/* Recent Activity Feed - Glass UI with scroll reveal */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="relative overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-sm">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-teal-500"></div>

          <div className="mb-5 sm:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              Recent Activity
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Latest inspection activity across all properties
            </p>
          </div>
          <Link
            href="/reports"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-all duration-200"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">No recent activity</p>
            </div>
          ) : (
            recentActivity.map((inspection) => (
              <div
                key={inspection.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200/30 dark:border-neutral-700/30 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm hover:border-neutral-200 dark:hover:border-neutral-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="hidden sm:flex w-10 h-10 rounded-lg bg-accent-50 dark:bg-accent-900/30 items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-neutral-900 dark:text-white truncate group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                      {inspection.hotel.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {new Date(inspection.inspectionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {inspection.overallRating && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <span className="text-amber-500">★</span>
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                        {inspection.overallRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400'
                        : inspection.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {inspection.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}

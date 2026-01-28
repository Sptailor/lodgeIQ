'use client'

/**
 * DashboardAlerts Component
 *
 * Displays dismissible alerts with slide-in animation
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Clock, Calendar, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface AlertsData {
  pendingInspections: number
  lowRatings: number
  hotelsWithoutRecentInspections: number
}

interface DashboardAlertsProps {
  alerts: AlertsData
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId))
  }

  const alertItems = [
    {
      id: 'pending',
      show: alerts.pendingInspections > 0,
      icon: Clock,
      title: `${alerts.pendingInspections} Pending Inspections`,
      description: 'Inspections require attention to complete',
      color: 'amber',
      link: '/reports?statuses=IN_PROGRESS,REJECTED',
    },
    {
      id: 'low-ratings',
      show: alerts.lowRatings > 0,
      icon: AlertTriangle,
      title: `${alerts.lowRatings} Low Ratings`,
      description: 'Properties with ratings below 3.0 in last 7 days',
      color: 'red',
      link: '/reports?dateFrom=' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: 'no-recent',
      show: alerts.hotelsWithoutRecentInspections > 0,
      icon: Calendar,
      title: `${alerts.hotelsWithoutRecentInspections} Hotels Overdue`,
      description: 'No inspections in last 30 days',
      color: 'violet',
      link: '/hotels',
    },
  ].filter((alert) => alert.show && !dismissedAlerts.has(alert.id))

  if (alertItems.length === 0) {
    return null
  }

  const colorClasses = {
    amber: {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/20',
      border: 'border-amber-300/60 dark:border-amber-700/40',
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      button: 'text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200',
      shadow: 'shadow-amber-500/10 dark:shadow-amber-500/5',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-red-100/50 dark:from-red-950/40 dark:via-rose-950/30 dark:to-red-900/20',
      border: 'border-red-300/60 dark:border-red-700/40',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      button: 'text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200',
      shadow: 'shadow-red-500/10 dark:shadow-red-500/5',
    },
    violet: {
      bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100/50 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-violet-900/20',
      border: 'border-violet-300/60 dark:border-violet-700/40',
      icon: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      button: 'text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-200',
      shadow: 'shadow-violet-500/10 dark:shadow-violet-500/5',
    },
  }

  return (
    <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
      <div className="mb-5 sm:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Alerts & Notifications
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Items requiring your attention
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
        <AnimatePresence mode="popLayout">
          {alertItems.slice(0, 5).map((alert, index) => {
            const Icon = alert.icon
            const colors = colorClasses[alert.color as keyof typeof colorClasses]

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative flex items-start gap-4 p-5 rounded-xl border-2 ${colors.bg} ${colors.border} ${colors.shadow} shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
              >
                <div className={`flex-shrink-0 rounded-lg p-2.5 ${colors.iconBg} ${colors.icon} shadow-inner`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-50 mb-1.5 tracking-tight">{alert.title}</h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{alert.description}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={alert.link}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg ${colors.button} bg-white/60 dark:bg-neutral-800/60 hover:bg-white dark:hover:bg-neutral-800 border border-current/20 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm`}
                  >
                    View
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all duration-200"
                    aria-label="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

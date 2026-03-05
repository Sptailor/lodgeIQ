/**
 * Settings Page
 *
 * User preferences and application configuration
 * Future: Profile management, notification settings, team management
 */

import { getSession } from '@/lib/auth-utils'
import { User, Bell, Shield, Users } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default async function SettingsPage() {
  const session = await getSession()

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <Breadcrumb items={[{ label: 'Settings' }]} />

      {/* Page Header - Glass UI */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-7 border-2 border-white/20 dark:border-neutral-700/50 shadow-lg">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-400 via-accent-500 to-neutral-400"></div>

        <div className="relative z-10">
          <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-1 sm:mb-2">
            Settings
          </h1>
          <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      {/* User Profile Section */}
      {session?.user && (
        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-accent-50 dark:bg-accent-950/20 rounded-md p-2">
              <User className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            </div>
            <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              Profile Information
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                Name
              </label>
              <p className="text-sm text-neutral-900 dark:text-neutral-50 font-medium">
                {session.user.name || 'Not set'}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                Email
              </label>
              <p className="text-sm text-neutral-900 dark:text-neutral-50 font-medium">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Notifications */}
        <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                Notifications
              </h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Configure email and push notification preferences for inspection updates, reminders,
              and team activities.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-xs font-medium text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </span>
          </div>
        </div>

        {/* Security */}
        <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                Security & Privacy
              </h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Manage your password, two-factor authentication, and data privacy settings to keep
              your account secure.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-xs font-medium text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </span>
          </div>
        </div>

        {/* Team Management */}
        <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                Team Management
              </h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Invite team members, assign roles and permissions, and manage inspector access to
              hotels and inspections.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-xs font-medium text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
        <div className="text-center text-xs text-neutral-600 dark:text-neutral-400">
          <p className="font-medium mb-1">LodgeIQ Hotel Inspection Platform</p>
          <p>Version 1.0.0 • Built with Next.js 14</p>
        </div>
      </div>
    </div>
  )
}

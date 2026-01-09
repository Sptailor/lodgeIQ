/**
 * User Menu Component
 *
 * Professional dropdown menu for user profile actions
 * Smooth animations and hover effects
 */

'use client'

import { User, Settings, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group relative flex items-center gap-3 rounded-2xl px-3 py-2 backdrop-blur-sm bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-accent-400/50 dark:hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 overflow-hidden">
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-400/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />

        <div className="relative flex items-center gap-3">
          {/* User Avatar with pulse animation */}
          <div className="relative">
            {/* Pulsing ring around avatar */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-500 to-purple-500 animate-pulse opacity-20" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-500 to-purple-500 blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-neutral-900 group-hover:ring-accent-400 dark:group-hover:ring-accent-500 transition-all duration-300">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            {/* Animated online status indicator */}
            <div className="absolute bottom-0 right-0 flex items-center justify-center">
              <div className="absolute w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
              <div className="relative w-3 h-3 bg-emerald-500 border-2 border-white dark:border-neutral-900 rounded-full shadow-lg" />
            </div>
          </div>

          {/* User info with gradient text */}
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {user.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {user.email || 'user@example.com'}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <User className="w-4 h-4 mr-3 text-neutral-600 dark:text-neutral-400" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="w-4 h-4 mr-3 text-neutral-600 dark:text-neutral-400" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer text-danger-600 dark:text-danger-400 focus:text-danger-600 dark:focus:text-danger-400">
          <LogOut className="w-4 h-4 mr-3" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

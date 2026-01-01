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
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-500 to-tertiary-500 flex items-center justify-center shadow-soft">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            {/* Online status indicator */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white dark:border-neutral-900 rounded-full" />
          </div>

          {/* User info */}
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
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

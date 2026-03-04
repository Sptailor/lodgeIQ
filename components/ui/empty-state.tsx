'use client'

/**
 * Empty State Component
 *
 * Beautiful empty state illustrations for various scenarios
 * Provides clear messaging and optional action buttons
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from './button'
import {
  FileX,
  Search,
  Inbox,
  FolderOpen,
  Calendar,
  ClipboardList,
  Building2,
  Users,
  AlertCircle,
  Plus,
  RefreshCw,
} from 'lucide-react'

type EmptyStateVariant =
  | 'no-data'
  | 'no-results'
  | 'no-items'
  | 'empty-folder'
  | 'no-inspections'
  | 'no-hotels'
  | 'no-users'
  | 'error'
  | 'custom'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'secondary' | 'outline'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const variantConfig: Record<
  Exclude<EmptyStateVariant, 'custom'>,
  { icon: React.ReactNode; title: string; description: string }
> = {
  'no-data': {
    icon: <Inbox className="w-full h-full" />,
    title: 'No data available',
    description: 'There is no data to display at the moment.',
  },
  'no-results': {
    icon: <Search className="w-full h-full" />,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
  'no-items': {
    icon: <FileX className="w-full h-full" />,
    title: 'No items yet',
    description: 'Get started by creating your first item.',
  },
  'empty-folder': {
    icon: <FolderOpen className="w-full h-full" />,
    title: 'This folder is empty',
    description: 'Add files or documents to get started.',
  },
  'no-inspections': {
    icon: <ClipboardList className="w-full h-full" />,
    title: 'No inspections found',
    description: 'Schedule your first inspection to get started.',
  },
  'no-hotels': {
    icon: <Building2 className="w-full h-full" />,
    title: 'No hotels added',
    description: 'Add your first hotel to begin managing properties.',
  },
  'no-users': {
    icon: <Users className="w-full h-full" />,
    title: 'No team members',
    description: 'Invite team members to collaborate.',
  },
  'error': {
    icon: <AlertCircle className="w-full h-full" />,
    title: 'Something went wrong',
    description: 'We encountered an error. Please try again.',
  },
}

const sizeConfig = {
  sm: {
    container: 'py-8 px-4',
    iconWrapper: 'w-12 h-12 mb-3',
    title: 'text-base',
    description: 'text-sm',
    buttonSize: 'sm' as const,
  },
  md: {
    container: 'py-12 px-6',
    iconWrapper: 'w-16 h-16 mb-4',
    title: 'text-lg',
    description: 'text-sm',
    buttonSize: 'default' as const,
  },
  lg: {
    container: 'py-16 px-8',
    iconWrapper: 'w-20 h-20 mb-5',
    title: 'text-xl',
    description: 'text-base',
    buttonSize: 'lg' as const,
  },
}

export function EmptyState({
  variant = 'no-data',
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const config = variant === 'custom' ? null : variantConfig[variant]
  const sizeStyles = sizeConfig[size]

  const displayIcon = icon || config?.icon
  const displayTitle = title || config?.title || 'No data'
  const displayDescription = description || config?.description || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'bg-white dark:bg-neutral-900/50',
        'border border-neutral-200 dark:border-neutral-800',
        'rounded-xl',
        sizeStyles.container,
        className
      )}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'flex items-center justify-center',
          'rounded-full',
          'bg-neutral-100 dark:bg-neutral-800',
          'text-neutral-400 dark:text-neutral-500',
          'p-4',
          sizeStyles.iconWrapper
        )}
      >
        <div className="w-1/2 h-1/2">{displayIcon}</div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn(
          'font-semibold text-neutral-900 dark:text-neutral-100',
          'mb-1',
          sizeStyles.title
        )}
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className={cn(
          'text-neutral-500 dark:text-neutral-400',
          'max-w-sm',
          'mb-4',
          sizeStyles.description
        )}
      >
        {displayDescription}
      </motion.p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex items-center gap-3 mt-2"
        >
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size={sizeStyles.buttonSize}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size={sizeStyles.buttonSize}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// Quick preset components
export function NoResultsState(props: Partial<EmptyStateProps>) {
  return <EmptyState variant="no-results" {...props} />
}

export function NoInspectionsState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      variant="no-inspections"
      action={{
        label: 'Schedule Inspection',
        onClick: () => {},
        ...props.action,
      }}
      {...props}
    />
  )
}

export function NoHotelsState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      variant="no-hotels"
      action={{
        label: 'Add Hotel',
        onClick: () => {},
        ...props.action,
      }}
      {...props}
    />
  )
}

export function ErrorState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      variant="error"
      secondaryAction={{
        label: 'Try Again',
        onClick: () => window.location.reload(),
        ...props.secondaryAction,
      }}
      {...props}
    />
  )
}

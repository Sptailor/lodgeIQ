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

// Custom illustrated SVG components
function HotelIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none">
      {/* Building base */}
      <motion.rect
        x="30" y="25" width="60" height="55" rx="4"
        className="fill-accent-100 dark:fill-accent-900/30 stroke-accent-500 dark:stroke-accent-400"
        strokeWidth="2"
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* Windows row 1 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x="38" y="35" width="10" height="10" rx="1" className="fill-accent-200 dark:fill-accent-800/50" />
        <rect x="55" y="35" width="10" height="10" rx="1" className="fill-accent-200 dark:fill-accent-800/50" />
        <rect x="72" y="35" width="10" height="10" rx="1" className="fill-accent-200 dark:fill-accent-800/50" />
      </motion.g>
      {/* Windows row 2 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x="38" y="50" width="10" height="10" rx="1" className="fill-accent-200 dark:fill-accent-800/50" />
        <rect x="55" y="50" width="10" height="10" rx="1" className="fill-teal-300 dark:fill-teal-500/50" />
        <rect x="72" y="50" width="10" height="10" rx="1" className="fill-accent-200 dark:fill-accent-800/50" />
      </motion.g>
      {/* Door */}
      <motion.rect
        x="52" y="65" width="16" height="15" rx="2"
        className="fill-accent-500 dark:fill-accent-400"
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      />
      {/* Roof accent */}
      <motion.rect
        x="30" y="22" width="60" height="5" rx="2"
        className="fill-accent-500 dark:fill-accent-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2 }}
      />
      {/* Floating elements */}
      <motion.circle
        cx="15" cy="40" r="6"
        className="fill-teal-200 dark:fill-teal-800/50"
        animate={{ y: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <motion.circle
        cx="105" cy="50" r="4"
        className="fill-accent-200 dark:fill-accent-800/50"
        animate={{ y: [2, -2, 2] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />
    </svg>
  )
}

function InspectionIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none">
      {/* Clipboard */}
      <motion.rect
        x="35" y="15" width="50" height="70" rx="4"
        className="fill-white dark:fill-neutral-800 stroke-accent-500 dark:stroke-accent-400"
        strokeWidth="2"
        initial={{ rotate: -5, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      {/* Clipboard top */}
      <motion.rect
        x="45" y="10" width="30" height="12" rx="3"
        className="fill-accent-500 dark:fill-accent-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2 }}
      />
      {/* Check lines */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x="45" y="32" width="30" height="3" rx="1" className="fill-neutral-200 dark:fill-neutral-700" />
        <rect x="45" y="42" width="25" height="3" rx="1" className="fill-neutral-200 dark:fill-neutral-700" />
        <rect x="45" y="52" width="28" height="3" rx="1" className="fill-neutral-200 dark:fill-neutral-700" />
        <rect x="45" y="62" width="20" height="3" rx="1" className="fill-neutral-200 dark:fill-neutral-700" />
      </motion.g>
      {/* Checkmarks */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      >
        <circle cx="42" cy="33" r="5" className="fill-teal-500 dark:fill-teal-400" />
        <path d="M40 33l2 2 3-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
      >
        <circle cx="42" cy="43" r="5" className="fill-teal-500 dark:fill-teal-400" />
        <path d="M40 43l2 2 3-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      {/* Magnifying glass */}
      <motion.g
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <circle cx="90" cy="70" r="12" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="3" fill="none" />
        <line x1="99" y1="79" x2="108" y2="88" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
    </svg>
  )
}

function SearchIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none">
      {/* Search circle */}
      <motion.circle
        cx="50" cy="45" r="28"
        className="stroke-accent-500 dark:stroke-accent-400"
        strokeWidth="4"
        fill="none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      />
      {/* Handle */}
      <motion.line
        x1="70" y1="65" x2="95" y2="90"
        className="stroke-accent-500 dark:stroke-accent-400"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      />
      {/* Inner sparkle */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <circle cx="40" cy="38" r="3" className="fill-teal-400 dark:fill-teal-500" />
        <circle cx="55" cy="50" r="2" className="fill-accent-300 dark:fill-accent-600" />
      </motion.g>
      {/* Question marks floating */}
      <motion.text
        x="15" y="30"
        className="fill-neutral-300 dark:fill-neutral-600 text-xl font-bold"
        animate={{ y: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        ?
      </motion.text>
      <motion.text
        x="100" y="40"
        className="fill-neutral-300 dark:fill-neutral-600 text-lg font-bold"
        animate={{ y: [3, -3, 3] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        ?
      </motion.text>
    </svg>
  )
}

function ReportIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none">
      {/* Paper stack */}
      <motion.rect
        x="25" y="22" width="55" height="65" rx="3"
        className="fill-neutral-200 dark:fill-neutral-700"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.rect
        x="30" y="17" width="55" height="65" rx="3"
        className="fill-neutral-100 dark:fill-neutral-800"
        initial={{ x: -5, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      />
      <motion.rect
        x="35" y="12" width="55" height="65" rx="3"
        className="fill-white dark:fill-neutral-900 stroke-accent-500 dark:stroke-accent-400"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      />
      {/* Chart bars */}
      <motion.g initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }} transition={{ delay: 0.4, duration: 0.4 }}>
        <rect x="45" y="45" width="8" height="22" rx="2" className="fill-accent-400 dark:fill-accent-500" />
        <rect x="58" y="35" width="8" height="32" rx="2" className="fill-teal-400 dark:fill-teal-500" />
        <rect x="71" y="40" width="8" height="27" rx="2" className="fill-accent-300 dark:fill-accent-600" />
      </motion.g>
      {/* Title line */}
      <motion.rect
        x="45" y="22" width="35" height="4" rx="1"
        className="fill-neutral-300 dark:fill-neutral-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3 }}
      />
      {/* Floating chart icon */}
      <motion.g
        animate={{ y: [-2, 2, -2], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <circle cx="100" cy="25" r="10" className="fill-accent-100 dark:fill-accent-900/30" />
        <path d="M95 28l4-6 4 3 4-5" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </svg>
  )
}

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
  { icon: React.ReactNode; illustration?: React.ReactNode; title: string; description: string }
> = {
  'no-data': {
    icon: <Inbox className="w-full h-full" />,
    illustration: <ReportIllustration className="w-full h-full" />,
    title: 'No data available',
    description: 'There is no data to display at the moment.',
  },
  'no-results': {
    icon: <Search className="w-full h-full" />,
    illustration: <SearchIllustration className="w-full h-full" />,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
  'no-items': {
    icon: <FileX className="w-full h-full" />,
    illustration: <ReportIllustration className="w-full h-full" />,
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
    illustration: <InspectionIllustration className="w-full h-full" />,
    title: 'No inspections found',
    description: 'Schedule your first inspection to get started.',
  },
  'no-hotels': {
    icon: <Building2 className="w-full h-full" />,
    illustration: <HotelIllustration className="w-full h-full" />,
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
  const displayIllustration = config?.illustration
  const displayTitle = title || config?.title || 'No data'
  const displayDescription = description || config?.description || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'bg-white/80 dark:bg-neutral-900/50 backdrop-blur-sm',
        'border border-neutral-200/50 dark:border-neutral-800',
        'rounded-xl',
        sizeStyles.container,
        className
      )}
    >
      {/* Animated Illustration or Icon */}
      {displayIllustration ? (
        <div className={cn('mb-4', size === 'lg' ? 'w-32 h-28' : size === 'md' ? 'w-28 h-24' : 'w-20 h-18')}>
          {displayIllustration}
        </div>
      ) : (
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
      )}

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

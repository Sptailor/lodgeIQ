/**
 * Status Badge Component
 *
 * Professional status badges for inspection and result states
 * Based on industry research - uses semantic colors and icons
 * Supports two types: inspection status and result status
 */

import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  FileCheck,
  MinusCircle,
} from 'lucide-react'

// Inspection status types
export type InspectionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED'

// Result status types (for individual checklist items)
export type ResultStatus = 'PASS' | 'FAIL' | 'NEEDS_IMPROVEMENT' | 'NOT_APPLICABLE' | 'PENDING'

type Status = InspectionStatus | ResultStatus

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'subtle'
  showIcon?: boolean
  className?: string
}

// Inspection status configuration
const inspectionStatusConfig: Record<
  InspectionStatus,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    bg: string
    text: string
    border: string
    glow: string
  }
> = {
  IN_PROGRESS: {
    label: 'In Progress',
    icon: Clock,
    bg: 'bg-warning-500/20',
    text: 'text-warning-300',
    border: 'border-warning-500/30',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
  },
  COMPLETED: {
    label: 'Completed',
    icon: FileCheck,
    bg: 'bg-accent-500/20',
    text: 'text-accent-300',
    border: 'border-accent-500/30',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.3)]',
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle2,
    bg: 'bg-teal-500/20',
    text: 'text-teal-300',
    border: 'border-teal-500/30',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.3)]',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    bg: 'bg-danger-500/20',
    text: 'text-danger-300',
    border: 'border-danger-500/30',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  },
}

// Result status configuration
const resultStatusConfig: Record<
  ResultStatus,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    bg: string
    text: string
    border: string
    glow: string
  }
> = {
  PASS: {
    label: 'Pass',
    icon: CheckCircle2,
    bg: 'bg-teal-500/20',
    text: 'text-teal-300',
    border: 'border-teal-500/30',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.3)]',
  },
  FAIL: {
    label: 'Fail',
    icon: XCircle,
    bg: 'bg-danger-500/20',
    text: 'text-danger-300',
    border: 'border-danger-500/30',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  },
  NEEDS_IMPROVEMENT: {
    label: 'Needs Attention',
    icon: AlertCircle,
    bg: 'bg-warning-500/20',
    text: 'text-warning-300',
    border: 'border-warning-500/30',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
  },
  NOT_APPLICABLE: {
    label: 'N/A',
    icon: MinusCircle,
    bg: 'bg-white/10',
    text: 'text-white/60',
    border: 'border-white/20',
    glow: '',
  },
  PENDING: {
    label: 'Pending',
    icon: Clock,
    bg: 'bg-white/10',
    text: 'text-white/60',
    border: 'border-white/20',
    glow: '',
  },
}

// Size configurations
const sizeConfig = {
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    icon: 'w-3 h-3',
    gap: 'gap-1',
  },
  md: {
    padding: 'px-3 py-1.5',
    text: 'text-xs',
    icon: 'w-3.5 h-3.5',
    gap: 'gap-1.5',
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-2',
  },
}

export function StatusBadge({
  status,
  size = 'md',
  variant = 'default',
  showIcon = true,
  className,
}: StatusBadgeProps) {
  // Determine which config to use
  const config = (inspectionStatusConfig[status as InspectionStatus] ||
    resultStatusConfig[status as ResultStatus]) as {
    label: string
    icon: React.ComponentType<{ className?: string }>
    bg: string
    text: string
    border: string
  }

  if (!config) {
    console.warn(`Unknown status: ${status}`)
    return null
  }

  const Icon = config.icon
  const sizes = sizeConfig[size]

  const configWithGlow = config as typeof config & { glow?: string }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-all backdrop-blur-sm',
        sizes.padding,
        sizes.text,
        sizes.gap,
        'border',
        config.bg,
        config.text,
        config.border,
        configWithGlow.glow,
        'hover:scale-105',
        className
      )}
    >
      {showIcon && <Icon className={sizes.icon} />}
      <span className="uppercase tracking-wider">{config.label}</span>
    </span>
  )
}

/**
 * Get border color for a status (useful for colored borders)
 */
export function getStatusBorderColor(status: Status): string {
  const allConfig = { ...inspectionStatusConfig, ...resultStatusConfig }
  const config = allConfig[status as keyof typeof allConfig]

  if (!config) return '#6b7280' // neutral gray fallback

  // Map to hex colors for inline styles
  const colorMap: Record<string, string> = {
    'border-success-300': '#86efac',
    'border-danger-300': '#fca5a5',
    'border-warning-300': '#fcd34d',
    'border-primary-300': '#7dd3fc',
    'border-neutral-300': '#d4d4d4',
  }

  const borderClass = config.border.split(' ')[0] // Get first class (light mode)
  return colorMap[borderClass] || '#6b7280'
}

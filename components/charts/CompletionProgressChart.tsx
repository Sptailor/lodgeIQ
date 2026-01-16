'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface CompletionProgressChartProps {
  completed: number
  pending: number
  inProgress: number
}

// Vibrant color palette with gradients
const COLORS = {
  completed: {
    base: '#10b981',     // emerald-500 (brighter green)
    light: '#34d399',    // emerald-400
    gradient: 'url(#completedGradient)'
  },
  inProgress: {
    base: '#f59e0b',     // amber-500
    light: '#fcd34d',    // amber-300 (brighter yellow)
    gradient: 'url(#inProgressGradient)'
  },
  pending: {
    base: '#8b5cf6',     // violet-500
    light: '#a78bfa',    // violet-400
    gradient: 'url(#pendingGradient)'
  },
}

export function CompletionProgressChart({ completed, pending, inProgress }: CompletionProgressChartProps) {
  const data = [
    { name: 'Completed', value: completed, fill: COLORS.completed.gradient },
    { name: 'In Progress', value: inProgress, fill: COLORS.inProgress.gradient },
    { name: 'Rejected', value: pending, fill: COLORS.pending.gradient },
  ].filter(item => item.value > 0)

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
          >
            <div
              className="w-3 h-3 rounded-full shadow-lg"
              style={{
                backgroundColor: entry.payload.name === 'Completed'
                  ? COLORS.completed.base
                  : entry.payload.name === 'In Progress'
                  ? COLORS.inProgress.base
                  : COLORS.pending.base,
                boxShadow: `0 0 8px ${entry.payload.name === 'Completed'
                  ? COLORS.completed.base
                  : entry.payload.name === 'In Progress'
                  ? COLORS.inProgress.base
                  : COLORS.pending.base}40`
              }}
            />
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
        <PieChart>
        <defs>
          {/* Gradient for Completed */}
          <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.completed.light} stopOpacity={1} />
            <stop offset="100%" stopColor={COLORS.completed.base} stopOpacity={0.9} />
          </linearGradient>
          {/* Gradient for In Progress */}
          <linearGradient id="inProgressGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.inProgress.light} stopOpacity={1} />
            <stop offset="100%" stopColor={COLORS.inProgress.base} stopOpacity={0.9} />
          </linearGradient>
          {/* Gradient for Rejected */}
          <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.pending.light} stopOpacity={1} />
            <stop offset="100%" stopColor={COLORS.pending.base} stopOpacity={0.9} />
          </linearGradient>
          {/* Enhanced shadow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="42%"
          innerRadius={85}
          outerRadius={115}
          paddingAngle={0}
          dataKey="value"
          animationDuration={1500}
          animationBegin={0}
          style={{ filter: 'url(#glow)' }}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.fill}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(23, 23, 23, 0.95)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          }}
          itemStyle={{
            fontWeight: 600,
            color: '#ffffff'
          }}
          labelStyle={{
            color: '#ffffff',
            fontWeight: 700
          }}
        />
        <Legend
          content={<CustomLegend />}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

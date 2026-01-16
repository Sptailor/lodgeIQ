'use client'

import { Pie, PieChart, Legend } from 'recharts'

interface CompletionProgressChartProps {
  completed: number
  pending: number
  inProgress: number
}

export function CompletionProgressChart({ completed, pending, inProgress }: CompletionProgressChartProps) {
  const chartData = [
    { status: 'Completed', count: completed, fill: '#22c55e' },
    { status: 'In Progress', count: inProgress, fill: '#f59e0b' },
    { status: 'Rejected', count: pending, fill: '#8b5cf6' },
  ].filter(item => item.count > 0)

  const renderLegend = (props: any) => {
    const { payload } = props
    return (
      <div className="flex flex-wrap justify-center gap-3 pt-6">
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full h-[380px] flex items-center justify-center">
      <PieChart width={400} height={380}>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="45%"
          innerRadius={0}
          outerRadius={120}
          paddingAngle={2}
        />
        <Legend content={renderLegend} />
      </PieChart>
    </div>
  )
}

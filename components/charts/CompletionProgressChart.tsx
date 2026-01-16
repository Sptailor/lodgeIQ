'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface CompletionProgressChartProps {
  completed: number
  pending: number
  inProgress: number
}

// Matching exact colors from status cards
const COLORS = {
  completed: '#22c55e',  // green-500
  inProgress: '#f59e0b', // amber-500
  pending: '#8b5cf6',    // violet-500
}

export function CompletionProgressChart({ completed, pending, inProgress }: CompletionProgressChartProps) {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Rejected', value: pending },
  ].filter(item => item.value > 0)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={80}
          outerRadius={110}
          paddingAngle={4}
          dataKey="value"
          animationDuration={1500}
          animationBegin={0}
          style={{ filter: 'url(#shadow)' }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.name === 'Completed' ? COLORS.completed : entry.name === 'In Progress' ? COLORS.inProgress : COLORS.pending}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          itemStyle={{ fontWeight: 600 }}
        />
        <Legend
          verticalAlign="bottom"
          height={50}
          iconType="circle"
          iconSize={12}
          formatter={(value) => (
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

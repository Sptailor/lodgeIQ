'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface CompletionProgressChartProps {
  completed: number
  pending: number
  inProgress: number
}

const COLORS = {
  completed: '#10b981',
  inProgress: '#f59e0b',
  pending: '#6b7280',
}

export function CompletionProgressChart({ completed, pending, inProgress }: CompletionProgressChartProps) {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending', value: pending },
  ].filter(item => item.value > 0)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.name === 'Completed' ? COLORS.completed : entry.name === 'In Progress' ? COLORS.inProgress : COLORS.pending}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value) => <span style={{ fontSize: 12, fontWeight: 500 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

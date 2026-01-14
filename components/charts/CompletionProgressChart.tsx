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
    { name: 'Rejected', value: pending },
  ].filter(item => item.value > 0)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          animationDuration={1500}
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
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          itemStyle={{ fontWeight: 500 }}
        />
        <Legend
          verticalAlign="bottom"
          height={40}
          iconType="circle"
          iconSize={10}
          formatter={(value) => <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface RatingDistributionChartProps {
  data: Array<{
    rating: string
    count: number
  }>
}

// Using UI color palette: danger -> warning -> accent -> teal -> success
const COLORS = ['#ef4444', '#f59e0b', '#6366f1', '#14b8a6', '#22c55e']

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          {COLORS.map((color, index) => (
            <linearGradient key={`gradient-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0.7} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="rating"
          stroke="#a3a3a3"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#a3a3a3"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ fontWeight: 600, marginBottom: 6, color: '#171717' }}
          cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
        />
        <Bar
          dataKey="count"
          radius={[8, 8, 0, 0]}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

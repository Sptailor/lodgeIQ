'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface InspectorActivityChartProps {
  data: Array<{
    inspector: string
    completed: number
    avgRating: number
  }>
}

export function InspectorActivityChart({ data }: InspectorActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
        <defs>
          <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="inspector"
          stroke="#a3a3a3"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
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
          formatter={(value: number, name: string) => {
            if (name === 'completed') return [value, 'Completed']
            if (name === 'avgRating') return [value.toFixed(2), 'Avg Rating']
            return [value, name]
          }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
          }}
          iconType="circle"
        />
        <Bar
          dataKey="completed"
          fill="url(#completedGradient)"
          radius={[8, 8, 0, 0]}
          animationDuration={1500}
          name="Completed Inspections"
        />
        <Bar
          dataKey="avgRating"
          fill="url(#ratingGradient)"
          radius={[8, 8, 0, 0]}
          animationDuration={1500}
          name="Average Rating"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

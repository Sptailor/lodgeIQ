'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface InspectionTrendsChartProps {
  data: Array<{
    month: string
    inspections: number
  }>
}

export function InspectionTrendsChart({ data }: InspectionTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
        <XAxis
          dataKey="month"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          labelStyle={{ fontWeight: 600, marginBottom: 4 }}
        />
        <Line
          type="monotone"
          dataKey="inspections"
          stroke="#d97706"
          strokeWidth={3}
          dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

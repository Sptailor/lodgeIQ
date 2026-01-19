'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface InspectionTrendsChartProps {
  data: Array<{
    month: string
    inspections: number
    completed: number
  }>
}

export function InspectionTrendsChart({ data }: InspectionTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="month"
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
        />
        <Legend
          wrapperStyle={{
            paddingTop: '10px',
          }}
          iconType="circle"
        />
        <Line
          type="monotone"
          dataKey="inspections"
          stroke="#6366f1"
          strokeWidth={3}
          dot={{ fill: '#6366f1', strokeWidth: 0, r: 5 }}
          activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
          animationDuration={1500}
          name="Total Inspections"
        />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ fill: '#10b981', strokeWidth: 0, r: 5 }}
          activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
          animationDuration={1500}
          name="Completed Inspections"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

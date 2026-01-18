'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface HotelPerformanceChartProps {
  data: Array<{
    hotel: string
    avgRating: number
    inspections: number
  }>
}

const COLORS = ['#6366f1', '#14b8a6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316']

export function HotelPerformanceChart({ data }: HotelPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
        <defs>
          {COLORS.map((color, index) => (
            <linearGradient key={`gradient-${index}`} id={`hotelGradient${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="hotel"
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
          domain={[0, 5]}
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
          formatter={(value: number | undefined, name: string | undefined) => {
            if (!value) return ['0', name || 'Value']
            if (name === 'avgRating') return [value.toFixed(2), 'Avg Rating']
            if (name === 'inspections') return [value, 'Inspections']
            return [value, name || 'Value']
          }}
        />
        <Bar
          dataKey="avgRating"
          radius={[8, 8, 0, 0]}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#hotelGradient${index % COLORS.length})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts'

interface InspectionTrendsChartProps {
  data: Array<{
    month: string
    inspections: number
  }>
}

export function InspectionTrendsChart({ data }: InspectionTrendsChartProps) {
  return (
    <div className="relative">
      {/* Glass UI background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 dark:from-neutral-800/60 dark:to-neutral-900/30 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-neutral-700/40 shadow-2xl" />

      <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorInspections" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
          </linearGradient>
          {/* Gradient using accent indigo and teal for UI consistency */}
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
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
          itemStyle={{ color: '#6366f1', fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="inspections"
          stroke="none"
          fill="url(#colorInspections)"
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="inspections"
          stroke="url(#lineGradient)"
          strokeWidth={3.5}
          dot={{ fill: '#6366f1', strokeWidth: 0, r: 6 }}
          activeDot={{ r: 8, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
    </div>
  )
}

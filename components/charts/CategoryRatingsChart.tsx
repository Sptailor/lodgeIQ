'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

interface CategoryRatingsChartProps {
  data: Array<{
    category: string
    rating: number
  }>
}

export function CategoryRatingsChart({ data }: CategoryRatingsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data}>
        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#0d9488" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <PolarGrid stroke="#e5e5e5" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: '#a3a3a3', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={{ fill: '#a3a3a3', fontSize: 11 }}
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
          formatter={(value: number | undefined) => [value ? value.toFixed(2) : '0', 'Avg Rating']}
        />
        <Radar
          name="Rating"
          dataKey="rating"
          stroke="#14b8a6"
          fill="url(#radarGradient)"
          fillOpacity={0.6}
          strokeWidth={2}
          animationDuration={1500}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

'use client'

import { useAppState } from '@/components/app/AppState'
import { useTicker } from '@/components/shared/use-ticker'
import { COLORS, portfolioAverage } from '@/lib/domain/derive'
import { monthShort } from '@/lib/domain/format'
import { averageAsOf, inspectionsInQuarter, monthlyAverages, openFollowUps, overdueUnplanned, sparklinePoints, todaysInspections, unassigned } from '@/lib/domain/selectors'

const MUTED = 'rgba(255,255,255,.72)'

/** The one big number on this page: the average of every property's latest score. */
export function PortfolioScore() {
  const { state, now } = useAppState()
  const t = useTicker()
  const avg = portfolioAverage(state.properties)
  const before = averageAsOf(state.properties, Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 4, 1) - 1)
  const since = monthShort(now.getUTCMonth() - 5)
  const diff = before == null ? null : Math.round((avg - before) * 10) / 10
  const today = todaysInspections(state.properties, now)
  const sub =
    today.improved > 0
      ? 'Up after today’s inspection'
      : diff == null
        ? `Across ${state.properties.length} properties`
        : diff === 0
          ? `Unchanged since ${since}`
          : `${diff > 0 ? 'Up' : 'Down'} ${Math.abs(diff).toFixed(1)} since ${since}`
  const series = monthlyAverages(state.properties, now, 12).map((m) => m.value)

  return (
    <section aria-label="Portfolio score" className="card p-6">
      <p className="caption-2 text-ink-2">Portfolio score</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="hero-num">{(avg * t).toFixed(1)}</p>
        <svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true" className="mb-2 h-10 w-[120px]">
          <polyline points={sparklinePoints(series)} fill="none" stroke={COLORS.pass} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <p className="caption-2" style={{ color: MUTED }}>
        {sub}
      </p>
    </section>
  )
}

/** Inspections this quarter, open follow ups and overdue visits. */
export function KeyFigures() {
  const { state, now } = useAppState()
  const t = useTicker()
  const q = inspectionsInQuarter(state.properties, now)
  const today = todaysInspections(state.properties, now)
  const open = openFollowUps(state.followUps).length
  const notAssigned = unassigned(state.followUps).length
  const overdue = overdueUnplanned(state.properties, state.visits, now).length
  const standard = state.properties[0]?.visitStandardDays ?? 90

  const quarterSub =
    today.added > 0
      ? `${today.added === 1 ? 'One' : today.added} added today`
      : q.previous === 0
        ? 'First quarter of data'
        : `${q.current >= q.previous ? 'Up' : 'Down'} from ${q.previous} last quarter`

  const rows = [
    { label: 'Inspections this quarter', value: Math.round(q.current * t), sub: quarterSub, color: MUTED },
    { label: 'Open follow ups', value: Math.round(open * t), sub: `${notAssigned} not assigned yet`, color: notAssigned ? COLORS.warn : MUTED },
    { label: 'Overdue visits', value: Math.round(overdue * t), sub: overdue ? `Past your ${standard} day standard` : 'All planned', color: overdue ? COLORS.warn : MUTED },
  ]

  return (
    <section aria-label="Key figures" className="card px-6 py-2">
      {rows.map((r, i) => (
        <div key={r.label} className="flex items-center justify-between gap-3 py-3" style={i < rows.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,.08)' } : undefined}>
          <div className="min-w-0">
            <p className="body-5">{r.label}</p>
            <p className="caption-5" style={{ color: r.color }}>
              {r.sub}
            </p>
          </div>
          <p className="heading-5">{r.value}</p>
        </div>
      ))}
    </section>
  )
}

'use client'

import { useState } from 'react'
import { COLORS, tone } from '@/lib/domain/derive'
import { monthShort, sameUtcDay } from '@/lib/domain/format'
import type { InspectionSummary } from '@/lib/domain/types'

const y = (s: number) => 120 - ((s - 1.5) / 3.5) * 120

/** Score by visit: a line with a point for each of the last visits and a 3.0 reference line. */
export function ScoreHistoryChart({ inspections, now }: { inspections: InspectionSummary[]; now: Date }) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = inspections.slice(-8)
  const n = shown.length
  const labels = shown.map((i) => (sameUtcDay(i.date, now) ? 'Today' : monthShort(new Date(i.date).getUTCMonth())))
  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100)
  const points = shown.map((s, i) => `${(x(i) * 3).toFixed(1)},${y(s.score).toFixed(1)}`).join(' ')

  return (
    <section aria-labelledby="hist" className="card p-6">
      <div className="flex items-baseline justify-between">
        <h2 id="hist" className="heading-6">
          Score by visit
        </h2>
        <span className="caption-2 text-ink-2" aria-live="polite">
          {hover != null ? `${labels[hover]}: ${shown[hover].score.toFixed(1)}` : `Last ${n} ${n === 1 ? 'visit' : 'visits'}`}
        </span>
      </div>
      <div className="relative mt-6 h-[120px]">
        <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 overflow-visible">
          <line x1="0" x2="300" y1={y(3)} y2={y(3)} stroke="rgba(255,255,255,.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {n > 1 && <polyline points={points} fill="none" stroke={COLORS.pass} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
        </svg>
        <span className="caption-5 absolute right-0 pb-[2px] text-ink-3" style={{ top: `${(y(3) / 120) * 100}%`, transform: 'translateY(-100%)' }}>
          3.0
        </span>
        {shown.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className="pt"
            style={{ left: `${x(i).toFixed(2)}%`, top: `${((y(s.score) / 120) * 100).toFixed(2)}%` }}
            aria-label={`${labels[i]}, score ${s.score.toFixed(1)}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onBlur={() => setHover(null)}
          >
            <span style={{ background: tone(s.score) }} />
          </button>
        ))}
      </div>
      <div className="mt-3 flex justify-between">
        {labels.map((l, i) => (
          <span key={i} className="caption-5 text-ink-3">
            {l}
          </span>
        ))}
      </div>
    </section>
  )
}

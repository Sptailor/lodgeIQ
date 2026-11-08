'use client'

import Link from 'next/link'
import { useAppState } from '@/components/app/AppState'
import { tone } from '@/lib/domain/derive'
import { sameUtcDay, shortDate } from '@/lib/domain/format'

/** The four most recent inspections across the portfolio. */
export function LatestInspections() {
  const { state, now } = useAppState()
  const latest = state.properties
    .flatMap((p) => p.inspections.map((i) => ({ p, i })))
    .sort((a, b) => b.i.date.localeCompare(a.i.date))
    .slice(0, 4)

  return (
    <section aria-labelledby="recent" className="card p-6">
      <h2 id="recent" className="heading-6">
        Latest inspections
      </h2>
      <div className="mt-2 flex flex-col">
        {latest.map(({ p, i }) => (
          <Link
            key={i.id}
            href={`/app/properties/${p.id}`}
            className="lift flex items-center gap-3 py-3 no-underline"
            style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}
          >
            <span className="min-w-0 flex-1">
              <span className="body-4 block">{p.name}</span>
              <span className="caption-5 mt-[2px] block text-ink-2">
                {sameUtcDay(i.date, now) ? 'Today' : shortDate(i.date)}, {i.inspector}
              </span>
            </span>
            <span className="body-1" style={{ color: tone(i.score) }}>
              {i.score.toFixed(1)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

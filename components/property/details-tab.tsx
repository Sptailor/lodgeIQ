'use client'

import { useAppState } from '@/components/app/AppState'
import { CHECK_COUNT } from '@/lib/domain/checks'
import { weekdayDayMonth } from '@/lib/domain/format'
import type { Property } from '@/lib/domain/types'
import { lastMeta } from './overview-tab'

export function DetailsTab({ property: p }: { property: Property }) {
  const { state, people, now } = useAppState()
  const planned = state.visits.find((v) => v.propertyId === p.id)
  const person = planned ? people.find((x) => x.id === planned.inspectorId) : undefined
  const facts = [
    { k: 'Type', v: p.kind },
    { k: 'Size', v: p.size || 'Not set' },
    { k: 'Last visit', v: lastMeta(p, now) },
    { k: 'Next visit', v: planned ? `${weekdayDayMonth(planned.date)}, ${person?.name ?? 'an inspector'}` : 'Not planned' },
    { k: 'Visit standard', v: `Every ${p.visitStandardDays} days` },
    { k: 'Checklist', v: `Standard, ${CHECK_COUNT} checks` },
  ]
  return (
    <div className="fade max-w-[640px]">
      <section aria-labelledby="facts" className="card p-6">
        <h2 id="facts" className="heading-6">
          Details
        </h2>
        <dl className="m-0 mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
          {facts.map((d) => (
            <div key={d.k} className="contents">
              <dt className="caption-2 text-ink-2">{d.k}</dt>
              <dd className="body-5 m-0 text-right">{d.v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

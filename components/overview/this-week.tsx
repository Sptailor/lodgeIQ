'use client'

import Link from 'next/link'
import { useAppState } from '@/components/app/AppState'
import { weekdayDay } from '@/lib/domain/format'

/** The first four visits of the planning week. */
export function ThisWeek() {
  const { state, people } = useAppState()
  const visits = state.visits.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)

  return (
    <section aria-labelledby="visits" className="card p-6">
      <div className="flex items-baseline justify-between">
        <h2 id="visits" className="heading-6">
          This week
        </h2>
        <Link href="/app/schedule" className="crumb body-5">
          Open schedule
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {visits.map((v) => {
          const prop = state.properties.find((p) => p.id === v.propertyId)
          const person = people.find((p) => p.id === v.inspectorId)
          if (!prop) return null
          const [dow, day] = weekdayDay(v.date).split(' ')
          return (
            <Link
              key={v.id}
              href={`/app/properties/${prop.id}`}
              className="lift flex items-center gap-3 rounded-md px-3 py-2 no-underline"
              style={{ border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.04)' }}
            >
              <span className="w-11 flex-none rounded-sm py-[2px] text-center" style={{ background: 'rgba(255,255,255,.10)' }}>
                <span className="caption-5 block text-ink-2">{dow}</span>
                <span className="body-1 block">{day}</span>
              </span>
              <span className="min-w-0">
                <span className="body-4 block">{prop.name}</span>
                <span className="caption-5 mt-[2px] block text-ink-2">
                  {person?.name ?? 'An inspector'}
                  {state.plannedVisitIds.includes(v.id) ? ', just planned' : ''}
                </span>
              </span>
            </Link>
          )
        })}
        {visits.length === 0 && <p className="body-6 text-ink-2">No visits planned this week. Open the schedule to plan some.</p>}
      </div>
    </section>
  )
}

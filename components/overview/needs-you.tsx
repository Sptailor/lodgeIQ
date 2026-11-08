'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppState } from '@/components/app/AppState'
import { CheckIcon, ImageIcon } from '@/components/shared/icon'
import { daysSince, latest, safetyFails, tone, why } from '@/lib/domain/derive'
import { weekdayDayMonth } from '@/lib/domain/format'
import { DEMO_FIRST, hasVisitPlanned, needsYou } from '@/lib/domain/selectors'

/** Properties that need you, most urgent first. */
export function NeedsYou() {
  const { state, now, isDemo, people, ui } = useAppState()
  const list = needsYou(state.properties, now, isDemo ? DEMO_FIRST : undefined)

  return (
    <section aria-labelledby="needs" className="card p-6">
      <div className="flex items-baseline justify-between">
        <h2 id="needs" className="heading-6">
          Needs you
        </h2>
        <span className="caption-2 text-ink-2">{list.length ? `${list.length} to review` : 'All clear'}</span>
      </div>
      <div className="mt-1 flex flex-col">
        {list.map((p, i) => {
          const l = latest(p)
          const planned = state.visits.find((v) => v.propertyId === p.id)
          const noSafety = safetyFails(l.res).length === 0
          const canPlan = daysSince(p, now) > p.visitStandardDays && noSafety && !hasVisitPlanned(p, state.visits)
          const person = planned ? people.find((x) => x.id === planned.inspectorId) : undefined
          const text = planned && noSafety ? `Visit planned for ${weekdayDayMonth(planned.date)} with ${person?.name ?? 'an inspector'}.` : why(p, now)
          return (
            <div key={p.id} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,.10)' }}>
              {p.photo ? (
                <Image src={p.photo} alt="" width={80} height={60} className="h-[60px] w-20 flex-none rounded-sm object-cover" />
              ) : (
                <span className="flex h-[60px] w-20 flex-none items-center justify-center rounded-sm text-ink-4" style={{ background: 'rgba(255,255,255,.10)' }}>
                  <ImageIcon size={20} aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="body-1 flex items-center gap-2">
                  {p.name}
                  <span className="caption-3 rounded-full px-2 py-[2px]" style={{ background: 'rgba(255,255,255,.12)', color: tone(l.score) }}>
                    {l.score.toFixed(1)}
                  </span>
                </p>
                <p className="body-6 mt-[2px] text-ink-2">{text}</p>
              </div>
              {canPlan ? (
                <button type="button" className={`btn button-sm ${i === 0 ? 'btn-primary' : 'btn-quiet'}`} onClick={() => ui.openPlan(p.id)}>
                  Plan a visit
                </button>
              ) : (
                <Link href={`/app/properties/${p.id}`} className={`btn button-sm ${i === 0 ? 'btn-primary' : 'btn-quiet'}`}>
                  Open property
                </Link>
              )}
            </div>
          )
        })}
        {list.length === 0 && (
          <div className="flex flex-col items-start gap-3 py-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-md" style={{ background: 'rgba(255,255,255,.12)' }}>
              <CheckIcon size={24} color="#6FE3C6" aria-hidden="true" />
            </span>
            <p className="body-1">Nothing needs you right now</p>
            <p className="body-6 text-ink-2">Failed checks and overdue visits show up here as soon as they happen.</p>
          </div>
        )}
      </div>
    </section>
  )
}

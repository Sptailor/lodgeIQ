'use client'

import { useEffect, useState } from 'react'
import { useAppState } from '@/components/app/AppState'
import { attn, COLORS, daysSince, latest } from '@/lib/domain/derive'
import { addDays, dayMonthLong, sameUtcDay, weekdayDay, weekdayDayMonth } from '@/lib/domain/format'

type Selection = { kind: 'tray'; propertyId: string } | { kind: 'block'; id: string }

/**
 * The week planner. Pick a property from "Needs a visit" or a block on the grid, then click a day to place it.
 */
export function ScheduleView() {
  const { state, people, weekStart, now, placeVisit } = useAppState()
  const [sel, setSel] = useState<Selection | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSel(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const start = new Date(weekStart)
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const byId = (id: string) => state.properties.find((p) => p.id === id)

  const planned = (propertyId: string) => state.visits.some((v) => v.propertyId === propertyId)
  const tray = state.properties
    .filter((p) => daysSince(p, now) > 45 && !planned(p.id))
    .sort((a, b) => daysSince(b, now) - daysSince(a, now))

  const drop = (inspectorId: string, day: Date) => {
    if (!sel) return
    if (sel.kind === 'tray') placeVisit({ propertyId: sel.propertyId, inspectorId, date: day.toISOString() })
    else {
      const v = state.visits.find((x) => x.id === sel.id)
      if (v) placeVisit({ propertyId: v.propertyId, inspectorId, date: day.toISOString(), visitId: v.id })
    }
    setSel(null)
  }

  return (
    <div className="fade flex flex-col gap-6 px-10 pb-12 pt-6 max-md:px-4">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="heading-3">Schedule</h1>
          <p className="body-3 mt-2 max-w-[680px] text-ink-2">Week of {dayMonthLong(start)}. Drag a visit to move it, or select it and click a day.</p>
        </div>
        <p className="body-5 text-ink-2" aria-live="polite">
          {state.visits.length} visits this week{tray.length ? `, ${tray.length} still need a slot` : ', nothing waiting'}
        </p>
      </div>

      <section className="card flex flex-wrap items-center gap-4 px-6 py-4" aria-label="Needs a visit">
        <span className="body-4">Needs a visit</span>
        {tray.map((p) => {
          const on = sel?.kind === 'tray' && sel.propertyId === p.id
          const d = daysSince(p, now)
          return (
            <button key={p.id} type="button" className={`tray${on ? ' tray-on' : ''}`} aria-pressed={on} onClick={() => setSel(on ? null : { kind: 'tray', propertyId: p.id })}>
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: d > 90 ? COLORS.fail : COLORS.warn }} />
              <span className="body-5">{p.name}</span>
              <span className="caption-5 text-ink-3">{d} days</span>
            </button>
          )
        })}
        {tray.length === 0 && (
          <span className="body-6" style={{ color: COLORS.pass }}>
            Everything due is planned.
          </span>
        )}
        <span className="caption-5 ml-auto text-ink-3">{sel ? 'Now click a day to place it' : 'Select a property, then click a day'}</span>
      </section>

      <section className="card overflow-x-auto p-0" aria-label="Week planner">
        <div role="grid" className="grid min-w-[960px]" style={{ gridTemplateColumns: '200px repeat(7, minmax(0, 1fr))' }}>
          <div role="columnheader" className="caption-3 p-4 text-ink-3" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
            Inspector
          </div>
          {days.map((d, i) => {
            const [wd, n] = weekdayDay(d).split(' ')
            return (
              <div key={i} role="columnheader" style={{ padding: '12px 16px', borderLeft: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.08)', opacity: i > 4 ? 0.6 : 1 }}>
                <span className="caption-5 block text-ink-3">{wd}</span>
                <span className="body-1">{n}</span>
              </div>
            )
          })}
          {people.map((person) => (
            <div key={person.id} className="contents">
              <div role="rowheader" className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <span className="caption-3 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full" aria-hidden="true" style={{ color: '#05080A', background: person.color }}>
                  {person.initials}
                </span>
                <span className="min-w-0">
                  <span className="body-4 block">{person.name}</span>
                  <span className="caption-5 block text-ink-3">{person.region}</span>
                </span>
              </div>
              {days.map((d, di) => {
                const here = state.visits.filter((v) => v.inspectorId === person.id && sameUtcDay(v.date, d))
                const countries = new Set(here.map((v) => byId(v.propertyId)?.countryCode))
                const warn = countries.size > 1
                return (
                  <div
                    key={di}
                    role="gridcell"
                    className={`cell${di > 4 ? ' cell-wkend' : ''}${sel ? ' cell-target' : ''}${warn ? ' cell-warn' : ''}`}
                    aria-label={`${person.name}, ${weekdayDayMonth(d)}, ${here.length ? `${here.length} visits` : 'free'}`}
                    onClick={() => drop(person.id, d)}
                  >
                    {here.map((v) => {
                      const p = byId(v.propertyId)
                      if (!p) return null
                      const on = sel?.kind === 'block' && sel.id === v.id
                      return (
                        <button
                          key={v.id}
                          type="button"
                          className={`blk${on ? ' blk-on' : ''}`}
                          aria-pressed={on}
                          style={{ color: '#05080A', background: v.planned ? '#FFFFFF' : attn(p, now) ? COLORS.warn : COLORS.pass }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSel(on ? null : { kind: 'block', id: v.id })
                          }}
                        >
                          <span className="caption-3 block truncate">{p.name}</span>
                          <span className="caption-5 block opacity-80">
                            {p.place.split(',')[0]}, {latest(p).score.toFixed(1)}
                          </span>
                        </button>
                      )
                    })}
                    {warn && (
                      <span className="caption-5 mt-1 block" style={{ color: COLORS.warn }}>
                        Two countries in one day
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useAppState } from './AppState'
import { latest } from '@/lib/domain/derive'
import { addDays, relativeTime, weekdayDayMonth } from '@/lib/domain/format'

function Dialog({ propertyId }: { propertyId: string }) {
  const { state, people, weekStart, now, placeVisit, ui } = useAppState()
  const [day, setDay] = useState<number | null>(null)
  const [who, setWho] = useState<string | null>(null)
  const p = state.properties.find((x) => x.id === propertyId)
  if (!p) return null
  const l = latest(p)
  const days = Array.from({ length: 5 }, (_, i) => addDays(new Date(weekStart), i))

  const confirm = async () => {
    if (day == null || !who) return
    ui.closePlan()
    await placeVisit({ propertyId, inspectorId: who, date: days[day].toISOString() })
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={ui.closePlan}>
      <div
        className="pop flex w-[480px] max-w-full flex-col gap-6 rounded-xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-title"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 24 }}
      >
        <div>
          <h2 id="plan-title" className="heading-5">
            Plan a visit
          </h2>
          <p className="body-6 mt-1 text-ink-2">
            {p.name}. Last visit {relativeTime(l.date, now)} by {l.inspector}.
          </p>
        </div>
        <div>
          <p className="body-4">Day</p>
          <div role="group" aria-label="Day" className="mt-2 flex flex-wrap gap-2">
            {days.map((d, i) => (
              <button key={i} type="button" className={`chip${day === i ? ' chip-on' : ''}`} aria-pressed={day === i} onClick={() => setDay(i)}>
                <span className="body-5">{weekdayDayMonth(d)}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="body-4">Inspector</p>
          <div role="group" aria-label="Inspector" className="mt-2 flex flex-wrap gap-2">
            {people.map((person) => (
              <button key={person.id} type="button" className={`chip${who === person.id ? ' chip-on' : ''}`} aria-pressed={who === person.id} onClick={() => setWho(person.id)}>
                <span className="body-5">{person.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost button-md" onClick={ui.closePlan}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary button-md" onClick={confirm} disabled={day == null || !who}>
            Plan visit
          </button>
        </div>
      </div>
    </div>
  )
}

/** Plan a visit, opened from Needs you and from the property header. */
export function PlanVisitDialog() {
  const { ui } = useAppState()
  return ui.planFor ? <Dialog key={ui.planFor} propertyId={ui.planFor} /> : null
}

'use client'

import { useState } from 'react'
import { useAppState } from '@/components/app/AppState'
import { CaretIcon } from '@/components/shared/icon'
import { StatusChip } from '@/components/shared/status-chip'
import { CATS, CHECKS } from '@/lib/domain/checks'
import { COLORS, tone } from '@/lib/domain/derive'
import { sameUtcDay, shortDate } from '@/lib/domain/format'
import type { Property } from '@/lib/domain/types'

/** Every inspection, newest first. Open one to see all nine checks from that visit. */
export function HistoryTab({ property: p }: { property: Property }) {
  const { now } = useAppState()
  const [open, setOpen] = useState<number | null>(0) // the newest visit starts open
  const rows = p.inspections.map((i, idx) => ({ i, prev: idx > 0 ? p.inspections[idx - 1] : null })).reverse()

  return (
    <section className="card fade px-6 py-2" aria-label="Inspection history">
      {rows.map(({ i, prev }, j) => {
        const isOpen = open === j
        const count = (c: string) => i.res.split('').filter((x) => x === c).length
        const fails = count('f')
        const diff = prev ? Math.round((i.score - prev.score) * 10) / 10 : null
        return (
          <div key={i.id} style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
            <button type="button" className="vrow" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : j)}>
              <span className="h-[10px] w-[10px] flex-none rounded-full" style={{ background: tone(i.score) }} />
              <span className="w-[120px] flex-none">
                <span className="body-4 block">{sameUtcDay(i.date, now) ? 'Today' : shortDate(i.date)}</span>
                <span className="caption-5 block text-ink-3">{i.inspector}</span>
              </span>
              <span className="body-6 min-w-0 flex-1 text-ink-2">
                {count('p')} pass, {count('n')} needs work{fails ? `, ${fails} fail` : ''}
              </span>
              <span
                className="caption-3 rounded-full px-2 py-[2px]"
                style={{ background: 'rgba(255,255,255,.08)', color: diff == null ? 'rgba(255,255,255,.56)' : diff >= 0 ? COLORS.pass : COLORS.failInk }}
              >
                {diff == null ? 'First visit' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`}
              </span>
              <span className="heading-6 w-10 text-right" style={{ color: tone(i.score) }}>
                {i.score.toFixed(1)}
              </span>
              <CaretIcon size={16} className="chev" color="rgba(255,255,255,.56)" aria-hidden="true" style={{ transform: isOpen ? 'rotate(180deg)' : undefined }} />
            </button>
            {isOpen && (
              <div className="fade grid grid-cols-3 gap-6 pb-6 pl-8 max-md:grid-cols-1">
                {CATS.map((name, k) => (
                  <div key={name}>
                    <p className="caption-3 text-ink-2">{name}</p>
                    <div className="mt-2 flex flex-col gap-1">
                      {CHECKS.map((c, ci) => ({ c, ci }))
                        .filter((o) => o.c.category === k)
                        .map((o) => (
                          <div key={o.c.slug} className="flex items-center justify-between gap-2 py-1">
                            <span className="body-6">{o.c.name}</span>
                            <StatusChip result={i.res[o.ci]} />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

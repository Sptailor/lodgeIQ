'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppState } from '@/components/app/AppState'
import { ImageIcon } from '@/components/shared/icon'
import { ScoreSeal } from '@/components/shared/score-seal'
import { StatusChip } from '@/components/shared/status-chip'
import { CATS, CHECKS } from '@/lib/domain/checks'
import { COLORS, latest, sealLabel, tone } from '@/lib/domain/derive'
import { sameUtcDay, shortDate } from '@/lib/domain/format'
import type { FollowUp, Property } from '@/lib/domain/types'
import { ScoreHistoryChart } from './score-history-chart'

export const lastMeta = (p: Property, now: Date) => {
  const l = latest(p)
  return `${sameUtcDay(l.date, now) ? 'Today' : shortDate(l.date)}, ${l.inspector}`
}

export function followUpStatus(f: FollowUp): string {
  if (f.status === 'done') return f.note || 'Fixed'
  return `${f.status === 'open' ? 'Not assigned' : `With ${f.owner}`}, due ${shortDate(f.due)}${f.note ? `. ${f.note}` : ''}`
}

export const followUpColor = (f: FollowUp) => (f.status === 'done' ? COLORS.pass : f.status === 'open' ? COLORS.warn : 'rgba(255,255,255,.72)')

export function OverviewTab({ property: p }: { property: Property }) {
  const { state, now } = useAppState()
  const l = latest(p)
  // Not done yet, plus the ones today's inspection just closed.
  const shownFollowUps = state.followUps.filter((f) => f.propertyId === p.id && (f.status !== 'done' || f.note === "Closed by today's inspection"))

  return (
    <div className="fade grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start gap-6 max-lg:grid-cols-1">
      <div className="flex flex-col gap-6">
        <section aria-labelledby="latest" className="card p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="latest" className="heading-6">
              Latest inspection
            </h2>
            <p className="caption-2 text-ink-2">{lastMeta(p, now)}</p>
          </div>
          <div className="mt-6 flex items-center gap-8 max-sm:flex-col max-sm:items-start">
            <ScoreSeal size={136} stroke={7} cats={l.cats} score={l.score.toFixed(1)} label={sealLabel(l)} />
            <div className="flex min-w-0 flex-1 flex-col gap-4 max-sm:w-full">
              {CATS.map((name, k) => (
                <div key={name}>
                  <div className="flex justify-between">
                    <span className="body-5">{name}</span>
                    <span className="body-4" style={{ color: tone(l.cats[k]) }}>
                      {l.cats[k].toFixed(1)}
                    </span>
                  </div>
                  <span className="mt-2 block h-1 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,.12)' }}>
                    <span className="bar block h-1 rounded-full" style={{ background: tone(l.cats[k]), transform: `scaleX(${(l.cats[k] / 5).toFixed(3)})` }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="checks" className="card p-6">
          <h2 id="checks" className="heading-6">
            Checks from the latest visit
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-6 max-md:grid-cols-1">
            {CATS.map((name, k) => (
              <div key={name}>
                <p className="caption-3 text-ink-2">{name}</p>
                <div className="mt-2 flex flex-col gap-2">
                  {CHECKS.map((c, i) => ({ c, i }))
                    .filter((o) => o.c.category === k)
                    .map((o) => (
                      <div key={o.c.slug} className="flex items-center justify-between gap-2 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,.12)' }}>
                        <span className="body-6">{o.c.name}</span>
                        <StatusChip result={l.res[o.i]} />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <ScoreHistoryChart inspections={p.inspections} now={now} />

        <section aria-labelledby="pfu" className="card p-6">
          <div className="flex items-baseline justify-between">
            <h2 id="pfu" className="heading-6">
              Follow ups
            </h2>
            <Link href={`/app/follow-ups?property=${p.id}`} className="crumb body-5">
              All follow ups
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {shownFollowUps.map((f) => (
              <div key={f.id} className="flex items-start gap-3">
                {f.photo ? (
                  <Image src={f.photo} alt={CHECKS[f.checkIndex].alt} width={64} height={64} className="h-16 w-16 flex-none rounded-sm object-cover" />
                ) : (
                  <span className="flex h-16 w-16 flex-none items-center justify-center rounded-sm text-ink-4" style={{ background: 'rgba(255,255,255,.12)' }}>
                    <ImageIcon size={20} aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="body-6">{f.text}</p>
                  <p className="caption-4" style={{ color: followUpColor(f) }}>
                    {followUpStatus(f)}
                  </p>
                </div>
              </div>
            ))}
            {shownFollowUps.length === 0 && <p className="body-6 text-ink-2">No open follow ups. Failed checks open one automatically.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}

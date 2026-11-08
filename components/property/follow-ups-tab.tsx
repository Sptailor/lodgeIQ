'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppState } from '@/components/app/AppState'
import { CHECKS } from '@/lib/domain/checks'
import type { Property } from '@/lib/domain/types'
import { followUpColor, followUpStatus } from './overview-tab'

/** Every follow up for this property, whatever its status. */
export function FollowUpsTab({ property: p }: { property: Property }) {
  const { state } = useAppState()
  const list = state.followUps.filter((f) => f.propertyId === p.id)
  return (
    <section className="card fade px-6 py-2" aria-label="Follow ups for this property">
      {list.map((f) => (
        <div key={f.id} className="flex items-center gap-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          {f.photo ? (
            <Image src={f.photo} alt={CHECKS[f.checkIndex].alt} width={80} height={60} className="h-[60px] w-20 flex-none rounded-sm object-cover" />
          ) : (
            <span className="h-[60px] w-20 flex-none rounded-sm" style={{ background: 'rgba(255,255,255,.10)' }} />
          )}
          <div className="min-w-0 flex-1">
            <p className="caption-3 text-ink-3">{CHECKS[f.checkIndex].name}</p>
            <p className="body-5 mt-[2px]">{f.text}</p>
            <p className="caption-4" style={{ color: followUpColor(f) }}>
              {followUpStatus(f)}
            </p>
          </div>
          <Link href={`/app/follow-ups?property=${p.id}`} className="btn btn-quiet button-sm">
            Open in follow ups
          </Link>
        </div>
      ))}
      {list.length === 0 && <p className="body-6 py-6 text-ink-2">No follow ups for this property yet. Failed checks open one automatically.</p>}
    </section>
  )
}

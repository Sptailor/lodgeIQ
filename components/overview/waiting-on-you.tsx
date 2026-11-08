'use client'

import Image from 'next/image'
import { useAppState } from '@/components/app/AppState'
import { AssignDropdown } from '@/components/shared/assign-dropdown'
import { CheckIcon, ImageIcon } from '@/components/shared/icon'
import { CHECKS } from '@/lib/domain/checks'
import { shortDate } from '@/lib/domain/format'

/** Follow ups with no owner yet. Assign them right here. */
export function WaitingOnYou() {
  const { state } = useAppState()
  const waiting = state.followUps.filter((f) => f.status === 'open').sort((a, b) => a.due.localeCompare(b.due))

  return (
    <section aria-labelledby="wait" className="card p-6" style={{ overflow: 'visible' }}>
      <div className="flex items-baseline justify-between">
        <h2 id="wait" className="heading-6">
          Waiting on you
        </h2>
        <span className="caption-2 text-ink-2">{waiting.length ? `${waiting.length} need an owner` : 'All assigned'}</span>
      </div>
      <div className="mt-2 flex flex-col">
        {waiting.map((f) => {
          const prop = state.properties.find((p) => p.id === f.propertyId)
          return (
            <div key={f.id} className="fade flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
              {f.photo ? (
                <Image src={f.photo} alt="" width={40} height={40} className="h-10 w-10 flex-none rounded-sm object-cover" />
              ) : (
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-sm text-ink-4" style={{ background: 'rgba(255,255,255,.08)' }}>
                  <ImageIcon size={16} aria-hidden="true" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="body-4 block">{CHECKS[f.checkIndex].name}</span>
                <span className="caption-5 mt-[2px] block text-ink-2">
                  {prop?.name}, due {shortDate(f.due)}
                </span>
              </span>
              <AssignDropdown followUpId={f.id} />
            </div>
          )
        })}
        {waiting.length === 0 && (
          <div className="flex items-center gap-3 py-6">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'rgba(111,227,198,.14)' }}>
              <CheckIcon size={16} color="#6FE3C6" aria-hidden="true" />
            </span>
            <p className="body-6 text-ink-2">Every follow up has an owner.</p>
          </div>
        )}
      </div>
    </section>
  )
}

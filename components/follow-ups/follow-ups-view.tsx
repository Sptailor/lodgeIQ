'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/components/app/AppState'
import { AssignDropdown } from '@/components/shared/assign-dropdown'
import { CaretIcon, ImageIcon } from '@/components/shared/icon'
import { CHECKS } from '@/lib/domain/checks'
import { COLORS } from '@/lib/domain/derive'
import { shortDate } from '@/lib/domain/format'
import type { FollowUpStatus } from '@/lib/domain/types'
import { EvidenceLens } from './evidence-lens'

const TABS: { id: FollowUpStatus; label: string; dot: string; empty: string }[] = [
  { id: 'open', label: 'Not assigned', dot: COLORS.warn, empty: 'Nothing waiting. New fails land here.' },
  { id: 'progress', label: 'Being fixed', dot: 'rgba(255,255,255,.72)', empty: 'Nothing is being fixed right now. Assign a follow up to see it here.' },
  { id: 'done', label: 'Fixed', dot: COLORS.pass, empty: 'Fixed follow ups land here.' },
]

/** Every follow up, by status. One row open at a time, so the page never grows past the screen. */
export function FollowUpsView({ initialProperty }: { initialProperty?: string }) {
  const { state, resolveFollowUp } = useAppState()
  const router = useRouter()
  const [tab, setTab] = useState<FollowUpStatus>('open')
  const [filter, setFilter] = useState(initialProperty && state.properties.some((p) => p.id === initialProperty) ? initialProperty : 'all')
  const [openId, setOpenId] = useState<string | null>(null)

  const inFilter = (propertyId: string) => filter === 'all' || propertyId === filter
  const withFollowUps = state.properties.filter((p) => state.followUps.some((f) => f.propertyId === p.id))
  const rows = state.followUps.filter((f) => f.status === tab && inFilter(f.propertyId))
  const current = TABS.find((t) => t.id === tab)!

  const pickFilter = (id: string) => {
    setFilter(id)
    setOpenId(null)
    window.history.replaceState(null, '', id === 'all' ? '/app/follow-ups' : `/app/follow-ups?property=${id}`)
  }

  return (
    <div className="fade flex max-w-[1040px] flex-col gap-6 px-10 pb-16 pt-8 max-md:px-4">
      <div>
        <h1 className="heading-3">Follow ups</h1>
        <p className="body-3 mt-2 max-w-[680px] text-ink-2">Every failed check opens one, with the inspector&apos;s photo. Assign it to whoever fixes it, and the next inspection closes it.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,.12)' }}>
        <div role="tablist" aria-label="Status" className="flex gap-2">
          {TABS.map((t) => {
            const on = tab === t.id
            const n = state.followUps.filter((f) => f.status === t.id && inFilter(f.propertyId)).length
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                className={`tab${on ? ' tab-on' : ''}`}
                aria-selected={on}
                data-tour={t.id === 'open' && !on ? 'fu-tab-open' : undefined}
                data-tour-place="down"
                onClick={() => {
                  setTab(t.id)
                  setOpenId(null)
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: t.dot }} />
                <span className="body-4">{t.label}</span>
                <span className="caption-3" style={{ borderRadius: 9999, padding: '2px 8px', ...(on ? { background: '#FFFFFF', color: '#000000' } : { background: 'rgba(255,255,255,.12)', color: 'rgba(255,255,255,.72)' }) }}>
                  {n}
                </span>
              </button>
            )
          })}
        </div>
        <label className="body-5 flex items-center gap-2 pb-2 text-ink-2">
          Property
          <select className="pick body-5" value={filter} onChange={(e) => pickFilter(e.target.value)}>
            <option value="all">All properties</option>
            {withFollowUps.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div role="tabpanel" aria-label={current.label} className="flex flex-col gap-2">
        {rows.map((f, ri) => {
          const p = state.properties.find((x) => x.id === f.propertyId)!
          const check = CHECKS[f.checkIndex]
          const open = openId === f.id
          const owner = f.owner
          return (
            <article key={f.id} className={`fu${open ? ' fu-open' : ''}`}>
              <button
                type="button"
                className="fu-head"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : f.id)}
                data-tour={tab === 'open' && ri === 0 && !openId ? 'fu-row' : undefined}
                data-tour-place="down"
              >
                {f.photo ? (
                  <Image src={f.photo} alt="" width={48} height={48} className="h-12 w-12 flex-none rounded-md object-cover" />
                ) : (
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-md text-ink-4" style={{ background: 'rgba(255,255,255,.12)' }}>
                    <ImageIcon size={20} aria-hidden="true" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="caption-3 flex items-center gap-2 text-ink-2">
                    {check.name}
                    {f.isNew && <span className="rounded-full px-2" style={{ background: COLORS.pass, color: '#000' }}>New</span>}
                  </span>
                  <span className="body-4 mt-[2px] block truncate">{f.text}</span>
                </span>
                <span className="caption-2 w-[200px] flex-none truncate text-ink-2 max-md:hidden">{p.name}</span>
                <span className="caption-2 w-24 flex-none text-right" style={{ color: f.status === 'open' ? COLORS.warn : 'rgba(255,255,255,.72)' }}>
                  {f.status === 'done' ? 'Fixed' : `Due ${shortDate(f.due)}`}
                </span>
                <CaretIcon className="chev" size={16} color="rgba(255,255,255,.72)" style={open ? { transform: 'rotate(180deg)' } : undefined} aria-hidden="true" />
              </button>
              {open && (
                <div className="fade flex gap-6 pb-4 pl-20 pr-4 max-md:flex-col max-md:pl-4">
                  {f.photo && <EvidenceLens src={f.photo} alt={check.alt} />}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="body-3">{f.text}</p>
                    {f.note && (
                      <p className="caption-4" style={{ color: COLORS.pass }}>
                        {f.note}
                      </p>
                    )}
                    <p className="caption-2 text-ink-2">
                      {p.name}, {p.place}.{' '}
                      {f.status === 'done'
                        ? owner
                          ? `Fixed by ${owner}.`
                          : 'Fixed.'
                        : owner
                          ? `With ${owner}, due ${shortDate(f.due)}.`
                          : `Not assigned yet, due ${shortDate(f.due)}.`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {f.status === 'open' && <AssignDropdown followUpId={f.id} align="left" />}
                      {f.status === 'progress' && (
                        <button type="button" className="btn btn-primary button-sm" onClick={() => resolveFollowUp(f.id)}>
                          Mark as fixed
                        </button>
                      )}
                      <button type="button" className="btn btn-ghost button-sm" onClick={() => router.push(`/app/properties/${p.id}`)}>
                        Open property
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
        {rows.length === 0 && (
          <p className="body-6 rounded-xl px-4 py-8 text-center text-ink-3" style={{ border: '1px dashed rgba(255,255,255,.18)' }}>
            {current.empty}
          </p>
        )}
      </div>
    </div>
  )
}

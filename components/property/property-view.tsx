'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAppState } from '@/components/app/AppState'
import { CheckIcon } from '@/components/shared/icon'
import { DetailsTab } from './details-tab'
import { FollowUpsTab } from './follow-ups-tab'
import { HistoryTab } from './history-tab'
import { OverviewTab } from './overview-tab'
import { PropertyHeader } from './property-header'

const EWASO = 'ewaso-river-camp'

export function PropertyView({ id }: { id: string }) {
  const { state, isDemo, markGuide } = useAppState()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const p = state.properties.find((x) => x.id === id)

  // The demo tour's first step is done once the Ewaso page is open.
  useEffect(() => {
    if (isDemo && id === EWASO) markGuide(0)
  }, [isDemo, id, markGuide])

  if (!p) {
    return (
      <div className="px-10 pb-12 pt-6 max-md:px-4">
        <h1 className="heading-4">Property not found</h1>
        <p className="body-3 mt-2 max-w-[680px] text-ink-2">That property is not in your portfolio. It may have been removed, or the link may be wrong.</p>
        <Link href="/app/portfolio" className="btn btn-quiet button-md mt-6">
          Back to the portfolio
        </Link>
      </div>
    )
  }

  const tab = search.get('tab') ?? 'overview'
  const openFollowUps = state.followUps.filter((f) => f.propertyId === p.id && f.status !== 'done').length
  const tabs = [
    { key: 'overview', label: 'Overview', count: null as number | null },
    { key: 'inspections', label: 'Inspections', count: p.inspections.length },
    { key: 'follow', label: 'Follow ups', count: openFollowUps },
    { key: 'details', label: 'Details', count: null },
  ]
  const pick = (key: string) => router.replace(key === 'overview' ? pathname : `${pathname}?tab=${key}`, { scroll: false })
  const banner = state.banners[p.id]

  return (
    <div className="fade flex flex-col gap-6 px-10 pb-16 pt-6 max-md:px-4" key={p.id}>
      <nav aria-label="Breadcrumb" className="body-5 flex items-center gap-2 text-ink-2">
        <Link href="/app/portfolio" className="crumb body-5">
          Portfolio
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/app/portfolio?property=${p.id}`} className="crumb body-5">
          {p.country}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink" aria-current="page">
          {p.name}
        </span>
      </nav>

      <PropertyHeader property={p} />

      {banner && (
        <div className="pop flex items-center gap-4 rounded-lg px-6 py-4" role="status" style={{ background: 'rgba(111,227,198,.14)', color: '#6FE3C6' }}>
          <CheckIcon size={24} aria-hidden="true" />
          <p className="body-5 flex-1">{banner}</p>
          <Link href="/app/follow-ups" className="btn btn-teal button-sm">
            See follow ups
          </Link>
        </div>
      )}

      <div role="tablist" aria-label="Property sections" className="flex gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,.12)' }}>
        {tabs.map((t) => (
          <button key={t.key} type="button" role="tab" className={`tab${tab === t.key ? ' tab-on' : ''}`} aria-selected={tab === t.key} onClick={() => pick(t.key)}>
            <span className="body-4">{t.label}</span>
            {t.count != null && (
              <span className="caption-3 rounded-full px-2 py-[2px]" style={{ background: 'rgba(255,255,255,.12)', color: 'rgba(255,255,255,.72)' }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'details' ? <DetailsTab property={p} /> : tab === 'inspections' ? <HistoryTab key={p.inspections.length} property={p} /> : tab === 'follow' ? <FollowUpsTab property={p} /> : <OverviewTab property={p} />}
    </div>
  )
}

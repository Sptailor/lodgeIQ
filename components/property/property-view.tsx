'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAppState } from '@/components/app/AppState'
import { COLORS } from '@/lib/domain/derive'
import { DetailsTab } from './details-tab'
import { FollowUpsTab } from './follow-ups-tab'
import { HistoryTab } from './history-tab'
import { OverviewTab } from './overview-tab'
import { PropertyHeader } from './property-header'

const EWASO = 'ewaso-river-camp'

export function PropertyView({ id }: { id: string }) {
  const { state, isDemo, ready, markGuide } = useAppState()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const p = state.properties.find((x) => x.id === id)

  // The demo tour's first step is done once the Ewaso page is open.
  // Wait until the tab's saved demo state is restored, or the restore would undo this.
  useEffect(() => {
    if (ready && isDemo && id === EWASO) markGuide(0)
  }, [ready, isDemo, id, markGuide])

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
  // Older saved demo state held a sentence here; only the structured summary is shown.
  const saved = state.banners[p.id]
  const banner = saved && typeof saved === 'object' ? saved : null

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
        <div className="pop flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-5 py-3" role="status" style={{ background: '#141617', border: '1px solid rgba(255,255,255,.07)' }}>
          <span aria-hidden="true" className="h-2 w-2 flex-none rounded-full" style={{ background: COLORS.pass }} />
          <p className="body-6 min-w-0 flex-1">
            Inspection submitted. {p.name} now scores {banner.score.toFixed(1)}{' '}
            <span style={{ color: banner.diff > 0 ? COLORS.pass : banner.diff < 0 ? COLORS.failInk : 'rgba(255,255,255,.72)' }}>
              ({banner.diff === 0 ? 'no change' : `${banner.diff > 0 ? '+' : '−'}${Math.abs(banner.diff).toFixed(1)}`})
            </span>
            .
          </p>
          <Link href={`/app/follow-ups?property=${p.id}`} className="crumb body-5">
            {banner.followUps || 'See follow ups'}
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

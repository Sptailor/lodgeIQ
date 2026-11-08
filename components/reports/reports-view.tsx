'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/components/app/AppState'
import { CATS, CHECKS } from '@/lib/domain/checks'
import { attn, COLORS, daysSince, latest, previous } from '@/lib/domain/derive'
import { shortDate } from '@/lib/domain/format'
import { monthlyAverages } from '@/lib/domain/selectors'

const EAST_AFRICA = ['KEN', 'TZA']
const REGION_ORDER = ['Kenya', 'Tanzania', 'Europe', 'Asia Pacific', 'Americas', 'Middle East']

const cellStyle = (v: number): React.CSSProperties => ({
  textAlign: 'center',
  borderRadius: 8,
  padding: '8px 0',
  color: '#FFFFFF',
  background: v < 3 ? 'rgba(255,138,122,.32)' : v < 3.5 ? 'rgba(255,197,107,.24)' : 'rgba(255,255,255,.12)',
})

/** Four panels computed from the real inspections: trend, most failed checks, categories by region, biggest changes. */
export function ReportsView() {
  const { state, now, isDemo, showToast, markGuide, followUpsOpenCount } = useReportState()
  const router = useRouter()
  const [range, setRange] = useState<6 | 12>(6)
  const [region, setRegion] = useState<'all' | 'ea' | 'row'>('all')
  const [hover, setHover] = useState<number | null>(null)

  // Demo tour: opening Reports is the last step.
  useEffect(() => {
    if (isDemo) markGuide(3)
  }, [isDemo, markGuide])

  const set = state.properties.filter((p) => region === 'all' || (region === 'ea' ? EAST_AFRICA.includes(p.countryCode) : !EAST_AFRICA.includes(p.countryCode)))
  const avg = set.length ? set.reduce((s, p) => s + latest(p).score, 0) / set.length : 0
  const months = monthlyAverages(set, now, range)
  const known = months.filter((m) => m.value != null)
  const first = known[0]?.value ?? null
  const last = known[known.length - 1]?.value ?? null
  const delta = first != null && last != null ? last - first : 0
  const y = (v: number) => Math.max(0, Math.min(200, 200 - ((v - 3) / 1.5) * 200))
  const x = (i: number) => i / (range - 1)
  const line = months.flatMap((m, i) => (m.value == null ? [] : [`${(x(i) * 600).toFixed(1)},${y(m.value).toFixed(1)}`])).join(' ')

  const yearAgo = now.getTime() - 365 * 86400000
  const failCounts = CHECKS.map((c, i) => ({
    name: c.name,
    n: set.reduce((s, p) => s + p.inspections.filter((ins) => new Date(ins.date).getTime() >= yearAgo && ins.res[i] === 'f').length, 0),
  }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 5)
  const maxFail = Math.max(1, ...failCounts.map((f) => f.n))

  const regions = Array.from(new Set(set.map((p) => p.region))).sort((a, b) => {
    const ia = REGION_ORDER.indexOf(a)
    const ib = REGION_ORDER.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b)
  })
  const heat = regions.map((r) => {
    const xs = set.filter((p) => p.region === r)
    return { name: r, n: xs.length, c: [0, 1, 2].map((k) => xs.reduce((s, p) => s + latest(p).cats[k], 0) / xs.length) }
  })

  const movers = set
    .flatMap((p) => {
      const prev = previous(p)
      if (!prev) return []
      const d = Math.round((latest(p).score - prev.score) * 10) / 10
      return d === 0 ? [] : [{ p, d }]
    })
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
    .slice(0, 5)

  const openFollowUps = followUpsOpenCount(set.map((p) => p.id))
  const visited = set.length ? Math.round((set.filter((p) => daysSince(p, now) <= 90).length / set.length) * 100) : 0

  const share = async () => {
    if (isDemo) return showToast('Sharing is switched off in the demo')
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('Link copied')
    } catch {
      showToast('Copy the link from the address bar')
    }
  }

  const download = async () => {
    if (isDemo) return showToast('Downloads are switched off in the demo')
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('LodgeIQ report', 14, 18)
    doc.setFontSize(11)
    doc.text(`Average score ${avg.toFixed(1)}. ${set.length} properties, ${openFollowUps} open follow ups, ${visited}% visited in 90 days.`, 14, 26)
    autoTable(doc, {
      startY: 34,
      head: [['Property', 'Place', 'Latest score', 'Last visit']],
      body: set.map((p) => [p.name, p.place, latest(p).score.toFixed(1), shortDate(latest(p).date)]),
    })
    doc.save('lodgeiq-report.pdf')
  }

  const kpis = [
    { label: 'Average score', value: avg.toFixed(1), sub: `${delta >= 0 ? 'Up' : 'Down'} ${Math.abs(delta).toFixed(1)} in ${range} months` },
    { label: 'Properties', value: String(set.length), sub: `${set.filter((p) => attn(p, now)).length} need you` },
    { label: 'Open follow ups', value: String(openFollowUps), sub: 'Across this selection' },
    { label: 'Visited in 90 days', value: `${visited}%`, sub: 'Your standard is 100%' },
  ]

  const chip = (on: boolean) => `chip${on ? ' chip-on' : ''}`

  return (
    <div className="fade flex flex-col gap-6 px-10 pb-16 pt-6 max-md:px-4">
      <nav aria-label="Breadcrumb" className="body-5 flex items-center gap-2 text-ink-2">
        <Link href="/app" className="crumb body-5">
          Overview
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-white" aria-current="page">
          Reports
        </span>
      </nav>
      <div>
        <h1 className="heading-3">Reports</h1>
        <p className="body-3 mt-2 max-w-[680px] text-ink-2">How your properties are doing over time, and where to send inspectors next.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,.12)' }}>
        <div role="group" aria-label="Time range" className="flex gap-2">
          {([6, 12] as const).map((r) => (
            <button key={r} type="button" className={chip(range === r)} aria-pressed={range === r} onClick={() => { setRange(r); setHover(null) }}>
              <span className="body-5">{r} months</span>
            </button>
          ))}
        </div>
        <div role="group" aria-label="Region" className="flex gap-2">
          {([['all', 'All regions'], ['ea', 'East Africa'], ['row', 'Rest of world']] as const).map(([id, label]) => (
            <button key={id} type="button" className={chip(region === id)} aria-pressed={region === id} onClick={() => { setRegion(id); setHover(null) }}>
              <span className="body-5">{label}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button type="button" className="btn btn-ghost button-sm" onClick={share}>
            Share
          </button>
          <button type="button" className="btn btn-quiet button-sm" onClick={download}>
            Download PDF
          </button>
        </div>
      </div>

      <section aria-label="Summary" className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {kpis.map((k) => (
          <div key={k.label} className="card p-6">
            <p className="caption-2 text-ink-2">{k.label}</p>
            <p className="heading-2 mt-2">{k.value}</p>
            <p className="caption-2 mt-1 text-ink-2">{k.sub}</p>
          </div>
        ))}
      </section>

      <div className="flex items-stretch gap-6 max-lg:flex-col">
        <section aria-labelledby="trend" className="card min-w-0 p-6" style={{ flex: '2 1 0' }}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="trend" className="heading-6">
              Average score by month
            </h2>
            <span className="caption-2 text-ink-2" aria-live="polite">
              {hover != null && months[hover]?.value != null ? `${months[hover].label}: ${months[hover].value!.toFixed(2)}` : 'Hover a month for its value'}
            </span>
          </div>
          <div className="mt-6 flex gap-3">
            <div className="caption-5 relative h-[200px] w-6 text-ink-3" aria-hidden="true">
              {[['4.5', '0%'], ['4.0', '33.3%'], ['3.5', '66.7%'], ['3.0', '100%']].map(([t, top]) => (
                <span key={t} style={{ position: 'absolute', top, transform: 'translateY(-50%)' }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="relative h-[200px]">
                <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                  {[0, 66.7, 133.3].map((v) => (
                    <line key={v} x1="0" x2="600" y1={v} y2={v} stroke="rgba(255,255,255,.12)" vectorEffect="non-scaling-stroke" />
                  ))}
                  <line x1="0" x2="600" y1="200" y2="200" stroke="rgba(255,255,255,.18)" vectorEffect="non-scaling-stroke" />
                  <polyline points={line} fill="none" stroke={COLORS.pass} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
                {months.map((m, i) =>
                  m.value == null ? null : (
                    <button
                      key={i}
                      type="button"
                      className="pt"
                      style={{ left: `${(x(i) * 100).toFixed(2)}%`, top: `${(y(m.value) / 2).toFixed(2)}%` }}
                      aria-label={`${m.label}, average ${m.value.toFixed(2)}`}
                      onMouseEnter={() => setHover(i)}
                      onFocus={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                      onBlur={() => setHover(null)}
                    >
                      <span />
                    </button>
                  ),
                )}
              </div>
              <div className="mt-3 flex justify-between">
                {months.map((m, i) => (
                  <span key={i} className="caption-5 w-6 text-center text-ink-3">
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="fails" className="card min-w-0 p-6" style={{ flex: '1 1 0' }}>
          <h2 id="fails" className="heading-6">
            Checks that fail most
          </h2>
          <p className="caption-2 mt-1 text-ink-2">Fails in the last 12 months</p>
          <div className="mt-6 flex flex-col gap-4">
            {failCounts.map((f) => (
              <div key={f.name}>
                <div className="flex justify-between">
                  <span className="body-5">{f.name}</span>
                  <span className="body-4">{f.n}</span>
                </div>
                <span className="mt-2 block h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,.12)' }}>
                  <span className="bar" style={{ display: 'block', height: 8, borderRadius: 9999, background: COLORS.fail, transform: `scaleX(${(f.n / maxFail).toFixed(3)})` }} />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex items-stretch gap-6 max-lg:flex-col">
        <section aria-labelledby="heat" className="card min-w-0 overflow-x-auto p-6" style={{ flex: '2 1 0' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="heat" className="heading-6">
              Category scores by region
            </h2>
            <div className="caption-5 flex gap-4 text-ink-2">
              {[['rgba(255,138,122,.32)', 'Below 3.0'], ['rgba(255,197,107,.24)', '3.0 to 3.4'], ['rgba(255,255,255,.12)', '3.5 and above']].map(([bg, t]) => (
                <span key={t} className="inline-flex items-center gap-1">
                  <span style={{ width: 12, height: 12, borderRadius: 4, background: bg }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <table className="mt-4 w-full" style={{ borderCollapse: 'separate', borderSpacing: 4 }}>
            <thead>
              <tr>
                <th scope="col" className="caption-3 py-1 text-left text-ink-2">
                  Region
                </th>
                {CATS.map((c) => (
                  <th key={c} scope="col" className="caption-3 text-ink-2">
                    {c}
                  </th>
                ))}
                <th scope="col" className="caption-3 text-ink-2">
                  Properties
                </th>
              </tr>
            </thead>
            <tbody>
              {heat.map((h) => (
                <tr key={h.name}>
                  <th scope="row" className="body-5 py-2 text-left" style={{ fontWeight: 500 }}>
                    {h.name}
                  </th>
                  {h.c.map((v, k) => (
                    <td key={k} className="body-4" style={cellStyle(v)}>
                      {v.toFixed(1)}
                    </td>
                  ))}
                  <td className="body-6 text-center text-ink-2">{h.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="movers" className="card min-w-0 p-6" style={{ flex: '1 1 0' }}>
          <h2 id="movers" className="heading-6">
            Biggest changes since the last visit
          </h2>
          <div className="mt-4 flex flex-col">
            {movers.map(({ p, d }) => (
              <button key={p.id} type="button" className="lift flex items-center gap-3 py-3" style={{ border: 0, borderBottom: '1px solid rgba(255,255,255,.12)', background: 'transparent' }} onClick={() => router.push(`/app/properties/${p.id}`)}>
                <span className="min-w-0 flex-1">
                  <span className="body-4 block">{p.name}</span>
                  <span className="caption-5 mt-[2px] block text-ink-2">
                    {daysSince(p, now) === 0 ? 'Today' : shortDate(latest(p).date)}, now {latest(p).score.toFixed(1)}
                  </span>
                </span>
                <span className="body-4" style={{ color: d > 0 ? COLORS.pass : COLORS.failInk }}>
                  {d > 0 ? '+' : ''}
                  {d.toFixed(1)}
                </span>
              </button>
            ))}
            {movers.length === 0 && <p className="body-6 text-ink-2">No changes yet for this selection.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}

/** The slice of app state the reports page needs. */
function useReportState() {
  const a = useAppState()
  return {
    ...a,
    followUpsOpenCount: (ids: string[]) => a.state.followUps.filter((f) => f.status !== 'done' && ids.includes(f.propertyId)).length,
  }
}

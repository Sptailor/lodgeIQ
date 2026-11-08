'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/components/app/AppState'
import { Globe, type GlobeHandle } from '@/components/globe/Globe'
import type { GlobeProperty } from '@/components/globe/globe-engine'
import { GlobeIcon, ImageIcon, MinusIcon, PlusIcon } from '@/components/shared/icon'
import { ScoreSeal } from '@/components/shared/score-seal'
import { attn, COLORS, latest, sealLabel, tone, why } from '@/lib/domain/derive'
import { shortDate } from '@/lib/domain/format'
import { COUNTRY_NAMES, HOME } from '@/lib/domain/sample-data'
import type { Property } from '@/lib/domain/types'

const avgOf = (props: Property[]) => props.reduce((s, p) => s + latest(p).score, 0) / props.length
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** The globe, with a list of countries (world view) or properties (country view) beside it. */
export function PortfolioView({ initial }: { initial?: { country?: string; property?: string } }) {
  const { state, now } = useAppState()
  const router = useRouter()
  const globe = useRef<GlobeHandle>(null)

  const startProp = initial?.property ? state.properties.find((p) => p.id === initial.property) : undefined
  const [view, setView] = useState<{ level: string; sel: string | null }>({
    level: startProp ? startProp.countryCode : initial?.country && state.properties.some((p) => p.countryCode === initial.country) ? initial.country : 'world',
    sel: startProp ? startProp.id : null,
  })

  const globeProps: GlobeProperty[] = useMemo(
    () => state.properties.map((p) => ({ id: p.id, name: p.name, countryCode: p.countryCode, lat: p.lat, lon: p.lon, score: latest(p).score, attn: attn(p, now) })),
    [state.properties, now]
  )

  const byCountry = new Map<string, Property[]>()
  state.properties.forEach((p) => byCountry.set(p.countryCode, [...(byCountry.get(p.countryCode) ?? []), p]))
  const order = Array.from(byCountry.keys()).sort((a, b) => (a === HOME.code ? -1 : b === HOME.code ? 1 : byCountry.get(b)!.length - byCountry.get(a)!.length))
  const needCount = state.properties.filter((p) => attn(p, now)).length

  const inCountry = view.level !== 'world'
  const list = inCountry ? (byCountry.get(view.level) ?? []) : []
  const selected = view.sel ? state.properties.find((p) => p.id === view.sel) : undefined
  const globeLabel = inCountry ? `Globe zoomed to ${COUNTRY_NAMES[view.level] ?? view.level}` : `Globe showing ${state.properties.length} properties in ${order.length} countries`

  return (
    <div className="flex h-full min-h-[560px] max-md:h-auto max-md:flex-col">
      <section aria-label="Portfolio list" className="scroll flex w-[360px] flex-none flex-col gap-6 overflow-y-auto p-6 max-md:w-full max-md:overflow-visible max-md:p-4" style={{ borderRight: '1px solid rgba(255,255,255,.12)' }}>
        <nav aria-label="Breadcrumb" className="body-5 flex items-center gap-2 text-ink-2">
          {inCountry ? (
            <>
              <button type="button" className="crumb body-5" onClick={() => globe.current?.toWorld()}>
                World
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-ink">{COUNTRY_NAMES[view.level] ?? view.level}</span>
            </>
          ) : (
            <span className="text-ink">World</span>
          )}
        </nav>

        {!inCountry && (
          <>
            <div className="fade">
              <h1 className="heading-4">Your portfolio</h1>
              <p className="body-6 mt-2 text-ink-2">
                {state.properties.length} properties in {order.length} countries, {needCount} need you. Select a country to fly in.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {order.map((cc) => {
                const arr = byCountry.get(cc)!
                const a = avgOf(arr)
                const at = arr.filter((p) => attn(p, now)).length
                return (
                  <button
                    key={cc}
                    type="button"
                    className="item"
                    onClick={() => globe.current?.goCountry(cc)}
                    onMouseEnter={() => globe.current?.setHoverCountry(cc)}
                    onMouseLeave={() => globe.current?.setHoverCountry(null)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="body-4 flex items-center gap-2">
                        {COUNTRY_NAMES[cc] ?? cc}
                        {cc === HOME.code && (
                          <span className="caption-3 rounded-full px-2 py-[2px]" style={{ background: '#FFFFFF', color: '#000000' }}>
                            Head office
                          </span>
                        )}
                      </span>
                      <span className="caption-5 mt-[2px] block text-ink-2">
                        {plural(arr.length, 'property', 'properties')}
                        {at ? `, ${at} need you` : ''}
                      </span>
                    </span>
                    <span className="heading-6" style={{ color: tone(a) }}>
                      {a.toFixed(1)}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {inCountry && (
          <>
            <div className="fade" key={view.level}>
              <h1 className="heading-4">{COUNTRY_NAMES[view.level] ?? view.level}</h1>
              <p className="body-6 mt-2 text-ink-2">
                {plural(list.length, 'property', 'properties')}, average {list.length ? avgOf(list).toFixed(1) : '0.0'}. {view.level === HOME.code ? `Your head office is in ${HOME.city}.` : ''}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {list
                .slice()
                .sort((a, b) => latest(a).score - latest(b).score)
                .map((p) => {
                  const l = latest(p)
                  const needs = attn(p, now)
                  const on = p.id === view.sel
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`item${on ? ' item-on' : ''}`}
                      aria-pressed={on}
                      onClick={() => (on ? router.push(`/app/properties/${p.id}`) : globe.current?.selectProperty(p.id))}
                      onMouseEnter={() => globe.current?.setListHover(p.id)}
                      onMouseLeave={() => globe.current?.setListHover(null)}
                    >
                      {p.photo ? (
                        <Image src={p.photo} alt="" width={48} height={48} className="h-12 w-12 flex-none rounded-sm object-cover" />
                      ) : (
                        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-sm text-ink-4" style={{ background: 'rgba(255,255,255,.12)' }}>
                          <ImageIcon size={20} aria-hidden="true" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="body-4 block">{p.name}</span>
                        <span className="caption-5 mt-[2px] block" style={{ color: needs ? COLORS.warn : 'rgba(255,255,255,.72)' }}>
                          {needs ? why(p, now) : p.city}
                        </span>
                      </span>
                      <span className="body-1 flex-none" style={{ color: tone(l.score) }}>
                        {l.score.toFixed(1)}
                      </span>
                    </button>
                  )
                })}
            </div>
          </>
        )}
      </section>

      <section aria-label="Globe" className="relative min-w-0 flex-1 max-md:h-[360px] max-md:flex-none">
        <Globe ref={globe} properties={globeProps} label={globeLabel} initial={initial} onChange={setView} />

        <div className="absolute right-6 top-6 flex flex-col gap-2">
          <button type="button" className="ctl" onClick={() => globe.current?.zoomIn()} aria-label="Zoom in">
            <PlusIcon size={16} aria-hidden="true" />
          </button>
          <button type="button" className="ctl" onClick={() => globe.current?.zoomOut()} aria-label="Zoom out">
            <MinusIcon size={16} aria-hidden="true" />
          </button>
          <button type="button" className="ctl" onClick={() => globe.current?.toWorld()} aria-label="Show the whole world">
            <GlobeIcon size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="caption-5 absolute bottom-6 left-6 flex flex-wrap gap-4 rounded-md px-3 py-2 text-ink-2" style={{ background: 'rgba(16,20,22,.5)', border: '1px solid rgba(255,255,255,.12)' }}>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: COLORS.pass }} />
            On track
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: COLORS.warn }} />
            Needs you
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rotate-45" style={{ background: '#FFFFFF' }} />
            Head office
          </span>
          <span>Drag to turn, scroll to zoom</span>
        </div>

        {selected && <DetailCard property={selected} key={selected.id} />}
      </section>
    </div>
  )
}

/** A white card over the globe for the selected property. */
function DetailCard({ property: p }: { property: Property }) {
  const { now } = useAppState()
  const router = useRouter()
  const l = latest(p)
  const needs = attn(p, now)
  return (
    <div className="fade absolute right-20 top-6 box-border w-[304px] max-md:inset-x-4 max-md:right-auto max-md:w-auto overflow-hidden rounded-lg" style={{ background: '#FFFFFF', color: '#000000' }}>
      {p.photo && <Image src={p.photo} alt="" width={304} height={128} className="h-32 w-full object-cover" />}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <ScoreSeal size={64} stroke={8} cats={l.cats} score={l.score.toFixed(1)} label={sealLabel(l)} variant="light" scoreClass="heading-6" />
          <div className="min-w-0">
            <p className="body-1">{p.name}</p>
            <p className="caption-5" style={{ color: '#525252' }}>
              {p.place}
            </p>
          </div>
        </div>
        <p className="body-6 mt-3 rounded-sm px-3 py-2" style={needs ? { background: '#FEF3C7', color: '#713F12' } : { background: '#E8F7F7', color: '#075A5E' }}>
          {needs ? why(p, now) : `Last visit on ${shortDate(l.date)}. Nothing to chase.`}
        </p>
        <button type="button" className="btn btn-dark button-sm mt-3 w-full" onClick={() => router.push(`/app/properties/${p.id}`)}>
          Open property
        </button>
      </div>
    </div>
  )
}

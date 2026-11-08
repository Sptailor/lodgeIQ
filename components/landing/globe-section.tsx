'use client'

import { useMemo, useRef, useState } from 'react'
import { Globe, type GlobeHandle } from '@/components/globe/Globe'
import { LANDING_THEME, type GlobeProperty } from '@/components/globe/globe-engine'
import { fullScore } from '@/lib/domain/checks'
import { COUNTRY_NAMES, SAMPLE_PROPERTIES } from '@/lib/domain/sample-data'
import { Reveal } from './reveal'

const BUTTONS = ['KEN', 'TZA', 'JPN', 'USA']

/** Landing globe: the same sample properties as the app. Needs attention = under 3.0, over 90 days, or a failed safety check. */
function landingProperties(): GlobeProperty[] {
  return SAMPLE_PROPERTIES.map((p) => {
    const score = fullScore(p.latestResults).score
    const safety = [3, 4, 5].some((i) => p.latestResults[i] === 'f')
    return { id: p.id, name: p.name, countryCode: p.countryCode, lat: p.lat, lon: p.lon, score, attn: score < 3 || p.daysSinceLatest > 90 || safety }
  })
}

const countryZoom = (code: string, ext: number) => (code === 'KEN' ? 5.6 : Math.max(1.6, Math.min(6, 50 / ext)))
const countryTarget = (c: [number, number], zoom: number): [number, number] => [c[0], c[1] - 1.2 / Math.max(1, zoom / 4)]

export function GlobeSection() {
  const ref = useRef<GlobeHandle>(null)
  const props = useMemo(landingProperties, [])
  const [level, setLevel] = useState('world')
  const inCountry = level !== 'world'
  const list = props.filter((p) => p.countryCode === level)
  const avg = list.length ? list.reduce((s, p) => s + p.score, 0) / list.length : 0
  const name = COUNTRY_NAMES[level] ?? level
  const options = useMemo(() => ({ theme: LANDING_THEME, radius: 0.42, rotateSpeed: 0.03, wheelZoom: false, selectablePins: false, labels: false, countryZoom, countryTarget }), [])

  return (
    <Reveal id="globe" className="sec">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 48px', boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: '1 1 400px', minWidth: 0 }}>
          <h2 className="heading-2" style={{ maxWidth: 560 }}>
            Your whole portfolio
            <br />
            on one globe.
          </h2>
          <p className="title-2" style={{ maxWidth: 480, marginTop: 16, color: '#A3A3A3' }}>
            Every property glows by its score. Select a country to fly in and see what needs you there.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32 }}>
            {BUTTONS.map((cc) => (
              <button key={cc} type="button" className="btn btn-quiet button-sm" aria-pressed={level === cc} onClick={() => ref.current?.goCountry(cc)}>
                {COUNTRY_NAMES[cc]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: '1 1 480px', minWidth: 0, position: 'relative', aspectRatio: '1', maxWidth: 600 }}>
          <Globe
            ref={ref}
            properties={props}
            options={options}
            onChange={(c) => setLevel(c.level)}
            label={inCountry ? `Globe zoomed to ${name}` : `Globe showing ${props.length} properties with the head office in Nairobi`}
          />
          {inCountry && (
            <div style={{ position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)', width: 'min(340px, 92%)', background: '#FFFFFF', color: '#000000', borderRadius: 16, padding: 16, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <p className="heading-6">{name}</p>
                  <p className="caption-5" style={{ color: '#525252' }}>
                    {list.length} {list.length === 1 ? 'property' : 'properties'}, average {avg.toFixed(1)}
                  </p>
                </div>
                <button type="button" className="btn btn-light button-sm" onClick={() => ref.current?.toWorld()}>
                  Back to world
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  )
}

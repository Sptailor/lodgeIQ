'use client'

import { useEffect, useState } from 'react'
import { CHECKS } from '@/lib/domain/checks'
import { LandingSeal } from './landing-seal'
import { CHIP, LABEL, scoreOf, SEG_COLOR, type Res } from './landing-math'

const SIM: Res[] = ['p', 'p', 'n', 'p', 'f', 'p', 'p', 'p', 'n']

/** An inspection that keeps running: nine checks, a pause, then it starts again. */
export function LiveCard() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(9)
      return
    }
    const t = setInterval(() => setStep((n) => (n >= 12 ? 0 : n + 1)), 1100)
    return () => clearInterval(t)
  }, [])

  const n = Math.min(9, step)
  const res = SIM.map((r, i) => (i < n ? r : null))
  const sc = scoreOf(res)
  const rows: { i: number }[] = []
  for (let i = n - 1; i >= Math.max(0, n - 3); i--) rows.push({ i })

  return (
    <aside className="glass livecard" aria-label="An inspection in progress" style={{ position: 'absolute', right: 48, bottom: 64, width: 360, boxSizing: 'border-box', borderRadius: 24, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="caption-3" style={{ color: '#2FC6C9', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#2FC6C9', display: 'inline-block' }} />
          Inspection in progress
        </p>
        <p className="caption-5" style={{ color: '#A3A3A3' }}>
          {n < 9 ? `Check ${Math.min(n + 1, 9)} of 9` : 'Complete'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 16 }}>
        <LandingSeal size={96} stroke={7} track="rgba(255,255,255,.16)" per={sc.per}>
          <span className="heading-5">{sc.overall == null ? '–' : sc.overall.toFixed(1)}</span>
        </LandingSeal>
        <div style={{ minWidth: 0 }}>
          <p className="body-1">Acacia Ridge Camp</p>
          <p className="caption-5" style={{ color: '#A3A3A3' }}>
            Maasai Mara, Kenya. Sample property
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, minmax(0, 1fr))', gap: 2, marginTop: 12, width: 180 }}>
            {SIM.map((r, i) => (
              <span key={i} style={{ height: 4, borderRadius: 9999, background: i < n ? SEG_COLOR[r] : 'rgba(255,255,255,.2)' }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }} aria-live="polite">
        {rows.map(({ i }) => (
          <div key={i} className="rowin" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 12, background: 'rgba(0,0,0,.4)' }}>
            <span className="body-5">{CHECKS[i].name}</span>
            <span className="caption-3" style={{ borderRadius: 9999, padding: '2px 8px', ...CHIP[SIM[i]] }}>
              {LABEL[SIM[i]]}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}

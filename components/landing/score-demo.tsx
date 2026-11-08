'use client'

import { useEffect, useRef, useState } from 'react'
import { CATS, CHECKS } from '@/lib/domain/checks'
import { LandingSeal } from './landing-seal'
import { scoreOf, type Res } from './landing-math'
import { Reveal } from './reveal'

const START: Res[] = ['p', 'p', 'n', 'p', 'f', 'p', 'p', 'p', 'n']

export function ScoreDemo() {
  const [res, setRes] = useState<Res[]>(START)
  const [shown, setShown] = useState(scoreOf(START).overall ?? 0)
  const raf = useRef(0)
  const reduce = useRef(false)
  const shownRef = useRef(shown)
  shownRef.current = shown

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const set = (i: number, v: Res) => {
    const next = res.slice()
    next[i] = v
    setRes(next)
    const to = scoreOf(next).overall ?? 0
    const from = shownRef.current
    cancelAnimationFrame(raf.current)
    if (reduce.current) return setShown(to)
    const t0 = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 500)
      setShown(from + (to - from) * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }

  const sc = scoreOf(res)
  const overall = sc.overall ?? 0
  let lo = 0
  sc.per.forEach((v, i) => {
    if (v != null && v < (sc.per[lo] ?? 5)) lo = i
  })
  const failed = CHECKS.filter((_, i) => res[i] === 'f').map((k) => k.name.toLowerCase())
  const chase = failed.length === 1 ? ` One follow up opens for ${failed[0]}.` : failed.length > 1 ? ` ${failed.length} follow ups open.` : ''
  const verdict =
    overall < 3
      ? 'Below 3.0. LodgeIQ flags this property for another visit.'
      : overall >= 4 && !failed.length
        ? 'A strong property with nothing to chase.'
        : overall >= 4
          ? `Strong overall.${chase}`
          : `The ${CATS[lo].toLowerCase()} score is holding it back.${chase}`

  const cls = (on: boolean, k: Res) => `seg button-xsm${on ? ` seg-${k}` : ''}`

  return (
    <Reveal id="try" className="sec">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 48px', boxSizing: 'border-box' }}>
        <h2 className="heading-2" style={{ maxWidth: 680 }}>
          Score a property yourself.
        </h2>
        <p className="title-2" style={{ maxWidth: 680, marginTop: 16, color: '#A3A3A3' }}>
          Change any check and watch the seal move. A failed fire check costs more than a slow TV, because each check carries a weight.
        </p>
        <div style={{ marginTop: 48, border: '1px solid #272727', borderRadius: 24, padding: 32, background: '#181818', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
          <div className="checks" style={{ flex: '999 1 560px', minWidth: 0 }}>
            {CATS.map((c, ci) => (
              <div key={c}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 8, borderBottom: '1px solid #313131' }}>
                  <p className="body-1">{c}</p>
                  <p className="body-1" style={{ color: (sc.per[ci] ?? 5) < 3 ? '#E5604A' : '#2FC6C9' }}>
                    {sc.per[ci]?.toFixed(1)}
                  </p>
                </div>
                {CHECKS.map((k, i) => ({ k, i }))
                  .filter((o) => o.k.category === ci)
                  .map(({ k, i }) => (
                    <div key={k.slug} style={{ padding: '16px 0 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                        <p className="body-5">{k.name}</p>
                        <p className="caption-5" style={{ color: '#8A8A8A' }}>
                          ×{k.weight.toFixed(1)}
                        </p>
                      </div>
                      <div role="group" aria-label={k.name} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 4, background: '#000000', borderRadius: 12, padding: 4 }}>
                        <button type="button" className={cls(res[i] === 'p', 'p')} aria-pressed={res[i] === 'p'} onClick={() => set(i, 'p')}>
                          Pass
                        </button>
                        <button type="button" className={cls(res[i] === 'n', 'n')} aria-pressed={res[i] === 'n'} onClick={() => set(i, 'n')}>
                          Needs work
                        </button>
                        <button type="button" className={cls(res[i] === 'f', 'f')} aria-pressed={res[i] === 'f'} onClick={() => set(i, 'f')}>
                          Fail
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
            <LandingSeal size={240} stroke={6} track="#313131" per={sc.per} label={`Score ${overall.toFixed(1)} out of 5`}>
              <span className="heading-1">{shown.toFixed(1)}</span>
            </LandingSeal>
            <p className="title-2" aria-live="polite" style={{ maxWidth: 300 }}>
              {verdict}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

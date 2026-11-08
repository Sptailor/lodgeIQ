import { CATS, CHECKS } from '@/lib/domain/checks'

/** The landing page's own scoring maths, unrounded so the seal can animate smoothly. Same weights as the app. */
const VAL = { p: 5, n: 3, f: 1 } as const
export type Res = keyof typeof VAL
export const ARC_DEG = 110
export const BASES = [-85, 35, 155]
const D2R = Math.PI / 180

export const LABEL: Record<Res, string> = { p: 'Pass', n: 'Needs work', f: 'Fail' }
export const CHIP: Record<Res, React.CSSProperties> = {
  p: { background: 'rgba(47,198,201,.18)', color: '#5FE1E4' },
  n: { background: 'rgba(240,178,62,.18)', color: '#F0B23E' },
  f: { background: 'rgba(229,96,74,.2)', color: '#F7B3A7' },
}
export const SEG_COLOR: Record<Res, string> = { p: '#2FC6C9', n: '#F0B23E', f: '#E5604A' }

export function scoreOf(res: (Res | null)[]) {
  let tw = 0
  let tv = 0
  const per = [0, 1, 2].map((c) => {
    let w = 0
    let v = 0
    CHECKS.forEach((k, i) => {
      const r = res[i]
      if (k.category === c && r) {
        w += k.weight
        v += k.weight * VAL[r]
      }
    })
    tw += w
    tv += v
    return w ? v / w : null
  })
  return { per, overall: tw ? tv / tw : null }
}

export const categoryOf = (i: number) => CATS[CHECKS[i].category]

/** The clip wedge that keeps each arc inside its own 110 degree slot. */
export const wedge = (base: number) => {
  const p = (a: number) => `${(50 + 60 * Math.cos(a * D2R)).toFixed(2)} ${(50 + 60 * Math.sin(a * D2R)).toFixed(2)}`
  return `M50 50 L${p(base)} A60 60 0 0 1 ${p(base + ARC_DEG)} Z`
}

export const arcStyle = (v: number | null, k: number): React.CSSProperties =>
  v == null
    ? { stroke: 'transparent', transform: `rotate(${BASES[k] - ARC_DEG}deg)`, transformOrigin: '50px 50px' }
    : { stroke: v < 3 ? '#E5604A' : '#2FC6C9', transform: `rotate(${(BASES[k] - (1 - v / 5) * ARC_DEG).toFixed(1)}deg)`, transformOrigin: '50px 50px' }

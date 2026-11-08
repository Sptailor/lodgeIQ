'use client'

import { useId } from 'react'

const D2R = Math.PI / 180
const ARC_DEG = 110
const BASES = [-85, 35, 155]

const wedge = (base: number) => {
  const p = (a: number) => `${(50 + 60 * Math.cos(a * D2R)).toFixed(2)} ${(50 + 60 * Math.sin(a * D2R)).toFixed(2)}`
  return `M50 50 L${p(base)} A60 60 0 0 1 ${p(base + ARC_DEG)} Z`
}

type Variant = 'dark' | 'light' | 'landing'

const COLORS: Record<Variant, { good: string; bad: string; track: string }> = {
  dark: { good: '#6FE3C6', bad: '#FF8A7A', track: 'rgba(255,255,255,.18)' }, // the app
  light: { good: '#0B7378', bad: '#C2412D', track: '#E5E5E5' }, // on a white card
  landing: { good: '#2FC6C9', bad: '#E5604A', track: '#313131' }, // the landing page
}

/**
 * The score seal: three arcs (cleanliness, safety, amenities) around the score.
 * Each value arc is the full arc rotated inside a clip wedge, so it animates with transform only.
 * An arc turns red below 3.0. The number is HTML laid over the SVG.
 */
export function ScoreSeal({
  size,
  stroke,
  cats,
  score,
  label,
  variant = 'dark',
  scoreClass = 'heading-4',
}: {
  size: number
  stroke: number
  cats: (number | null)[]
  score: string
  label: string
  variant?: Variant
  scoreClass?: string
}) {
  const id = useId().replace(/:/g, '')
  const c = COLORS[variant]
  const arcStyle = (v: number | null, k: number): React.CSSProperties =>
    v == null
      ? { stroke: 'transparent', transform: `rotate(${BASES[k] - ARC_DEG}deg)`, transformOrigin: '50px 50px' }
      : { stroke: v < 3 ? c.bad : c.good, transform: `rotate(${(BASES[k] - (1 - v / 5) * ARC_DEG).toFixed(1)}deg)`, transformOrigin: '50px 50px' }

  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label}>
        <defs>
          {BASES.map((b, k) => (
            <clipPath key={k} id={`${id}-${k}`}>
              <path d={wedge(b)} />
            </clipPath>
          ))}
        </defs>
        {BASES.map((b, k) => (
          <circle key={`t${k}`} cx="50" cy="50" r="42" fill="none" stroke={c.track} strokeWidth={stroke} strokeDasharray="80.6 263.9" transform={`rotate(${b} 50 50)`} />
        ))}
        {BASES.map((b, k) => (
          <g key={`v${k}`} clipPath={`url(#${id}-${k})`}>
            <circle className="arcv" cx="50" cy="50" r="42" fill="none" strokeWidth={stroke} strokeDasharray="80.6 263.9" style={arcStyle(cats[k] ?? null, k)} />
          </g>
        ))}
      </svg>
      <span className={`${scoreClass} absolute inset-0 flex items-center justify-center`} aria-hidden="true">
        {score}
      </span>
    </div>
  )
}

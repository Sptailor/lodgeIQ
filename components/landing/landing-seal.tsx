import { useId } from 'react'
import { arcStyle, BASES, wedge } from './landing-math'

/** The landing page's score seal: three 110 degree arcs that fill with each category's score. */
export function LandingSeal({ size, stroke, track, per, children, label }: { size: number; stroke: number; track: string; per: (number | null)[]; children: React.ReactNode; label?: string }) {
  const id = useId()
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
        <defs>
          {BASES.map((b, k) => (
            <clipPath key={k} id={`${id}-${k}`}>
              <path d={wedge(b)} />
            </clipPath>
          ))}
        </defs>
        {BASES.map((b) => (
          <circle key={b} cx="50" cy="50" r="42" fill="none" stroke={track} strokeWidth={stroke} strokeDasharray="80.6 263.9" transform={`rotate(${b} 50 50)`} />
        ))}
        {BASES.map((_, k) => (
          <g key={k} clipPath={`url(#${id}-${k})`}>
            <circle className="arcv" cx="50" cy="50" r="42" fill="none" strokeWidth={stroke} strokeDasharray="80.6 263.9" style={arcStyle(per[k], k)} />
          </g>
        ))}
      </svg>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </span>
    </div>
  )
}

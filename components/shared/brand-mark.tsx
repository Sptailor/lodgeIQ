/** The LodgeIQ mark: three arcs, the same shape as the score seal. */
export function BrandMark({ size = 24, a = '#6FE3C6', b = '#FFC56B' }: { size?: number; a?: string; b?: string }) {
  const arc = (rotate: number, stroke: string) => (
    <circle cx="50" cy="50" r="40" fill="none" stroke={stroke} strokeWidth="12" strokeDasharray="73 251" transform={`rotate(${rotate} 50 50)`} />
  )
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {arc(-85, a)}
      {arc(35, a)}
      {arc(155, b)}
    </svg>
  )
}

import { RES_LABEL } from '@/lib/domain/checks'

const STYLES: Record<string, { background: string; color: string }> = {
  p: { background: 'rgba(111,227,198,.14)', color: '#6FE3C6' },
  n: { background: 'rgba(255,197,107,.16)', color: '#FFC56B' },
  f: { background: 'rgba(255,138,122,.18)', color: '#FFC2B8' },
}

/** Pass, Needs work or Fail. Always a word as well as a colour. */
export function StatusChip({ result }: { result: string }) {
  const s = STYLES[result] ?? STYLES.p
  return (
    <span className="caption-3 whitespace-nowrap rounded-full px-2 py-[2px]" style={s}>
      {RES_LABEL[result as 'p' | 'n' | 'f']}
    </span>
  )
}

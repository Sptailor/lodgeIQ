'use client'

import { CheckIcon } from '@/components/shared/icon'
import { ScoreSeal } from '@/components/shared/score-seal'
import { CATS, CHECKS, RES_LABEL, scoreOf } from '@/lib/domain/checks'
import { COLORS } from '@/lib/domain/derive'

export type Draft = { idx: number; res: (string | null)[]; photos: string[][]; done: boolean }

const SEG: Record<string, string> = { p: COLORS.pass, n: COLORS.warn, f: COLORS.fail }

/**
 * The inspector's phone: nine checks, one at a time, with a live score,
 * then a summary to review before submitting.
 */
export function PhoneChecklist({
  propertyName,
  previousScore,
  draft,
  setDraft,
  onSubmit,
  submitting = false,
}: {
  propertyName: string
  previousScore: number
  draft: Draft
  setDraft: (d: Draft) => void
  onSubmit?: () => void
  submitting?: boolean
}) {
  const { idx, res, done } = draft
  const cur = CHECKS[idx]
  const sc = scoreOf(res)
  const answered = res.filter(Boolean).length
  const count = (k: string) => res.filter((r) => r === k).length
  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch })

  const next = () => {
    if (!res[idx]) return
    if (answered === CHECKS.length && idx === CHECKS.length - 1) return set({ done: true })
    const nx = res.findIndex((r, i) => !r && i > idx)
    if (nx >= 0) return set({ idx: nx })
    if (answered === CHECKS.length) return set({ done: true })
    set({ idx: res.findIndex((r) => !r) })
  }

  const label = sc.s == null ? 'No answers yet' : `Score so far ${sc.s.toFixed(1)}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Inspection of ${propertyName}`}
      className="pop flex h-[780px] max-h-[calc(100dvh-16px)] w-[390px] flex-col overflow-hidden rounded-xl border max-md:h-dvh max-md:max-h-none max-md:w-screen max-md:rounded-none max-md:border-0"
      style={{ borderColor: 'rgba(255,255,255,.18)' }}
    >
      <header className="flex flex-col gap-4 p-4" style={{ background: 'rgba(255,255,255,.08)' }}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="body-1">{propertyName}</p>
            <p className="caption-5 flex items-center gap-1 text-ink-2">
              <CheckIcon size={12} color="#6FE3C6" aria-hidden="true" />
              Saved on this phone
            </p>
          </div>
          <ScoreSeal size={48} stroke={9} cats={sc.c} score={sc.s == null ? '–' : sc.s.toFixed(1)} label={label} scoreClass="body-4" />
        </div>
        <div>
          <div className="mb-2 flex justify-between">
            <p className="caption-4 text-ink-2">{CATS[cur.category]}</p>
            <p className="caption-4 text-ink-2">{answered} of 9 answered</p>
          </div>
          <div className="grid grid-cols-9 gap-1">
            {CHECKS.map((c, i) => (
              <button
                key={c.slug}
                type="button"
                className="seg"
                aria-label={`${c.name}${res[i] ? `, ${RES_LABEL[res[i] as 'p' | 'n' | 'f']}` : ', not answered'}`}
                aria-current={i === idx && !done}
                onClick={() => set({ idx: i, done: false })}
                style={{ background: res[i] ? SEG[res[i] as string] : 'rgba(255,255,255,.18)', boxShadow: i === idx && !done ? '0 0 0 2px #FFFFFF' : undefined }}
              />
            ))}
          </div>
        </div>
      </header>

      {!done ? (
        <>
          <div className="scroll flex flex-1 flex-col gap-6 overflow-auto px-4 pb-4 pt-6">
            <div className="slide" key={idx}>
              <p className="caption-5 text-ink-3">Weight ×{cur.weight.toFixed(1)}</p>
              <h3 className="heading-5 mt-1">{cur.name}</h3>
              <p className="body-6 mt-2 text-ink-2">{cur.help}</p>
            </div>
            <div role="group" aria-label="Result" className="flex flex-col gap-2">
              {(['p', 'n', 'f'] as const).map((k) => {
                const on = res[idx] === k
                return (
                  <button
                    key={k}
                    type="button"
                    className={`res${on ? ` res-${k}` : ''}`}
                    aria-pressed={on}
                    onClick={() => {
                      const r = res.slice()
                      r[idx] = k
                      set({ res: r })
                    }}
                  >
                    <span className="title-2">{RES_LABEL[k]}</span>
                    {on && <CheckIcon className="tick" size={20} aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
            {res[idx] === 'f' && (
              <p className="body-6 rounded-md p-3" style={{ border: `1px solid ${COLORS.fail}`, color: COLORS.failInk }}>
                This opens a follow up for the property when you submit.
              </p>
            )}
          </div>
          <footer className="flex gap-2 px-4 pb-6 pt-3" style={{ background: 'rgba(255,255,255,.08)' }}>
            <button type="button" className="btn btn-quiet button-md" onClick={() => set({ idx: Math.max(0, idx - 1) })} disabled={idx === 0}>
              Previous
            </button>
            <button type="button" className="btn btn-primary button-md flex-1" onClick={next} disabled={!res[idx]}>
              {answered === CHECKS.length ? 'Review and submit' : 'Next check'}
            </button>
          </footer>
        </>
      ) : (
        <div className="slide scroll flex flex-1 flex-col items-center gap-4 overflow-auto px-4 py-6 text-center">
          <ScoreSeal size={160} stroke={6} cats={sc.c} score={sc.s == null ? '–' : sc.s.toFixed(1)} label={label} scoreClass="heading-3" />
          <h3 className="heading-5">Ready to submit</h3>
          <p className="body-6 text-ink-2">
            Last visit scored {previousScore.toFixed(1)}. This one scores {sc.s?.toFixed(1)}
            {count('f') ? ` and opens ${count('f')} follow up${count('f') > 1 ? 's' : ''}.` : ' with no fails.'}
          </p>
          <div className="grid w-full grid-cols-3 gap-2">
            {[
              { n: count('p'), l: 'Pass', color: undefined },
              { n: count('n'), l: 'Needs work', color: undefined },
              { n: count('f'), l: 'Fail', color: count('f') ? COLORS.fail : undefined },
            ].map((t) => (
              <div key={t.l} className="rounded-md py-3" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)' }}>
                <p className="heading-5" style={{ color: t.color }}>
                  {t.n}
                </p>
                <p className="caption-5 text-ink-2">{t.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-auto flex w-full gap-2">
            <button type="button" className="btn btn-quiet button-md" onClick={() => set({ done: false, idx: 0 })}>
              Review answers
            </button>
            <button type="button" className="btn btn-primary button-md flex-1" onClick={onSubmit} disabled={!onSubmit || submitting}>
              {submitting ? 'Submitting' : 'Submit inspection'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

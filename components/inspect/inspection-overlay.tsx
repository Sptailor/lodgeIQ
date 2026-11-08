'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/components/app/AppState'
import { CHECK_COUNT, CHECKS } from '@/lib/domain/checks'
import { DEFAULT_SAMPLE_ANSWERS, SAMPLE_ANSWERS } from '@/lib/domain/sample-data'
import { latest } from '@/lib/domain/derive'
import { PhoneChecklist, type Draft } from './phone-checklist'

const blank = (): Draft => ({ idx: 0, res: Array(CHECK_COUNT).fill(null), photos: Array.from({ length: CHECK_COUNT }, () => []), done: false })

/**
 * The inspection over the property page: an explainer on the left, the inspector's phone on the right.
 * Answers are kept as a draft in this browser while you work, so "Saved on this phone" is true.
 */
export function InspectionOverlay({ id }: { id: string }) {
  const { state, user, isDemo, ui, submitInspection } = useAppState()
  const router = useRouter()
  const p = state.properties.find((x) => x.id === id)
  const [draft, setDraft] = useState<Draft>(blank)
  const [submitting, setSubmitting] = useState(false)
  const key = `lodgeiq-draft-v1:${user.id}:${id}`

  // Restore a saved draft, if there is one.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const d = JSON.parse(raw)
        if (Array.isArray(d.res) && d.res.length === CHECK_COUNT && Array.isArray(d.photos)) setDraft(d)
      }
    } catch {
      // Storage may be blocked. The checklist still works.
    }
  }, [key])

  const update = (d: Draft) => {
    setDraft(d)
    try {
      localStorage.setItem(key, JSON.stringify(d))
    } catch {
      // ignore
    }
  }

  const fillSample = () => {
    // As the board does: each check that is not a pass gets its sample photo, when it has one.
    const res = (SAMPLE_ANSWERS[id] ?? DEFAULT_SAMPLE_ANSWERS).split('')
    const photos = res.map((r, i) => (r !== 'p' && CHECKS[i].evidence ? [CHECKS[i].evidence as string] : []))
    update({ idx: CHECK_COUNT - 1, res, photos, done: true })
  }

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    const r = await submitInspection(id, draft.res.join(''), draft.photos)
    if (r.ok) {
      try {
        localStorage.removeItem(key)
      } catch {
        // ignore
      }
      router.push(`/app/properties/${id}`)
    } else setSubmitting(false)
  }

  const close = () => router.push(`/app/properties/${id}`)

  // Escape closes the inspection, unless search, activity or plan a visit is open on top of it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !ui.paletteOpen && !ui.bellOpen && !ui.planFor) router.push(`/app/properties/${id}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ui.paletteOpen, ui.bellOpen, ui.planFor, router, id])

  if (!p) return null

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center gap-16 p-6 max-md:p-0"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="fade flex w-[320px] flex-col gap-4 max-md:hidden">
        <h2 className="heading-4">Your inspector&apos;s phone</h2>
        <p className="body-3 text-ink-2">Answer each check the way an inspector would on site at {p.name}. Answers save as you go, even without signal.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {isDemo && (
            <button type="button" className="btn btn-quiet button-md" onClick={fillSample}>
              Fill in sample answers
            </button>
          )}
          <button type="button" className="btn btn-ghost button-md" onClick={close}>
            Close
          </button>
        </div>
        <p className="caption-5 text-ink-3">Esc also closes it. Nothing is submitted until you press Submit.</p>
      </div>
      <PhoneChecklist propertyId={id} propertyName={p.name} previousScore={latest(p).score} draft={draft} setDraft={update} onSubmit={submit} submitting={submitting} />
    </div>
  )
}

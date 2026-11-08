'use client'

/**
 * App state.
 *
 * The server loads a PortfolioSnapshot and passes it here as the starting state.
 * Everything in the UI reads from this state and changes it through the actions below.
 *
 * - Demo account: actions only change state in this tab. State is kept in
 *   sessionStorage so a reload keeps your changes, and a new tab starts fresh.
 * - Real accounts: actions call the API first, then update state with what the server returns.
 *
 * Both paths use the same pure rules (lib/domain/derive.ts), so they behave the same.
 */

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { ACTOR_COLORS, SAMPLE_ACTIVITY } from '@/lib/domain/sample-data'
import { startOfUtcDay, weekdayDayMonth } from '@/lib/domain/format'
import { applyInspection, latest, submitBanner } from '@/lib/domain/derive'
import { fullScore } from '@/lib/domain/checks'
import type { Check, FollowUp, InspectionSummary, Note, Person, PortfolioSnapshot, Property, Visit } from '@/lib/domain/types'

export type Mutable = {
  properties: Property[]
  followUps: FollowUp[]
  visits: Visit[]
  notes: Note[]
  banners: Record<string, string> // propertyId -> text shown after submitting an inspection
  plannedVisitIds: string[] // visits planned in this session
  guide: boolean[] // four demo tour steps
  guideHidden: boolean
  guideOpen: boolean
}

type Action =
  | { type: 'restore'; state: Mutable }
  | { type: 'submitted'; propertyId: string; inspection: InspectionSummary; followUps: FollowUp[]; banner: string; photo: string | null }
  | { type: 'followUp'; followUp: FollowUp }
  | { type: 'visit'; visit: Visit; removeIds: string[] }
  | { type: 'guide'; index: number }
  | { type: 'guideHidden' }
  | { type: 'guideOpen' }
  | { type: 'noteRead'; id: string }
  | { type: 'notesRead' }
  | { type: 'noteAdd'; note: Note }

export const initialMutable = (s: PortfolioSnapshot): Mutable => ({
  properties: s.properties,
  followUps: s.followUps,
  visits: s.visits,
  notes: s.notes,
  banners: {},
  plannedVisitIds: [],
  guide: [false, false, false, false],
  guideHidden: false,
  guideOpen: false,
})

function reducer(state: Mutable, a: Action): Mutable {
  switch (a.type) {
    case 'restore':
      return a.state
    case 'submitted': {
      const guide = state.guide.slice()
      guide[1] = true
      return {
        ...state,
        properties: state.properties.map((p) =>
          p.id === a.propertyId ? { ...p, photo: p.photo ?? a.photo, inspections: [...p.inspections, a.inspection] } : p
        ),
        followUps: [...a.followUps, ...state.followUps.filter((f) => f.propertyId !== a.propertyId)],
        banners: { ...state.banners, [a.propertyId]: a.banner },
        guide,
      }
    }
    case 'followUp': {
      const guide = state.guide.slice()
      if (a.followUp.status === 'progress') guide[2] = true
      return { ...state, followUps: state.followUps.map((f) => (f.id === a.followUp.id ? a.followUp : f)), guide }
    }
    case 'visit':
      return {
        ...state,
        visits: [...state.visits.filter((v) => !a.removeIds.includes(v.id)), a.visit],
        plannedVisitIds: [...state.plannedVisitIds, a.visit.id],
      }
    case 'guide': {
      if (state.guide[a.index]) return state
      const guide = state.guide.slice()
      guide[a.index] = true
      return { ...state, guide }
    }
    case 'guideHidden':
      return { ...state, guideHidden: true }
    case 'guideOpen':
      return { ...state, guideOpen: !state.guideOpen }
    case 'noteRead':
      return { ...state, notes: state.notes.map((n) => (n.id === a.id ? { ...n, unread: false } : n)) }
    case 'notesRead':
      return { ...state, notes: state.notes.map((n) => ({ ...n, unread: false })) }
    case 'noteAdd':
      return { ...state, notes: [a.note, ...state.notes].slice(0, 12) }
    default:
      return state
  }
}

export type SubmitResult = { ok: boolean; error?: string; score?: number; improved?: boolean }

type Ctx = {
  user: PortfolioSnapshot['user']
  checks: Check[]
  people: Person[]
  weekStart: string
  isDemo: boolean
  state: Mutable
  now: Date
  ready: boolean // true once the browser has taken over (client clock, saved state)
  reducedMotion: boolean
  submitInspection: (propertyId: string, results: string, photos: string[][]) => Promise<SubmitResult>
  assignFollowUp: (id: string, owner: string) => Promise<boolean>
  resolveFollowUp: (id: string) => Promise<boolean>
  placeVisit: (args: { propertyId: string; inspectorId: string; date: string; visitId?: string }) => Promise<boolean>
  markGuide: (index: number) => void
  hideGuide: () => void
  toggleGuideSteps: () => void
  readNote: (id: string) => void
  readAllNotes: () => void
  resetDemo: () => void
  toast: { id: number; text: string } | null
  showToast: (text: string) => void
  confetti: number | null
  ui: {
    paletteOpen: boolean
    setPaletteOpen: (open: boolean) => void
    bellOpen: boolean
    setBellOpen: (open: boolean) => void
    planFor: string | null
    openPlan: (propertyId: string) => void
    closePlan: () => void
  }
}

const AppContext = createContext<Ctx | null>(null)

export function useAppState(): Ctx {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}

const STORAGE_KEY = 'lodgeiq-demo-v1'
const READ_KEY = (userId: string) => `lodgeiq-notes-read-v1:${userId}`

async function callApi<T>(url: string, method: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: typeof data.error === 'string' ? data.error : 'Something went wrong' }
    return { ok: true, data: data as T }
  } catch {
    return { ok: false, error: 'You appear to be offline. Try again.' }
  }
}

export function AppStateProvider({ snapshot, children }: { snapshot: PortfolioSnapshot; children: React.ReactNode }) {
  const isDemo = snapshot.user.isDemo
  const [state, dispatch] = useReducer(reducer, snapshot, initialMutable)
  const stateRef = useRef(state)
  stateRef.current = state

  const [now, setNow] = useState(() => new Date(snapshot.takenAt))
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const [confetti, setConfetti] = useState<number | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [planFor, setPlanFor] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()
  const confettiTimer = useRef<ReturnType<typeof setTimeout>>()
  const toastCount = useRef(0)
  const simCount = useRef(5)
  const takenDay = snapshot.takenAt.slice(0, 10)

  // Take over in the browser: client clock, motion preference and saved state.
  useEffect(() => {
    setNow(new Date())
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    try {
      if (isDemo) {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          if (saved?.version === 1 && saved.takenDay === takenDay && saved.mutable) dispatch({ type: 'restore', state: saved.mutable })
        }
      } else {
        const read: string[] = JSON.parse(localStorage.getItem(READ_KEY(snapshot.user.id)) ?? '[]')
        read.forEach((id) => dispatch({ type: 'noteRead', id }))
      }
    } catch {
      // Storage can be blocked (private windows). The app still works without it.
    }
    setReady(true)
    const tick = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(tick)
  }, [isDemo, takenDay, snapshot.user.id])

  // Keep demo changes for this tab.
  useEffect(() => {
    if (!ready || !isDemo) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, takenDay, mutable: state }))
    } catch {
      // ignore
    }
  }, [state, ready, isDemo, takenDay])

  // Remember which activity a real user has read.
  useEffect(() => {
    if (!ready || isDemo) return
    try {
      localStorage.setItem(READ_KEY(snapshot.user.id), JSON.stringify(state.notes.filter((n) => !n.unread).map((n) => n.id)))
    } catch {
      // ignore
    }
  }, [state.notes, ready, isDemo, snapshot.user.id])

  // Demo only: new field activity arrives every 15 seconds.
  useEffect(() => {
    if (!isDemo || !ready) return
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      const n = simCount.current++
      const ev = SAMPLE_ACTIVITY[n % SAMPLE_ACTIVITY.length]
      dispatch({
        type: 'noteAdd',
        note: { id: `sim-${n}`, initials: ev.initials, actor: ev.actor, text: ev.text, propertyId: ev.propertyId, color: ACTOR_COLORS[ev.initials] ?? '#FFFFFF', at: new Date().toISOString(), unread: true },
      })
    }, 15000)
    return () => clearInterval(id)
  }, [isDemo, ready])

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current)
      clearTimeout(confettiTimer.current)
    },
    []
  )

  const showToast = useCallback((text: string) => {
    clearTimeout(toastTimer.current)
    setToast({ id: ++toastCount.current, text })
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }, [])

  const markGuide = useCallback((index: number) => dispatch({ type: 'guide', index }), [])

  const submitInspection: Ctx['submitInspection'] = async (propertyId, results, photos) => {
    const s = stateRef.current
    const p = s.properties.find((x) => x.id === propertyId)
    if (!p) return { ok: false, error: 'Property not found' }
    const previousScore = latest(p).score
    let inspection: InspectionSummary
    let propertyFollowUps: FollowUp[]
    let counts: { closed: number; improved: number; opened: number }

    if (isDemo) {
      const when = new Date()
      const { cats, score } = fullScore(results)
      inspection = { id: `demo-${when.getTime()}`, date: when.toISOString(), inspector: snapshot.user.name, score, cats, res: results }
      const r = applyInspection(s.followUps, propertyId, results, photos, when)
      propertyFollowUps = r.followUps.filter((f) => f.propertyId === propertyId)
      counts = r
    } else {
      const r = await callApi<{ inspection: InspectionSummary; followUps: FollowUp[]; closed: number; improved: number; opened: number }>('/api/inspections', 'POST', { propertyId, results, photos })
      if (!r.ok) {
        showToast(r.error)
        return { ok: false, error: r.error }
      }
      inspection = r.data.inspection
      propertyFollowUps = r.data.followUps
      counts = r.data
    }

    dispatch({
      type: 'submitted',
      propertyId,
      inspection,
      followUps: propertyFollowUps,
      banner: submitBanner(inspection.score, previousScore, counts),
      photo: p.photo ? null : (photos.flat().find(Boolean) ?? null),
    })
    const improved = inspection.score > previousScore
    if (improved && !reducedMotion) {
      clearTimeout(confettiTimer.current)
      setConfetti(Date.now())
      confettiTimer.current = setTimeout(() => setConfetti(null), 2000)
    }
    showToast(`Inspection submitted for ${p.name}`)
    return { ok: true, score: inspection.score, improved }
  }

  const assignFollowUp: Ctx['assignFollowUp'] = async (id, owner) => {
    const f = stateRef.current.followUps.find((x) => x.id === id)
    if (!f) return false
    let next: FollowUp = { ...f, status: 'progress', owner, isNew: false }
    if (!isDemo) {
      const r = await callApi<{ followUp: FollowUp }>(`/api/follow-ups/${id}`, 'PATCH', { action: 'assign', owner })
      if (!r.ok) {
        showToast(r.error)
        return false
      }
      next = r.data.followUp
    }
    dispatch({ type: 'followUp', followUp: next })
    showToast(`Assigned to ${owner}. It is now under Being fixed.`)
    return true
  }

  const resolveFollowUp: Ctx['resolveFollowUp'] = async (id) => {
    const f = stateRef.current.followUps.find((x) => x.id === id)
    if (!f) return false
    let next: FollowUp = { ...f, status: 'done', note: 'Marked as fixed. The next inspection confirms it.' }
    if (!isDemo) {
      const r = await callApi<{ followUp: FollowUp }>(`/api/follow-ups/${id}`, 'PATCH', { action: 'resolve' })
      if (!r.ok) {
        showToast(r.error)
        return false
      }
      next = r.data.followUp
    }
    dispatch({ type: 'followUp', followUp: next })
    showToast('Marked as fixed. It is now under Fixed.')
    return true
  }

  const placeVisit: Ctx['placeVisit'] = async ({ propertyId, inspectorId, date, visitId }) => {
    const s = stateRef.current
    const p = s.properties.find((x) => x.id === propertyId)
    const person = snapshot.people.find((x) => x.id === inspectorId)
    if (!p || !person) return false
    const day = new Date(startOfUtcDay(new Date(date)).getTime() + 9 * 3600000).toISOString()
    let visit: Visit = { id: visitId ?? `v-${Date.now()}`, propertyId, inspectorId, date: day, planned: true }
    if (!isDemo) {
      const r = visitId
        ? await callApi<{ visit: Visit }>(`/api/visits/${visitId}`, 'PATCH', { inspectorId, date: day })
        : await callApi<{ visit: Visit }>('/api/visits', 'POST', { propertyId, inspectorId, date: day })
      if (!r.ok) {
        showToast(r.error)
        return false
      }
      visit = { ...r.data.visit, planned: true }
    }
    const removeIds = visitId ? [visitId] : s.visits.filter((v) => v.propertyId === propertyId).map((v) => v.id)
    dispatch({ type: 'visit', visit, removeIds })
    showToast(`${p.name} planned for ${weekdayDayMonth(day)} with ${person.name}`)
    return true
  }

  const resetDemo = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    dispatch({ type: 'restore', state: initialMutable(snapshot) })
    showToast('Demo reset to its starting point')
  }

  const value: Ctx = {
    user: snapshot.user,
    checks: snapshot.checks,
    people: snapshot.people,
    weekStart: snapshot.weekStart,
    isDemo,
    state,
    now,
    ready,
    reducedMotion,
    submitInspection,
    assignFollowUp,
    resolveFollowUp,
    placeVisit,
    markGuide,
    hideGuide: () => dispatch({ type: 'guideHidden' }),
    toggleGuideSteps: () => dispatch({ type: 'guideOpen' }),
    readNote: (id) => dispatch({ type: 'noteRead', id }),
    readAllNotes: () => dispatch({ type: 'notesRead' }),
    resetDemo,
    toast,
    showToast,
    confetti,
    ui: {
      paletteOpen,
      setPaletteOpen,
      bellOpen,
      setBellOpen,
      planFor,
      openPlan: (id) => setPlanFor(id),
      closePlan: () => setPlanFor(null),
    },
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}


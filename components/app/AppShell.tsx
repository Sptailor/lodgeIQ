'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAppState } from './AppState'
import { CommandPalette } from './CommandPalette'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const MainRefContext = createContext<React.RefObject<HTMLElement> | null>(null)

/** The scrolling main element. Dropdowns measure against it to decide whether to open up or down. */
export function useMainRef() {
  const ref = useContext(MainRefContext)
  if (!ref) throw new Error('useMainRef must be used inside AppShell')
  return ref
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const { ui } = useAppState()

  // Ctrl K (or Cmd K) toggles search. Escape closes the top most overlay: activity, search, then plan a visit.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        ui.setPaletteOpen(!ui.paletteOpen)
        return
      }
      if (e.key !== 'Escape') return
      if (ui.bellOpen) ui.setBellOpen(false)
      else if (ui.paletteOpen) ui.setPaletteOpen(false)
      else if (ui.planFor) ui.closePlan()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ui])

  // Start each page at the top.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <MainRefContext.Provider value={mainRef}>
      <div className="lq flex h-screen min-h-[640px] overflow-hidden bg-page tabular-nums text-ink">
        <Sidebar />
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <Header />
          <main ref={mainRef} className="scroll relative min-h-0 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <CommandPalette />
      </div>
    </MainRefContext.Provider>
  )
}

'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
      </div>
    </MainRefContext.Provider>
  )
}

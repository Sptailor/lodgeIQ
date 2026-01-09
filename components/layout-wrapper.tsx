'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function MainContentWrapper({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={cn(
        'transition-all duration-300 lg:pt-16',
        isCollapsed ? 'lg:pl-0' : 'lg:pl-64'
      )}
    >
      {children}
    </div>
  )
}

'use client'

import { useState, createContext, useContext } from 'react'
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

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div
        className={cn(
          'transition-all duration-300',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

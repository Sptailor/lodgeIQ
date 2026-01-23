'use client'

import { useState, createContext, useContext, ReactNode, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  headerHidden: boolean
  setHeaderHidden: (hidden: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  headerHidden: false,
  setHeaderHidden: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, headerHidden, setHeaderHidden }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function MainContentWrapper({ children }: { children: ReactNode }) {
  const { isCollapsed, headerHidden } = useSidebar()

  return (
    <motion.div
      initial={false}
      animate={{
        paddingLeft: isCollapsed ? 0 : 256,
        paddingTop: headerHidden ? 0 : 64,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="lg:!pt-16 max-lg:!pl-0"
    >
      {children}
    </motion.div>
  )
}

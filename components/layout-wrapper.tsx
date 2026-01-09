'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={false}
      animate={{
        paddingLeft: isCollapsed ? 0 : 256,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="lg:pt-16"
    >
      {children}
    </motion.div>
  )
}

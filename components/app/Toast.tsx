'use client'

import { CheckIcon } from '@/components/shared/icon'
import { useAppState } from './AppState'

/** A white pill at the bottom centre. A bar shows how long it stays (4 seconds). */
export function Toast() {
  const { toast } = useAppState()
  if (!toast) return null
  return (
    <div
      key={toast.id}
      role="status"
      className="toast body-5 fixed bottom-8 left-1/2 z-40 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-6 py-3"
      style={{ background: '#FFFFFF', color: '#000000' }}
    >
      <CheckIcon size={16} color="#0B7378" aria-hidden="true" />
      {toast.text}
      <span className="tbar" aria-hidden="true" />
    </div>
  )
}

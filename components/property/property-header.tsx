'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppState } from '@/components/app/AppState'
import { ImageIcon } from '@/components/shared/icon'
import type { Property } from '@/lib/domain/types'

/** The cover photo, name, and the two main actions. */
export function PropertyHeader({ property: p }: { property: Property }) {
  const { ui } = useAppState()
  return (
    <div className="relative h-[240px] overflow-hidden rounded-xl" style={{ background: 'rgba(255,255,255,.08)' }}>
      {p.photo ? (
        <>
          <Image src={p.photo} alt={p.name} fill sizes="(max-width: 1280px) 100vw, 1100px" className="object-cover" priority />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.48)' }} />
        </>
      ) : (
        <div className="absolute right-6 top-6 flex items-center gap-2 text-ink-3">
          <ImageIcon size={20} aria-hidden="true" />
          <span className="caption-2">No cover photo yet. The next inspection adds one.</span>
        </div>
      )}
      <div className="absolute inset-x-8 bottom-8 flex flex-wrap items-end gap-6" style={{ color: '#FFFFFE' }}>
        <div className="min-w-0 flex-1">
          <span className="caption-3 inline-block rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,.16)' }}>
            {p.kind}
            {p.size ? `, ${p.size}` : ''}
          </span>
          <h1 className="heading-2 mt-3">{p.name}</h1>
          <p className="body-3 mt-2" style={{ color: '#EDEDEC' }}>
            {p.place}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-glass button-md" onClick={() => ui.openPlan(p.id)}>
            Plan a visit
          </button>
          <Link href={`/app/properties/${p.id}/inspect`} className="btn btn-onphoto button-md" data-tour="start" data-tour-place="up">
            Start inspection
          </Link>
        </div>
      </div>
    </div>
  )
}

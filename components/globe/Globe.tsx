'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { HOME } from '@/lib/domain/sample-data'
import { GlobeEngine, type EngineOptions, type GlobeChange, type GlobeData, type GlobeProperty } from './globe-engine'

export type GlobeHandle = {
  goCountry: (code: string) => void
  selectProperty: (id: string) => void
  toWorld: () => void
  zoomIn: () => void
  zoomOut: () => void
  setListHover: (id: string | null) => void
  setHoverCountry: (code: string | null) => void
}

// The map data is about 870 KB. Fetch it once and share it.
let dataPromise: Promise<GlobeData> | null = null
export function loadGlobeData(): Promise<GlobeData> {
  if (!dataPromise) {
    dataPromise = fetch('/geo/globe.json').then((r) => {
      if (!r.ok) throw new Error('Could not load the map')
      return r.json()
    })
    dataPromise.catch(() => {
      dataPromise = null
    })
  }
  return dataPromise
}

/**
 * The interactive globe. React owns the canvas; the engine draws on it.
 * Call the handle to move the camera, and listen to onChange for country and property choices.
 */
export const Globe = forwardRef<GlobeHandle, {
  properties: GlobeProperty[]
  label: string
  initial?: { country?: string; property?: string }
  onChange?: (c: GlobeChange) => void
  options?: Partial<EngineOptions>
}>(function Globe({ properties, label, initial, onChange, options }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GlobeEngine | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const initialRef = useRef(initial)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new GlobeEngine(canvas, {
      home: HOME,
      ...options,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onChange: (c) => onChangeRef.current?.(c),
    })
    engineRef.current = engine
    let alive = true
    loadGlobeData()
      .then((data) => {
        if (!alive) return
        engine.load(data)
        setLoading(false)
        const i = initialRef.current
        if (i?.property) engine.selectProperty(i.property)
        else if (i?.country) engine.goCountry(i.country)
      })
      .catch(() => {
        if (!alive) return
        setLoading(false)
        setFailed(true)
      })
    return () => {
      alive = false
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setProperties(properties)
  }, [properties])

  useImperativeHandle(ref, () => ({
    goCountry: (c) => engineRef.current?.goCountry(c),
    selectProperty: (id) => engineRef.current?.selectProperty(id),
    toWorld: () => engineRef.current?.toWorld(),
    zoomIn: () => engineRef.current?.zoomIn(),
    zoomOut: () => engineRef.current?.zoomOut(),
    setListHover: (id) => engineRef.current?.setListHover(id),
    setHoverCountry: (code) => engineRef.current?.setHoverCountry(code),
  }))

  return (
    <>
      {loading && <div className="sk absolute left-1/2 top-1/2 aspect-square w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />}
      {failed && <p className="body-6 absolute inset-0 flex items-center justify-center text-ink-2">The map could not be loaded. Reload the page to try again.</p>}
      <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 block h-full w-full" style={{ touchAction: 'none', cursor: 'grab' }} />
    </>
  )
})

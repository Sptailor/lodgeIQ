/**
 * The globe: an orthographic projection drawn on a 2D canvas from real map data.
 *
 * Land is drawn as dots (a world layer, plus a denser East Africa layer when zoomed in),
 * country borders from the 110m mesh, animated arcs from the head office, and property pins.
 * This is a framework free port of the prototype's engine. React owns the canvas element
 * and listens to `onChange`; it never reads engine internals.
 *
 * Map data: Natural Earth via world-atlas (ISC licence), prepared into public/geo/globe.json.
 */

const D2R = Math.PI / 180

export type GlobeData = {
  world: number[] // lon, lat pairs
  region: number[] // denser dots for East Africa
  countries: Record<string, { name: string; c: [number, number]; ext: number; rings: number[][] }>
  borders: number[][]
}

export type GlobeProperty = {
  id: string
  name: string
  countryCode: string
  lat: number
  lon: number
  score: number
  attn: boolean
}

export type GlobeTheme = {
  good: string // "r,g,b"
  warn: string // "r,g,b"
  goodHex: string
  warnHex: string
  sphereFill: string
  sphereStroke: string
  pinOutline: string
  labelBg: string
  labelGood: string
  labelWarn: string
  labelGoodLight: string
  labelWarnLight: string
}

/** Colours for the app (mint and amber on solid dark). */
export const APP_THEME: GlobeTheme = {
  good: '111,227,198',
  warn: '255,197,107',
  goodHex: '#6FE3C6',
  warnHex: '#FFC56B',
  sphereFill: 'rgba(255,255,255,0.06)',
  sphereStroke: 'rgba(255,255,255,.18)',
  pinOutline: '#000000',
  labelBg: 'rgba(31,31,31,0.94)',
  labelGood: '#6FE3C6',
  labelWarn: '#FFC56B',
  labelGoodLight: '#0B7378',
  labelWarnLight: '#A16207',
}

export type GlobeChange = { level: string; sel: string | null }

export type EngineOptions = {
  home: { code: string; city: string; lat: number; lon: number }
  theme?: GlobeTheme
  /** Sphere radius as a share of the smaller canvas side. */
  radius?: number
  reducedMotion?: boolean
  /** Slow spin at world level. */
  rotateSpeed?: number
  /** Zoom with the mouse wheel and prevent the page from scrolling over the globe. */
  wheelZoom?: boolean
  /** Click a pin to select it. */
  selectablePins?: boolean
  /** Draw name and score labels on pins and the head office. */
  labels?: boolean
  /** Zoom level used when flying to a country. */
  countryZoom?: (code: string, ext: number) => number
  /** Where to look after a country is chosen. Defaults to the country centre. */
  countryTarget?: (c: [number, number], zoom: number) => [number, number]
  onChange?: (c: GlobeChange) => void
}

type Fly = { t0: number; dur: number; from: { lon: number; lat: number; zoom: number }; to: { lon: number; lat: number; zoom: number }; hop: number }
type Drag = { x: number; y: number; lon: number; lat: number; moved: number }
type Country = GlobeData['countries'][string] & { bb?: number[][] }
type Label = { x: number; y: number; text: string; score: string | null; warn?: boolean; pri: number; light: boolean }

const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Point in polygon test for one ring of lon, lat pairs. */
const pip = (lon: number, lat: number, r: number[]) => {
  let inside = false
  for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
    const xi = r[i]
    const yi = r[i + 1]
    const xj = r[j]
    const yj = r[j + 1]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

const pack = (arr: number[]) => {
  const n = arr.length / 2
  const o = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const lo = arr[2 * i]
    const la = arr[2 * i + 1]
    o[3 * i] = lo * D2R
    o[3 * i + 1] = Math.sin(la * D2R)
    o[3 * i + 2] = Math.cos(la * D2R)
  }
  return o
}

export class GlobeEngine {
  level = 'world'
  sel: string | null = null

  private cv: HTMLCanvasElement
  private o: Required<Pick<EngineOptions, 'radius' | 'rotateSpeed' | 'wheelZoom' | 'selectablePins' | 'labels'>> & EngineOptions
  private theme: GlobeTheme
  private props: GlobeProperty[] = []
  private counts: Record<string, number> = {}
  private cam: { lon: number; lat: number; zoom: number }
  private fly: Fly | null = null
  private drag: Drag | null = null
  private hoverPin: string | null = null
  private hoverCC: string | null = null
  private listHover: string | null = null
  private lastTouch = 0
  private R = 0
  private cx = 0
  private cy = 0
  private pinsXY: { id: string; x: number; y: number }[] = []
  private cursor = 'grab'
  private raf = 0
  private listeners: [string, EventListener, AddEventListenerOptions | undefined][] = []

  private world?: Float32Array
  private region?: Float32Array
  private worldRaw: number[] = []
  private regionRaw: number[] = []
  private regionEdge?: Uint8Array
  private worldInRegion?: Uint8Array
  private worldMark?: Uint8Array
  private regionMark?: Uint8Array
  private countries: Record<string, Country> = {}
  private borders: number[][] = []

  constructor(canvas: HTMLCanvasElement, options: EngineOptions) {
    this.cv = canvas
    this.o = { radius: 0.4, rotateSpeed: 0.025, wheelZoom: true, selectablePins: true, labels: true, ...options }
    this.theme = options.theme ?? APP_THEME
    this.cam = { lon: options.home.lon - 30, lat: 0, zoom: 1 }
    this.on('pointerdown', (e) => this.down(e as PointerEvent))
    this.on('pointermove', (e) => this.move(e as PointerEvent))
    this.on('pointerup', (e) => this.up(e as PointerEvent))
    this.on('pointerleave', () => this.leave())
    if (this.o.wheelZoom) this.on('wheel', (e) => this.wheel(e as WheelEvent), { passive: false })
    const tick = (t: number) => {
      if (document.visibilityState === 'visible') this.frame(t)
      this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  private on(type: string, fn: EventListener, opts?: AddEventListenerOptions) {
    this.cv.addEventListener(type, fn, opts)
    this.listeners.push([type, fn, opts])
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.listeners.forEach(([t, f, o]) => this.cv.removeEventListener(t, f, o))
    this.listeners = []
  }

  get ready() {
    return !!this.world
  }

  /** Give the engine the map data. Call once. */
  load(d: GlobeData) {
    this.world = pack(d.world)
    this.region = pack(d.region)
    this.worldRaw = d.world
    this.regionRaw = d.region
    this.regionEdge = new Uint8Array(d.region.length / 2)
    for (let i = 0; i < d.region.length / 2; i++) {
      const lo = d.region[2 * i]
      const la = d.region[2 * i + 1]
      this.regionEdge[i] = lo < 19 || lo > 57 || la < -19 || la > 19 ? 1 : 0
    }
    this.worldInRegion = new Uint8Array(d.world.length / 2)
    for (let i = 0; i < d.world.length / 2; i++) {
      const lo = d.world[2 * i]
      const la = d.world[2 * i + 1]
      this.worldInRegion[i] = lo >= 19 && lo <= 57 && la >= -19 && la <= 19 ? 1 : 0
    }
    this.countries = d.countries
    this.borders = d.borders
    Object.values(this.countries).forEach((c) => {
      c.bb = c.rings.map((r) => {
        let a = 1e9
        let b = -1e9
        let e = 1e9
        let f = -1e9
        for (let i = 0; i < r.length; i += 2) {
          a = Math.min(a, r[i])
          b = Math.max(b, r[i])
          e = Math.min(e, r[i + 1])
          f = Math.max(f, r[i + 1])
        }
        return [a, b, e, f]
      })
    })
    this.markCountry(this.level === 'world' ? null : this.level)
    this.flyTo(this.o.home.lon, Math.max(-20, Math.min(20, this.cam.lat)), 1, 1600)
  }

  /** Update the pins (names, scores and attention state). */
  setProperties(props: GlobeProperty[]) {
    this.props = props
    this.counts = {}
    props.forEach((p) => {
      this.counts[p.countryCode] = (this.counts[p.countryCode] || 0) + 1
    })
  }

  setListHover(id: string | null) {
    this.listHover = id
  }

  setHoverCountry(code: string | null) {
    this.hoverCC = code
  }

  private emit() {
    this.o.onChange?.({ level: this.level, sel: this.sel })
  }

  private inCountry(code: string, lon: number, lat: number) {
    const c = this.countries[code]
    if (!c || !c.bb) return false
    for (let i = 0; i < c.rings.length; i++) {
      const b = c.bb[i]
      if (lon < b[0] || lon > b[1] || lat < b[2] || lat > b[3]) continue
      if (pip(lon, lat, c.rings[i])) return true
    }
    return false
  }

  private markCountry(code: string | null) {
    if (!this.world) return
    const m = (raw: number[]) => {
      const n = raw.length / 2
      const o = new Uint8Array(n)
      if (code) for (let i = 0; i < n; i++) o[i] = this.inCountry(code, raw[2 * i], raw[2 * i + 1]) ? 1 : 0
      return o
    }
    this.worldMark = m(this.worldRaw)
    this.regionMark = m(this.regionRaw)
  }

  flyTo(lon: number, lat: number, zoom: number, dur: number) {
    const dl = ((lon - this.cam.lon + 540) % 360) - 180
    const far = Math.abs(dl) + Math.abs(lat - this.cam.lat)
    this.fly = {
      t0: performance.now(),
      dur: this.o.reducedMotion ? 1 : dur,
      from: { lon: this.cam.lon, lat: this.cam.lat, zoom: this.cam.zoom },
      to: { lon: this.cam.lon + dl, lat, zoom },
      hop: far > 40 && zoom > 1.5 ? 0.45 : 0,
    }
  }

  goCountry(code: string) {
    const c = this.countries[code]
    if (!c) return
    const z = this.o.countryZoom ? this.o.countryZoom(code, c.ext) : code === 'KEN' ? 6 : Math.max(1.6, Math.min(7, 55 / c.ext))
    this.markCountry(code)
    this.level = code
    this.sel = null
    const [lo, la] = this.o.countryTarget ? this.o.countryTarget(c.c, z) : c.c
    this.flyTo(lo, la, z, 1700)
    this.emit()
  }

  selectProperty(id: string) {
    const p = this.props.find((x) => x.id === id)
    if (!p) return
    if (this.level !== p.countryCode) {
      this.markCountry(p.countryCode)
      this.level = p.countryCode
    }
    this.sel = id
    const z = p.countryCode === 'KEN' || p.countryCode === 'TZA' ? Math.max(this.cam.zoom, 8) : Math.max(this.cam.zoom, 4)
    this.flyTo(p.lon, p.lat, z, 1100)
    this.emit()
  }

  toWorld() {
    this.level = 'world'
    this.sel = null
    this.markCountry(null)
    this.flyTo(this.o.home.lon, 0, 1, 1400)
    this.emit()
  }

  zoomIn() {
    this.flyTo(this.cam.lon, this.cam.lat, Math.min(12, this.cam.zoom * 1.8), 500)
  }

  zoomOut() {
    this.flyTo(this.cam.lon, this.cam.lat, Math.max(1, this.cam.zoom / 1.8), 500)
  }

  private setCursor(c: string) {
    if (c !== this.cursor) {
      this.cursor = c
      this.cv.style.cursor = c
    }
  }

  private down(e: PointerEvent) {
    this.drag = { x: e.clientX, y: e.clientY, lon: this.cam.lon, lat: this.cam.lat, moved: 0 }
    this.fly = null
    try {
      this.cv.setPointerCapture(e.pointerId)
    } catch {
      // Some browsers refuse capture for synthetic events. Dragging still works.
    }
  }

  private move(e: PointerEvent) {
    const r = this.cv.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top
    if (this.drag) {
      const dx = e.clientX - this.drag.x
      const dy = e.clientY - this.drag.y
      this.drag.moved = Math.max(this.drag.moved, Math.abs(dx) + Math.abs(dy))
      const R = this.R || 300
      this.cam.lon = this.drag.lon - dx / R / D2R
      this.cam.lat = Math.max(-75, Math.min(75, this.drag.lat + dy / R / D2R))
      this.lastTouch = performance.now()
      return
    }
    this.hitTest(px, py)
  }

  private up(e: PointerEvent) {
    const d = this.drag
    this.drag = null
    if (d && d.moved < 5) {
      const r = this.cv.getBoundingClientRect()
      this.hitTest(e.clientX - r.left, e.clientY - r.top)
      if (this.hoverPin && this.o.selectablePins) this.selectProperty(this.hoverPin)
      else if (this.hoverCC && this.counts[this.hoverCC]) this.goCountry(this.hoverCC)
    }
  }

  private leave() {
    this.hoverPin = null
    this.hoverCC = null
    if (!this.drag) this.setCursor('grab')
  }

  private wheel(e: WheelEvent) {
    e.preventDefault()
    this.fly = null
    this.cam.zoom = Math.max(1, Math.min(12, this.cam.zoom * Math.exp(-e.deltaY * 0.0015)))
    this.lastTouch = performance.now()
  }

  private hitTest(px: number, py: number) {
    let best: string | null = null
    let bd = 14
    this.pinsXY.forEach((q) => {
      const dd = Math.hypot(q.x - px, q.y - py)
      if (dd < bd) {
        bd = dd
        best = q.id
      }
    })
    this.hoverPin = best
    this.hoverCC = null
    if (!best && this.R) {
      const x = (px - this.cx) / this.R
      const y = (this.cy - py) / this.R
      const rho = Math.hypot(x, y)
      if (rho < 1 && rho > 0) {
        const cc = Math.asin(rho)
        const sp = Math.sin(this.cam.lat * D2R)
        const cp = Math.cos(this.cam.lat * D2R)
        const lat = Math.asin(Math.cos(cc) * sp + (y * Math.sin(cc) * cp) / rho) / D2R
        const lon = this.cam.lon + Math.atan2(x * Math.sin(cc), rho * Math.cos(cc) * cp - y * Math.sin(cc) * sp) / D2R
        const L = ((lon + 540) % 360) - 180
        for (const k of Object.keys(this.counts)) {
          if (this.inCountry(k, L, lat)) {
            this.hoverCC = k
            break
          }
        }
      }
    }
    this.setCursor(best || this.hoverCC ? 'pointer' : 'grab')
  }

  private frame(t: number) {
    const cv = this.cv
    if (!cv.isConnected) return
    const dpr = window.devicePixelRatio || 1
    const W = cv.clientWidth
    const H = cv.clientHeight
    if (!W || !H) return
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
    }
    const ctx = cv.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    if (!this.world || !this.region || !this.worldInRegion || !this.regionEdge) return
    const th = this.theme
    const home = this.o.home
    const reduce = !!this.o.reducedMotion

    if (this.fly) {
      const f = this.fly
      const k = Math.min(1, (t - f.t0) / f.dur)
      const e = easeIO(Math.max(0, k))
      this.cam.lon = f.from.lon + (f.to.lon - f.from.lon) * e
      this.cam.lat = f.from.lat + (f.to.lat - f.from.lat) * e
      const zl = Math.exp(Math.log(f.from.zoom) + (Math.log(f.to.zoom) - Math.log(f.from.zoom)) * e)
      this.cam.zoom = Math.max(0.85, zl * (1 - f.hop * Math.sin(Math.PI * Math.max(0, k))))
      if (k >= 1) this.fly = null
    } else if (!this.drag && !reduce && this.level === 'world' && !this.hoverPin && !this.hoverCC && !(this.lastTouch && t - this.lastTouch < 4000)) {
      this.cam.lon += this.o.rotateSpeed
    }

    const z = this.cam.zoom
    const R = Math.min(W, H) * this.o.radius * z
    const cx = W / 2
    const cy = H / 2
    this.R = R
    this.cx = cx
    this.cy = cy

    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fillStyle = th.sphereFill
    ctx.fill()
    ctx.strokeStyle = th.sphereStroke
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.clip()

    const sp = Math.sin(this.cam.lat * D2R)
    const cp = Math.cos(this.cam.lat * D2R)
    const l0 = this.cam.lon * D2R
    const useRegion = z >= 2.6

    const drawLayer = (pts: Float32Array, mark: Uint8Array | undefined, skip: Uint8Array | null, spacingRad: number, fade: Uint8Array | null) => {
      const s = Math.max(1, Math.min(3.4, spacingRad * R * 0.42))
      const buckets: number[][] = [[], [], [], []]
      const n = pts.length / 3
      for (let i = 0; i < n; i++) {
        if (skip && skip[i]) continue
        const d = pts[3 * i] - l0
        const cd = Math.cos(d)
        const sL = pts[3 * i + 1]
        const cL = pts[3 * i + 2]
        const zz = sp * sL + cp * cL * cd
        if (zz <= 0) continue
        const x = cx + R * cL * Math.sin(d)
        const y = cy - R * (cp * sL - sp * cL * cd)
        if (x < -4 || y < -4 || x > W + 4 || y > H + 4) continue
        buckets[mark && mark[i] ? 3 : fade && fade[i] ? 0 : zz > 0.66 ? 2 : zz > 0.33 ? 1 : 0].push(x - s / 2, y - s / 2)
      }
      const cols = ['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.34)', 'rgba(255,255,255,0.56)', `rgba(${th.good},0.95)`]
      for (let b = 0; b < 4; b++) {
        const a = buckets[b]
        if (!a.length) continue
        ctx.fillStyle = cols[b]
        ctx.beginPath()
        for (let i = 0; i < a.length; i += 2) ctx.rect(a[i], a[i + 1], s, s)
        ctx.fill()
      }
    }
    drawLayer(this.world, this.worldMark, useRegion ? this.worldInRegion : null, 0.0145, null)
    if (useRegion) drawLayer(this.region, this.regionMark, null, 0.00314, this.regionEdge)

    const P = (lo: number, la: number): [number, number, number] => {
      const d = lo * D2R - l0
      const cL = Math.cos(la * D2R)
      const sL = Math.sin(la * D2R)
      const cd = Math.cos(d)
      return [cx + R * cL * Math.sin(d), cy - R * (cp * sL - sp * cL * cd), sp * sL + cp * cL * cd]
    }

    ctx.lineWidth = 1
    ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.3, 0.08 + z * 0.04).toFixed(2)})`
    ctx.beginPath()
    this.borders.forEach((ln) => {
      let pen = false
      for (let i = 0; i < ln.length; i += 2) {
        const q = P(ln[i], ln[i + 1])
        if (q[2] <= 0) {
          pen = false
          continue
        }
        if (pen) ctx.lineTo(q[0], q[1])
        else {
          ctx.moveTo(q[0], q[1])
          pen = true
        }
      }
    })
    ctx.stroke()

    const outline = (code: string, fill: string | null, stroke: string, w: number) => {
      const c = this.countries[code]
      if (!c) return
      ctx.beginPath()
      c.rings.forEach((r) => {
        let pen = false
        for (let i = 0; i < r.length; i += 2) {
          const q = P(r[i], r[i + 1])
          if (q[2] <= 0) {
            pen = false
            continue
          }
          if (pen) ctx.lineTo(q[0], q[1])
          else {
            ctx.moveTo(q[0], q[1])
            pen = true
          }
        }
        ctx.closePath()
      })
      if (fill) {
        ctx.fillStyle = fill
        ctx.fill()
      }
      ctx.strokeStyle = stroke
      ctx.lineWidth = w
      ctx.stroke()
    }
    const lvl = this.level
    if (this.hoverCC && this.hoverCC !== lvl) outline(this.hoverCC, `rgba(${th.good},0.08)`, `rgba(${th.good},0.6)`, 1.2)
    if (lvl !== 'world') outline(lvl, `rgba(${th.good},0.12)`, th.goodHex, 1.8)
    ctx.restore()

    const LB: Label[] = []

    // Arcs from the head office, drawn only on the visible side of the globe.
    if (z < 2.4) {
      const hv = [Math.cos(home.lat * D2R) * Math.cos(home.lon * D2R), Math.cos(home.lat * D2R) * Math.sin(home.lon * D2R), Math.sin(home.lat * D2R)]
      ctx.setLineDash([4, 8])
      ctx.lineDashOffset = reduce ? 0 : -t / 40
      ctx.lineWidth = 1.2
      this.props.forEach((p) => {
        if (p.countryCode === home.code) return
        const pv = [Math.cos(p.lat * D2R) * Math.cos(p.lon * D2R), Math.cos(p.lat * D2R) * Math.sin(p.lon * D2R), Math.sin(p.lat * D2R)]
        const om = Math.acos(Math.max(-1, Math.min(1, hv[0] * pv[0] + hv[1] * pv[1] + hv[2] * pv[2])))
        if (om < 0.02) return
        ctx.strokeStyle = p.attn ? `rgba(${th.warn},0.6)` : `rgba(${th.good},0.5)`
        ctx.beginPath()
        let pen = false
        for (let i = 0; i <= 40; i++) {
          const f = i / 40
          const a = Math.sin((1 - f) * om) / Math.sin(om)
          const b = Math.sin(f * om) / Math.sin(om)
          const v = [a * hv[0] + b * pv[0], a * hv[1] + b * pv[1], a * hv[2] + b * pv[2]]
          const la = Math.asin(v[2])
          const lo = Math.atan2(v[1], v[0])
          const lift = 1 + 0.18 * Math.sin(Math.PI * f) * Math.min(1, om)
          const d = lo - l0
          const cL = Math.cos(la)
          const sL = Math.sin(la)
          const cd = Math.cos(d)
          const zz = sp * sL + cp * cL * cd
          const x = cx + R * lift * cL * Math.sin(d)
          const y = cy - R * lift * (cp * sL - sp * cL * cd)
          if (zz <= 0) {
            pen = false
            continue
          }
          if (pen) ctx.lineTo(x, y)
          else {
            ctx.moveTo(x, y)
            pen = true
          }
        }
        ctx.stroke()
      })
      ctx.setLineDash([])
    }

    // Head office marker.
    const hq = P(home.lon, home.lat)
    if (hq[2] > 0) {
      ctx.save()
      ctx.translate(hq[0], hq[1])
      ctx.rotate(Math.PI / 4)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(-5, -5, 10, 10)
      ctx.restore()
      if (this.o.labels && (z < 2.4 || lvl === home.code)) LB.push({ x: hq[0], y: hq[1], text: `Head office, ${home.city}`, score: null, pri: 0.5, light: true })
    }

    // Property pins.
    this.pinsXY = []
    const showLabels = z >= 3.5
    this.props.forEach((p, i) => {
      const q = P(p.lon, p.lat)
      if (q[2] <= 0.02) return
      this.pinsXY.push({ id: p.id, x: q[0], y: q[1] })
      const col = p.attn ? th.warn : th.good
      const on = p.id === this.sel || p.id === this.hoverPin || p.id === this.listHover
      if (!reduce) {
        const ph = (t / 1700 + i * 0.13) % 1
        ctx.strokeStyle = `rgba(${col},${(0.75 * (1 - ph)).toFixed(2)})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(q[0], q[1], 5 + ph * (z > 3 ? 20 : 14), 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = `rgb(${col})`
      ctx.beginPath()
      ctx.arc(q[0], q[1], on ? 7 : z > 3 ? 6 : 4.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = on ? '#FFFFFF' : th.pinOutline
      ctx.lineWidth = 2
      ctx.stroke()
      if (this.o.labels && (on || (showLabels && p.countryCode === lvl))) {
        LB.push({ x: q[0], y: q[1], text: p.name, score: p.score.toFixed(1), warn: p.attn, pri: on ? 1 : 0, light: on })
      }
    })
    this.placeLabels(ctx, LB, W, H)
  }

  /** Place name labels so they do not overlap each other or leave the canvas. */
  private placeLabels(ctx: CanvasRenderingContext2D, L: Label[], W: number, H: number) {
    const th = this.theme
    ctx.font = '500 14px Geist, sans-serif'
    const placed: number[][] = []
    const hgt = 24
    const hit = (a: number[]) =>
      a[0] < 4 ||
      a[1] < 4 ||
      a[0] + a[2] > W - 4 ||
      a[1] + hgt > H - 4 ||
      placed.some((b) => a[0] < b[0] + b[2] + 4 && b[0] < a[0] + a[2] + 4 && a[1] < b[1] + hgt + 4 && b[1] < a[1] + hgt + 4)
    L.slice()
      .sort((a, b) => b.pri - a.pri)
      .forEach((o) => {
        const tw = ctx.measureText(o.text).width
        const sw = o.score ? ctx.measureText(o.score).width + 8 : 0
        const w = tw + sw + 16
        const c = [
          [o.x - w / 2, o.y - 12 - hgt],
          [o.x - w / 2, o.y + 12],
          [o.x + 12, o.y - hgt / 2],
          [o.x - 12 - w, o.y - hgt / 2],
        ].map((p) => [p[0], p[1], w])
        let pick = c.find((a) => !hit(a))
        if (!pick && o.pri) pick = c[0]
        if (!pick) return
        placed.push(pick)
        ctx.fillStyle = o.light ? '#FFFFFF' : th.labelBg
        ctx.beginPath()
        if (ctx.roundRect) ctx.roundRect(pick[0], pick[1], w, hgt, 8)
        else ctx.rect(pick[0], pick[1], w, hgt)
        ctx.fill()
        ctx.fillStyle = o.light ? '#000000' : '#FFFFFF'
        ctx.textBaseline = 'middle'
        ctx.fillText(o.text, pick[0] + 8, pick[1] + hgt / 2 + 1)
        if (o.score) {
          ctx.fillStyle = o.warn ? (o.light ? th.labelWarnLight : th.labelWarn) : o.light ? th.labelGoodLight : th.labelGood
          ctx.fillText(o.score, pick[0] + 8 + tw + 8, pick[1] + hgt / 2 + 1)
        }
      })
  }
}

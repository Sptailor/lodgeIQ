'use client'

import Image from 'next/image'

/** The inspector's photo. Hover to magnify under a 96px lens; hidden on touch screens. */
export function EvidenceLens({ src, alt }: { src: string; alt: string }) {
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget
    const lens = box.querySelector<HTMLElement>('.lens')
    if (!lens) return
    const r = box.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    lens.style.opacity = '1'
    lens.style.transform = `translate(${x - 48}px,${y - 48}px)`
    lens.style.backgroundPosition = `${48 - x * 2}px ${48 - y * 2}px`
  }
  const out = (e: React.MouseEvent<HTMLDivElement>) => {
    const lens = e.currentTarget.querySelector<HTMLElement>('.lens')
    if (lens) lens.style.opacity = '0'
  }
  return (
    <div className="flex-none">
      <div className="lensbox relative h-40 w-60 cursor-zoom-in overflow-hidden rounded-lg max-md:w-full" onMouseMove={move} onMouseLeave={out}>
        <Image src={src} alt={alt} width={240} height={160} className="h-full w-full object-cover" />
        <span className="lens [@media(hover:none)]:hidden" aria-hidden="true" style={{ backgroundImage: `url(${src})`, backgroundSize: '480px 320px' }} />
      </div>
      <p className="caption-5 mt-1 text-ink-3 [@media(hover:none)]:hidden">Hover the photo to zoom in</p>
    </div>
  )
}

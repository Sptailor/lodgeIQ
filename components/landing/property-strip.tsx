import Image from 'next/image'
import { fullScore } from '@/lib/domain/checks'
import { SAMPLE_PROPERTIES } from '@/lib/domain/sample-data'
import { Reveal } from './reveal'

const STAYS = [
  { id: 'acacia-ridge-camp', img: '/images/tented-camp.jpg', alt: 'A canvas bell tent on a wooden deck under string lights', tag: 'Inspected yesterday' },
  { id: 'stone-town-inn', img: '/images/stone-room.jpg', alt: 'A hotel bedroom with a stone wall, round mirror and white linen', tag: 'Room cleanliness needs work' },
  { id: 'coral-tide-resort', img: '/images/beach-pool-villas.jpg', alt: 'Beach pool villas among palm trees beside the sea', tag: 'Inspected 4 days ago' },
  { id: 'mountain-view-lodge', img: '/images/alpine-lake-lodge.jpg', alt: 'An alpine lodge beside a still lake below a pine forest', tag: 'Inspected 44 days ago' },
]

export function PropertyStrip() {
  return (
    <Reveal id="properties">
      <div className="sec" style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 48px 32px', boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
        <div>
          <h2 className="heading-2" style={{ maxWidth: 680 }}>
            From tented camps
            <br />
            to city towers.
          </h2>
          <p className="title-2" style={{ maxWidth: 560, marginTop: 16, color: '#A3A3A3' }}>
            One score for every kind of property you sell. Drag to see more.
          </p>
        </div>
        <p className="caption-5" style={{ color: '#737373' }}>
          Sample properties and scores
        </p>
      </div>
      <div className="strip" role="list">
        {STAYS.map((s) => {
          const p = SAMPLE_PROPERTIES.find((x) => x.id === s.id)!
          const score = fullScore(p.latestResults).score
          return (
            <article key={s.id} className="ph" role="listitem">
              <Image src={s.img} alt={s.alt} width={320} height={440} sizes="320px" loading="lazy" />
              <div className="glass" style={{ position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 16, padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                <span className="heading-6" style={{ width: 40, flex: 'none', color: score < 3 ? '#E5604A' : '#5FE1E4' }}>
                  {score.toFixed(1)}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span className="body-4" style={{ display: 'block' }}>
                    {p.name}
                  </span>
                  <span className="caption-5" style={{ display: 'block', color: '#D4D4D4' }}>
                    {p.place}
                  </span>
                </span>
              </div>
              <span className="caption-3" style={{ position: 'absolute', top: 12, left: 12, borderRadius: 9999, padding: '4px 12px', background: 'rgba(0,0,0,.6)', color: '#FFFFFF' }}>
                {s.tag}
              </span>
            </article>
          )
        })}
      </div>
    </Reveal>
  )
}

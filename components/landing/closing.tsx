import Image from 'next/image'

export function Closing() {
  return (
    <section aria-label="Get started" style={{ position: 'relative', minHeight: 640, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <Image src="/images/savanna-sunset.jpg" alt="Acacia trees and a herd of eland silhouetted against a savanna sunset" fill sizes="100vw" loading="lazy" style={{ objectFit: 'cover' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)' }} />
      <div className="sec" style={{ position: 'relative', width: '100%', maxWidth: 1280, margin: '0 auto', padding: '96px 48px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }}>
        <h2 className="heading-2 hero-grad" style={{ maxWidth: 680 }}>
          See it with a real portfolio.
        </h2>
        <p className="title-2" style={{ maxWidth: 680, color: '#E5E5E5' }}>
          No sign up and no card. You&apos;ll be signed in as an operations manager, and your changes stay in your browser tab.
        </p>
        <a className="btn btn-primary button-md" href="/demo">
          Explore the live demo
        </a>
      </div>
    </section>
  )
}

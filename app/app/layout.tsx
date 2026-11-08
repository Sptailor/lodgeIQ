import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AppShell } from '@/components/app/AppShell'
import { AppStateProvider } from '@/components/app/AppState'
import { BrandMark } from '@/components/shared/brand-mark'
import { getPortfolioSnapshot } from '@/lib/data/snapshot'
import '@/styles/app.css'

// The app always shows live data for the signed in user.
export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')

  let snapshot
  try {
    snapshot = await getPortfolioSnapshot(session.user)
  } catch (e) {
    console.error('Could not load the workspace:', e instanceof Error ? e.message : e)
    return (
      <div className="lq flex min-h-screen items-center justify-center bg-page p-4 text-ink">
        <main className="card w-full max-w-[480px] p-8">
          <div className="flex items-center gap-2">
            <BrandMark />
            <span className="body-1">LodgeIQ</span>
          </div>
          <h1 className="heading-5 mt-8">The workspace is not ready</h1>
          <p role="alert" className="body-6 mt-2" style={{ color: 'rgba(255,255,255,.72)' }}>
            The sample data could not be loaded. Load it with <code>npx prisma db push</code> and then <code>npx prisma db seed</code>, then reload this page.
          </p>
          <Link href="/" className="btn btn-quiet button-md mt-6">
            Go to the website
          </Link>
        </main>
      </div>
    )
  }

  return (
    <AppStateProvider snapshot={snapshot}>
      <AppShell>{children}</AppShell>
    </AppStateProvider>
  )
}

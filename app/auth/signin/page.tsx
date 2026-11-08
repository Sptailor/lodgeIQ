/**
 * Sign in page.
 * One click demo, plus email and Google when they are set up.
 */

import { redirect } from 'next/navigation'
import { auth, hasEmailSignIn, hasGoogleSignIn, signIn } from '@/auth'
import { BrandMark } from '@/components/shared/brand-mark'

const ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: 'This email is already registered with a different sign in method.',
  Verification: 'The sign in link has expired or was already used. Request a new one.',
  AccessDenied: 'You do not have permission to sign in.',
}

export default async function SignInPage({ searchParams }: { searchParams: { callbackUrl?: string; error?: string } }) {
  const session = await auth()
  if (session?.user) redirect('/app')

  const requested = searchParams.callbackUrl ?? '/app'
  const callbackUrl = requested.startsWith('/app') ? requested : '/app'
  const error = searchParams.error ? (ERRORS[searchParams.error] ?? 'Something went wrong while signing in. Try again.') : null

  return (
    <main className="card w-full max-w-[400px] p-8">
      <div className="flex items-center gap-2">
        <BrandMark />
        <span className="body-1">LodgeIQ</span>
      </div>
      <h1 className="heading-5 mt-8">Sign in to LodgeIQ</h1>
      <p className="body-6 mt-2" style={{ color: 'rgba(255,255,255,.72)' }}>
        Hotel and lodge inspections for tour operators.
      </p>

      {error && (
        <p role="alert" className="body-6 mt-6 rounded-md p-3" style={{ background: 'rgba(255,138,122,.14)', color: '#FFC2B8' }}>
          {error}
        </p>
      )}

      <a href="/demo" className="btn btn-primary button-md mt-6 w-full">
        Explore the live demo
      </a>
      <p className="caption-5 mt-2" style={{ color: 'rgba(255,255,255,.56)' }}>
        No sign up and no card. Your changes stay in your browser tab.
      </p>

      {hasEmailSignIn && (
        <form
          className="mt-8 space-y-3 border-t border-line-2 pt-6"
          action={async (formData: FormData) => {
            'use server'
            await signIn('resend', { email: String(formData.get('email') ?? ''), redirectTo: callbackUrl })
          }}
        >
          <label htmlFor="email" className="body-5 block">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="body-6 w-full rounded-md border border-line-2 bg-transparent px-4 py-3 text-ink placeholder:text-ink-3"
          />
          <button type="submit" className="btn btn-quiet button-md w-full">
            Email me a sign in link
          </button>
        </form>
      )}

      {hasGoogleSignIn && (
        <form
          className={hasEmailSignIn ? 'mt-3' : 'mt-8 border-t border-line-2 pt-6'}
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: callbackUrl })
          }}
        >
          <button type="submit" className="btn btn-quiet button-md w-full">
            Continue with Google
          </button>
        </form>
      )}
    </main>
  )
}

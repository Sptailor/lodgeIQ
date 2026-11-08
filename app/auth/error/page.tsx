/**
 * Auth error page.
 */

import Link from 'next/link'
import { BrandMark } from '@/components/shared/brand-mark'

const MESSAGES: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link has expired or was already used. Request a new one.',
  Default: 'Something went wrong while signing in. Try again.',
}

export default function AuthErrorPage({ searchParams }: { searchParams: { error?: string } }) {
  const message = MESSAGES[searchParams.error ?? 'Default'] ?? MESSAGES.Default
  return (
    <main className="card w-full max-w-[400px] p-8">
      <div className="flex items-center gap-2">
        <BrandMark />
        <span className="body-1">LodgeIQ</span>
      </div>
      <h1 className="heading-5 mt-8">We could not sign you in</h1>
      <p role="alert" className="body-6 mt-2" style={{ color: 'rgba(255,255,255,.72)' }}>
        {message}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/auth/signin" className="btn btn-primary button-md">
          Back to sign in
        </Link>
        <Link href="/" className="btn btn-quiet button-md">
          Go to the website
        </Link>
      </div>
    </main>
  )
}

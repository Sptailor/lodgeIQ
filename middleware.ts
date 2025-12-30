/**
 * Next.js Middleware
 *
 * Protects routes using Auth.js
 * Redirects unauthenticated users to sign-in page
 */

export { auth as middleware } from '@/auth'

export const config = {
  // Protect these route patterns
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth pages (signin, error)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}

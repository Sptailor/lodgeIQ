/**
 * Next.js middleware
 *
 * Protects everything under /app. Signed out visitors are sent to the sign in page.
 * The landing page, /demo, /auth and the API routes are not matched here
 * (the API routes check access themselves).
 */

import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/app/:path*'],
}

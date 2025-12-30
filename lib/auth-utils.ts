/**
 * Authentication & Authorization Utilities
 *
 * Helper functions for checking user roles and permissions
 */

import { auth } from '@/auth'
import { UserRole } from '@prisma/client'

/**
 * Get the current session
 * Returns null if not authenticated
 */
export async function getSession() {
  return await auth()
}

/**
 * Get the current user
 * Throws error if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }
  return session.user
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getSession()
  return session?.user?.role === role
}

/**
 * Check if user is an inspector
 */
export async function isInspector(): Promise<boolean> {
  return hasRole('INSPECTOR')
}

/**
 * Check if user is a manager
 */
export async function isManager(): Promise<boolean> {
  return hasRole('MANAGER')
}

/**
 * Check if user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('ADMIN')
}

/**
 * Require authentication
 * Throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  return user
}

/**
 * Require specific role
 * Throws error if user doesn't have the role
 */
export async function requireRole(role: UserRole) {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error(`Required role: ${role}`)
  }
  return user
}

/**
 * Require one of multiple roles
 * Throws error if user doesn't have any of the roles
 */
export async function requireAnyRole(roles: UserRole[]) {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error(`Required one of roles: ${roles.join(', ')}`)
  }
  return user
}

/**
 * Check if user can create inspections
 * Only inspectors and admins can create inspections
 */
export async function canCreateInspection(): Promise<boolean> {
  const session = await getSession()
  if (!session?.user) return false
  return ['INSPECTOR', 'ADMIN'].includes(session.user.role)
}

/**
 * Check if user can modify an inspection
 * Only the inspector who created it or admins can modify
 */
export async function canModifyInspection(inspectorId: string): Promise<boolean> {
  const session = await getSession()
  if (!session?.user) return false

  // Admins can modify any inspection
  if (session.user.role === 'ADMIN') return true

  // Inspectors can only modify their own inspections
  if (session.user.role === 'INSPECTOR') {
    return session.user.id === inspectorId
  }

  return false
}

/**
 * Check if user can view all inspections
 * Managers and admins can view all inspections
 */
export async function canViewAllInspections(): Promise<boolean> {
  const session = await getSession()
  if (!session?.user) return false
  return ['MANAGER', 'ADMIN'].includes(session.user.role)
}

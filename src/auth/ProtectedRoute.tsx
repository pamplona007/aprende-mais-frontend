import { Navigate, useLocation } from 'react-router'
import type { ReactNode } from 'react'
import { useAuth } from './AuthProvider'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  /** Roles allowed to view this subtree. If omitted, any signed-in user passes. */
  allowedRoles?: UserRole[]
  /** Where to send unauthorised users. Defaults to /login. */
  redirectTo?: string
}

/**
 * Redirects to /login if there is no current user, or to / if the user's role
 * isn't allowed. Preserves the intended destination via state so we can bounce
 * back after login (not used yet, but ready).
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
  }
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

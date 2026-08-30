import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

/** Redirects unauthenticated users to /login */
export function ProtectedRoute({ children, requireOnboarding = false }: ProtectedRouteProps) {
  const { firebaseUser, userProfile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-ink-muted font-medium">Loading your experience…</p>
        </div>
      </div>
    )
  }

  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!firebaseUser.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  if (requireOnboarding && userProfile && !userProfile.onboardingCompleted) {
    if (!location.pathname.startsWith('/onboarding')) {
      return <Navigate to="/onboarding/location" replace />
    }
  }

  return <>{children}</>
}

/** Redirects authenticated users away from auth pages */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { firebaseUser, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="w-10 h-10 border-3 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (firebaseUser && firebaseUser.emailVerified) {
    if (userProfile && !userProfile.onboardingCompleted) {
      return <Navigate to="/onboarding/location" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function ProtectedRoute({ children }) {
  const {
    user,
    nextStep,
    loading,
    profileLoading,
    profileError,
    refreshNextStep,
  } = useAuth()

  const location = useLocation()

  const isCompleteProfilePage =
    location.pathname === '/complete-profile'

  const isPendingApprovalPage =
    location.pathname === '/pending-approval'

  const isProfileRejectedPage =
    location.pathname === '/profile-rejected'

  if (loading || (user && profileLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--color-text-muted)]">
        Checking your session...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Do not grant access if the backend status check failed.
  if (!nextStep) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-[var(--color-text)]">
          Unable to verify your profile status.
        </p>

        {profileError && (
          <p className="text-sm text-[var(--color-danger)]">
            {profileError}
          </p>
        )}

        <button
          type="button"
          onClick={refreshNextStep}
          disabled={profileLoading}
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
        >
          {profileLoading ? 'Checking...' : 'Try again'}
        </button>
      </div>
    )
  }

  // Profile has not been submitted yet.
  if (nextStep === 'COMPLETE_PROFILE') {
    if (!isCompleteProfilePage) {
      return <Navigate to="/complete-profile" replace />
    }

    return children
  }

  // Profile submitted, waiting for librarian approval.
  if (nextStep === 'PENDING_APPROVAL') {
    if (!isPendingApprovalPage) {
      return <Navigate to="/pending-approval" replace />
    }

    return children
  }

  // Application rejected by the librarian.
  if (nextStep === 'PROFILE_REJECTED') {
    if (!isProfileRejectedPage) {
      return <Navigate to="/profile-rejected" replace />
    }

    return children
  }

  // Only approved accounts can access the dashboard.
  if (nextStep === 'DASHBOARD') {
    if (
      isCompleteProfilePage ||
      isPendingApprovalPage ||
      isProfileRejectedPage
    ) {
      return <Navigate to="/" replace />
    }

    return children
  }

  // Fail closed if an unexpected status is returned.
  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-center text-[var(--color-text)]">
      Unknown account status. Please contact your librarian.
    </div>
  )
}
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function RoleRoute({ allowedRoles, children }) {
  const {
    role,
    nextStep,
    loading,
    profileLoading,
  } = useAuth()

  // Wait until authentication and profile checks finish
  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <p className="text-[var(--color-text-muted)]">
          Checking permissions...
        </p>
      </div>
    )
  }

  // Redirect users according to their profile status
  if (nextStep === 'COMPLETE_PROFILE') {
    return <Navigate to="/complete-profile" replace />
  }

  if (nextStep === 'PENDING_APPROVAL') {
    return <Navigate to="/pending-approval" replace />
  }

  if (nextStep === 'PROFILE_REJECTED') {
    return <Navigate to="/profile-rejected" replace />
  }

  // Fail closed if the user's status is unknown or invalid
  if (nextStep !== 'DASHBOARD') {
    return <Navigate to="/login" replace />
  }

  // Only allow the specified roles
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
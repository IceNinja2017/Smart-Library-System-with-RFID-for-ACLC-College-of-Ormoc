import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

import Login from '../pages/Login'

export default function GuestRoute() {
  const {
    user,
    loading,
    nextStep,
    profileLoading,
    profileError,
  } = useAuth()

  if (loading || (user && profileLoading)) {
    return <p>Loading...</p>
  }

  // Signed out: show the login page on the index route.
  if (!user) {
    return <Login />
  }

  // Signed in, but profile status could not be verified.
  if (!nextStep) {
    return (
      <div className="p-6 text-center text-[var(--color-text)]">
        <p>
          {profileError || 'Unable to verify your profile status.'}
        </p>
      </div>
    )
  }

  // Send authenticated users to the correct page.
  switch (nextStep) {
    case 'COMPLETE_PROFILE':
      return <Navigate to="/complete-profile" replace />

    case 'PENDING_APPROVAL':
      return <Navigate to="/pending-approval" replace />

    case 'PROFILE_REJECTED':
      return <Navigate to="/profile-rejected" replace />

    case 'DASHBOARD':
      return <Navigate to="/" replace />

    default:
      return <p>Unable to determine your account status.</p>
  }
}
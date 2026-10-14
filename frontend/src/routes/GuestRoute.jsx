import { Navigate } from 'react-router-dom'
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

  // Signed out: show login
  if (!user) {
    return <Login />
  }

  // Signed in, but profile status could not be verified
  if (!nextStep) {
    return <p>{profileError || 'Unable to verify your profile status.'}</p>
  }

  // Signed in: redirect to the appropriate page
  if (nextStep === 'COMPLETE_PROFILE') {
    return <Navigate to="/complete-profile" replace />
  }

  return <Navigate to="/" replace />
}
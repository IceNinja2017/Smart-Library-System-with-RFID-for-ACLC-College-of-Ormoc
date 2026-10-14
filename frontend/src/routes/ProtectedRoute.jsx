import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function ProtectedRoute({ children }) {
  const {
    user,
    nextStep,
    loading,
    profileLoading,
    profileError,
  } = useAuth()

  const location = useLocation()
  const isCompleteProfilePage =
    location.pathname === '/complete-profile'

  if (loading || (user && profileLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Checking your session...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!nextStep) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <p>Unable to verify your profile status.</p>
        {profileError && (
          <p className="text-sm text-red-600">{profileError}</p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    )
  }

  if (
    nextStep === 'COMPLETE_PROFILE' &&
    !isCompleteProfilePage
  ) {
    return <Navigate to="/complete-profile" replace />
  }

  if (
    nextStep === 'DASHBOARD' &&
    isCompleteProfilePage
  ) {
    return <Navigate to="/" replace />
  }

  return children
}

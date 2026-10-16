import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Unauthorized() {
  const { role, loading, profileLoading } = useAuth()

  if (loading || profileLoading) {
    return <p className="p-6 text-center">Loading...</p>
  }

  const backPage = role === 'ADMIN' ? '/admin' : '/'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4 text-center">
      <h1 className="text-3xl font-bold text-[var(--color-secondary)]">
        Access Denied
      </h1>

      <p className="mt-3 text-[var(--color-text-muted)]">
        You do not have permission to access this page.
      </p>

      <Link
        to={backPage}
        className="mt-6 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { BookOpen, LibraryBig } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { setNextStep, refreshNextStep } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          result.message || `Login failed (${response.status})`
        )
      }

      if (
        !result.session?.access_token ||
        !result.session?.refresh_token
      ) {
        throw new Error('The server did not return a valid session.')
      }

      if (
        ![
          'COMPLETE_PROFILE',
          'PENDING_APPROVAL',
          'PROFILE_REJECTED',
          'DASHBOARD',
        ].includes(result.nextStep)
      ) {
        throw new Error('Invalid nextStep returned by server.')
      }

      const { error: sessionError } =
        await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        })

      if (sessionError) throw sessionError

      setNextStep(result.nextStep)

      // Route according to the server's profile status.
      if (result.nextStep === 'COMPLETE_PROFILE') {
        navigate('/complete-profile', { replace: true })
        return
      }

      if (result.nextStep === 'PENDING_APPROVAL') {
        navigate('/pending-approval', { replace: true })
        return
      }

      if (result.nextStep === 'PROFILE_REJECTED') {
        navigate('/profile-rejected', { replace: true })
        return
      }

      // Refresh the profile state to get the verified role.
      if (typeof refreshNextStep !== 'function') {
        throw new Error(
          'Profile refresh is unavailable. Please try again.'
        )
      }

      const profileResult = await refreshNextStep()

      // Read the role from AuthProvider after refreshing.
      // AuthProvider must expose the updated role.
      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData?.user) {
        throw new Error('Unable to verify your signed-in account.')
      }

      // Refreshing the provider updates its role, but React state
      // updates are asynchronous. Fetch the verified profile instead.
      const profileResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/me`,
        {
          headers: {
            Authorization: `Bearer ${result.session.access_token}`,
          },
        }
      )

      const profileData = await profileResponse.json().catch(() => ({}))

      if (!profileResponse.ok || !profileData.profile) {
        throw new Error(
          profileData.message || 'Unable to load your profile.'
        )
      }

      const role = profileData.profile.role

      if (profileData.profile.approvalStatus !== 'APPROVED') {
        throw new Error('Your account is not approved for dashboard access.')
      }

      if (role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else if (role === 'STUDENT' || role === 'TEACHER') {
        navigate('/', { replace: true })
      } else {
        throw new Error('Your account does not have a valid dashboard role.')
      }
    } catch (err) {
      setError(err.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-[var(--color-primary)] p-3 text-white">
            <LibraryBig size={28} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-text)]">
              BookSmart
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              School Library Management for ACLC Ormoc
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Sign in with your library account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
              placeholder="you@school.edu"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/5 p-3 text-sm text-[var(--color-secondary)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <BookOpen size={18} />
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-hover)] hover:underline focus:outline-none focus:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-6 flex h-1 overflow-hidden rounded-full">
          <div className="w-1/2 bg-[var(--color-primary)]" />
          <div className="w-1/2 bg-[var(--color-secondary)]" />
        </div>
      </section>
    </main>
  )
}
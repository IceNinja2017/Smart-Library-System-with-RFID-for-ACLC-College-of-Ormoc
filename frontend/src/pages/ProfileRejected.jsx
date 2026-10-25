import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AlertCircle, Mail } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'

const API_URL = import.meta.env.VITE_API_URL

export default function ProfileRejected() {
    const { session } = useAuth()

    const [rejectionReason, setRejectionReason] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        const fetchProfile = async () => {
        if (!session?.access_token) {
            setError('Your session is unavailable. Please sign in again.')
            setLoading(false)
            return
        }

        try {
            const response = await fetch(`${API_URL}/profiles/me`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: 'no-store',
            })

            const result = await response.json()

            if (!response.ok) {
            throw new Error(result.message || 'Failed to load profile')
            }

            if (!cancelled) {
            setRejectionReason(result.profile?.rejectionReason || '')
            }
        } catch (err) {
            if (!cancelled) {
            setError(err.message || 'Failed to load rejection reason')
            }
        } finally {
            if (!cancelled) {
            setLoading(false)
            }
        }
        }

        fetchProfile()

        return () => {
        cancelled = true
        }
    }, [session?.access_token])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-10">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        <div className="flex h-1">
          <div className="w-1/2 bg-[var(--color-primary)]" />
          <div className="w-1/2 bg-[var(--color-secondary)]" />
        </div>

        <div className="p-6 text-center sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
            <AlertCircle size={34} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[var(--color-text)]">
            Application Not Approved
          </h1>

          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            Unfortunately, your BookSmart account application
            was not approved. You cannot access the library system
            at this time.
          </p>

          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-left">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Reason for rejection
            </p>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {rejectionReason ||
                'Please contact your school librarian for details about your application.'}
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 text-[var(--color-text-muted)]">
            If you believe this decision was made in error, contact
            your school librarian to clarify your information or
            request a review.
          </p>

          <a
            href="mailto:"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            <Mail size={18} />
            Contact librarian
          </a>

          <p className="mt-4 text-xs text-[var(--color-text-muted)]">
            BookSmart · School Library Management
          </p>
        </div>
      </section>
    </main>
  )
}
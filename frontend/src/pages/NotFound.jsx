import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, ArrowLeft, House, SearchX } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'

export default function NotFound() {
  const navigate = useNavigate()
  const { role, loading, profileLoading } = useAuth()

  if (loading || profileLoading) {
    return <p className="p-6 text-center">Loading...</p>
  }

  const backPage = role === 'ADMIN' ? '/admin' : '/'

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        {/* School-color accent */}
        <div className="flex h-1.5">
          <div className="w-1/2 bg-[var(--color-primary)]" />
          <div className="w-1/2 bg-[var(--color-secondary)]" />
        </div>

        <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
          {/* Icon */}
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <BookOpen size={42} strokeWidth={1.6} />

            <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[var(--color-surface)] bg-[var(--color-secondary)] text-white">
              <SearchX size={17} />
            </span>
          </div>

          {/* Error code */}
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-secondary)]">
            Error 404
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
            Looks like this page is missing from our shelves. The link
            may be incorrect, or the page may have been moved.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={backPage}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:ring-offset-2"
            >
              <House size={18} />
              Go to homepage
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:ring-offset-2"
            >
              <ArrowLeft size={18} />
              Go back
            </button>
          </div>

          <p className="mt-8 text-xs text-[var(--color-text-muted)]">
            BookSmart · School Library Management
          </p>
        </div>
      </section>
    </main>
  )
}
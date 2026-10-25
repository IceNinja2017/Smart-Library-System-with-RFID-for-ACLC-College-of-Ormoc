import { Clock3, BookOpen, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PendingApproval() {
  const navigate = useNavigate()

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out error:', error)
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[var(--shadow-card)] sm:p-8">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)]">
        <Clock3 size={34} />
      </div>

      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
        BookSmart
      </p>

      <h1 className="mt-3 text-2xl font-bold text-[var(--color-text)]">
        Awaiting Approval
      </h1>

      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
        Your profile has been submitted successfully. Your account is
        currently waiting for review by the school librarian.
      </p>

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-left">
        <div className="flex items-center gap-2 text-[var(--color-text)]">
          <BookOpen size={18} />
          <p className="text-sm font-semibold">
            What happens next?
          </p>
        </div>

        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          Once your account is approved, you will be able to access
          the library system. Please check back later.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:ring-offset-2"
      >
        <LogOut size={18} />
        Sign out
      </button>

      <div className="mt-6 flex h-1 overflow-hidden rounded-full">
        <div className="w-1/2 bg-[var(--color-primary)]" />
        <div className="w-1/2 bg-[var(--color-secondary)]" />
      </div>
    </section>
  )
}
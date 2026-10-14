import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, UserRound, BookOpen } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'

export default function CompleteProfile() {
  const navigate = useNavigate()
  const { session } = useAuth()

  const [form, setForm] = useState({
    fullName: '',
    contactNumber: '',
    usn: '',
    requestedRole: 'STUDENT',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isStudent = form.requestedRole === 'STUDENT'

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!session?.access_token) {
      setError('Your session has expired. Please sign in again.')
      return
    }

    if (!form.fullName.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (isStudent && !form.usn.trim()) {
      setError('Please enter your student number (USN).')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/complete-profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            fullName: form.fullName.trim(),
            contactNumber: form.contactNumber.trim() || null,
            usn: isStudent ? form.usn.trim() || null : null,
            requestedRole: form.requestedRole,
          }),
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          result.message || 'Unable to submit your profile.'
        )
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="mx-auto w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[var(--shadow-card)] sm:p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <CheckCircle2 size={34} />
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Profile submitted!
        </h1>

        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          Your profile has been submitted for approval. You can access
          the library once your account has been approved.
        </p>

        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-left">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            What happens next?
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
            Your school librarian will review your submitted information.
            You will be able to use the library once your account is approved.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          className="mt-6 w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:ring-offset-2"
        >
          Return to login
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] px-6 py-6 sm:px-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <UserRound size={25} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
          Smart Library
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Complete your profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          Fill in your information to submit your library account for approval.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-[var(--color-text)]"
          >
            Full name <span className="text-[var(--color-secondary)]">*</span>
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            required
            maxLength={150}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
          />
        </div>

        <div>
          <label
            htmlFor="contactNumber"
            className="mb-2 block text-sm font-medium text-[var(--color-text)]"
          >
            Contact number
          </label>

          <input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            autoComplete="tel"
            value={form.contactNumber}
            onChange={handleChange}
            maxLength={30}
            placeholder="e.g. 09123456789"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
          />
        </div>

        <div>
          <label
            htmlFor="requestedRole"
            className="mb-2 block text-sm font-medium text-[var(--color-text)]"
          >
            I am a <span className="text-[var(--color-secondary)]">*</span>
          </label>

          <select
            id="requestedRole"
            name="requestedRole"
            value={form.requestedRole}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>

        {isStudent && (
          <div>
            <label
              htmlFor="usn"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              University Student Number (USN){' '}
              <span className="text-[var(--color-secondary)]">*</span>
            </label>

            <input
              id="usn"
              name="usn"
              type="text"
              value={form.usn}
              onChange={handleChange}
              required
              maxLength={50}
              placeholder="Enter your USN"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
            />
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--color-secondary)]/25 bg-[var(--color-secondary)]/5 p-3 text-sm text-[var(--color-secondary)]"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <BookOpen size={18} />
          {loading ? 'Submitting profile...' : 'Submit for approval'}
        </button>

        <p className="text-center text-xs leading-5 text-[var(--color-text-muted)]">
          Your information will be reviewed by your school librarian.
        </p>
      </form>

      {/* School-color accent */}
      <div className="flex h-1">
        <div className="w-1/2 bg-[var(--color-primary)]" />
        <div className="w-1/2 bg-[var(--color-secondary)]" />
      </div>
    </section>
  )
}
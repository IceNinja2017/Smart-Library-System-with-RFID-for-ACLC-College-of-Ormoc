import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  ClipboardCheck,
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  UserRound,
} from 'lucide-react'
import SummaryCard from '../../components/SummaryCard'

const API_URL = import.meta.env.VITE_API_URL

export default function AccountApprovals() {
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const getToken = async () => {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session?.access_token) {
      throw new Error('Your session has expired. Please sign in again.')
    }

    return data.session.access_token
  }

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const token = await getToken()

      const response = await fetch(`${API_URL}/profiles/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load applications')
      }

      setApplications(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const reviewApplication = async (id, action) => {
    setProcessingId(id)
    setError('')
    setMessage('')

    try {
      const token = await getToken()

      const response = await fetch(
        `${API_URL}/profiles/${id}/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to review application')
      }

      setApplications((current) =>
        current.filter((application) => application.id !== id),
      )

      setMessage(
        action === 'approve'
          ? 'Application approved successfully.'
          : 'Application rejected successfully.',
      )
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setProcessingId(null)
    }
  }

  const normalizedSearch = search.trim().toLowerCase()

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      (application.fullName || '').toLowerCase().includes(normalizedSearch) ||
      (application.usn || '').toLowerCase().includes(normalizedSearch)

    const matchesRole =
      selectedRole === 'ALL' || application.requestedRole === selectedRole

    return matchesSearch && matchesRole
  })

  const formatDate = (date) => {
    if (!date) return 'Submission date unavailable'

    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Membership management
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Account Approvals
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Review registration details and decide which applicants can access
          Smart Library.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Awaiting Review"
          value={applications.length}
          icon={Clock3}
        />
        <SummaryCard
          label="Students Applications"
          value={applications.filter((item) => item.requestedRole === 'STUDENT').length}
          icon={UserRound}
        />
        <SummaryCard
          label="Teachers Applications"
          value={applications.filter((item) => item.requestedRole === 'TEACHER').length}
          icon={ClipboardCheck}
        />
      </section>

      {error && (
        <p role="alert" className="rounded-lg bg-[var(--color-danger)]/10 p-3 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="rounded-lg bg-[var(--color-success)]/10 p-3 text-sm text-[var(--color-success)]">
          {message}
        </p>
      )}

      <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        <div className="border-b border-[var(--color-border)] p-5">
          <h2 className="font-semibold text-[var(--color-text)]">
            Pending applications
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Search and filter applicants awaiting review.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or USN..."
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="ALL">All applicant types</option>
              <option value="STUDENT">Students</option>
              <option value="TEACHER">Teachers</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-[var(--color-text-muted)]">
            Loading applications...
          </p>
        ) : filteredApplications.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <ClipboardCheck
              size={34}
              className="mx-auto text-[var(--color-text-muted)]"
            />
            <h3 className="mt-3 font-semibold text-[var(--color-text)]">
              No applications found
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {applications.length === 0
                ? 'There are no pending applications.'
                : 'Try another search term or applicant type.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredApplications.map((application) => (
              <article
                key={application.id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">
                      {application.fullName}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      USN: {application.usn || 'Not provided'}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Submitted {formatDate(application.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)]">
                    {application.requestedRole}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-warning)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-warning)]">
                    <Clock3 size={14} />
                    Pending review
                  </span>

                  <button
                    type="button"
                    disabled={processingId !== null}
                    onClick={() => reviewApplication(application.id, 'approve')}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-success)]/10 px-3 py-2 text-sm font-semibold text-[var(--color-success)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    {processingId === application.id ? 'Processing...' : 'Approve'}
                  </button>

                  <button
                    type="button"
                    disabled={processingId !== null}
                    onClick={() => reviewApplication(application.id, 'reject')}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-secondary)]/10 px-3 py-2 text-sm font-semibold text-[var(--color-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-5 py-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            Showing real pending applications from the database.
          </p>
        </div>
      </section>
    </div>
  )
}
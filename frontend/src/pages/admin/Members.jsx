
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Users,
  GraduationCap,
  BriefcaseBusiness,
  Search,
  UserRound,
  RefreshCw,
  Phone,
  CalendarDays,
  IdCard,
} from 'lucide-react'
import SummaryCard from '../../components/SummaryCard'

const API_URL = import.meta.env.VITE_API_URL

export default function Members() {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError || !data.session?.access_token) {
        throw new Error('Your session has expired. Please sign in again.')
      }

      const response = await fetch(`${API_URL}/profiles/members`, {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to load members.')
      }

      setMembers(Array.isArray(result) ? result : [])
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const normalizedSearch = search.trim().toLowerCase()

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      (member.fullName || '').toLowerCase().includes(normalizedSearch) ||
      (member.usn || '').toLowerCase().includes(normalizedSearch)

    const matchesRole =
      selectedRole === 'ALL' || member.role === selectedRole

    return matchesSearch && matchesRole
  })

  const students = members.filter(
    (member) => member.role === 'STUDENT',
  ).length

  const teachers = members.filter(
    (member) => member.role === 'TEACHER',
  ).length

  const formatDate = (date) => {
    if (!date) return 'Not available'

    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Membership management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Members
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            View and manage approved students and teachers in Smart Library.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMembers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-background)] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Approved Members"
          value={members.length}
          icon={Users}
        />

        <SummaryCard
          label="Approved Students"
          value={students}
          icon={GraduationCap}
        />

        <SummaryCard
          label="Approved Teachers"
          value={teachers}
          icon={BriefcaseBusiness}
        />
      </section>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)] sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchMembers}
            className="shrink-0 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        <div className="border-b border-[var(--color-border)] p-5">
          <h2 className="font-semibold text-[var(--color-text)]">
            Approved Member Directory
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Search member names or USNs and filter by account type.
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
              <option value="ALL">All member types</option>
              <option value="STUDENT">Students</option>
              <option value="TEACHER">Teachers</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-[var(--color-text-muted)]">
            Loading approved members...
          </p>
        ) : error && members.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Users
              size={34}
              className="mx-auto text-[var(--color-text-muted)]"
            />
            <p className="mt-3 font-semibold text-[var(--color-text)]">
              Unable to load members
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Check your connection and try again.
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Users
              size={34}
              className="mx-auto text-[var(--color-text-muted)]"
            />

            <h3 className="mt-3 font-semibold text-[var(--color-text)]">
              {members.length === 0
                ? 'No approved members yet'
                : 'No members found'}
            </h3>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {members.length === 0
                ? 'Approved student and teacher accounts will appear here.'
                : 'Try another search term or member type.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing {filteredMembers.length} of {members.length} members
              </p>
            </div>

            <div className="divide-y divide-[var(--color-border)]">
              {filteredMembers.map((member) => (
                <article
                  key={member.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      <UserRound size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[var(--color-text)]">
                        {member.fullName}
                      </h3>

                      <div className="mt-2 flex flex-col gap-1.5 text-sm text-[var(--color-text-muted)]">
                        <p className="flex items-center gap-2">
                          <IdCard size={15} />
                          USN: {member.usn || 'Not provided'}
                        </p>

                        <p className="flex items-center gap-2">
                          <Phone size={15} />
                          {member.contactNumber || 'No contact number'}
                        </p>

                        <p className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          Registered {formatDate(member.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="rounded-full bg-[var(--color-success)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-success)]">
                      Approved
                    </span>

                    <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)]">
                      {member.role}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-5 py-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            Only approved student and teacher accounts are displayed.
          </p>
        </div>
      </section>
    </div>
  )
}

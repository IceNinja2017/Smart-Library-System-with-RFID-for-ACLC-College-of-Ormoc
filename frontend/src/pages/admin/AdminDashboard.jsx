import {
  BookOpen,
  BookMarked,
  Clock3,
  Users,
  ArrowRight,
  Radio,
  Activity,
  ClipboardCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/StatCard'

const recentActivity = [
  {
    id: 1,
    member: 'Sample Student',
    action: 'Borrowed a book',
    book: 'Introduction to Computing',
    status: 'Borrowed',
  },
  {
    id: 2,
    member: 'Sample Teacher',
    action: 'Returned a book',
    book: 'Research Methods',
    status: 'Returned',
  },
  {
    id: 3,
    member: 'Sample Student 2',
    action: 'Borrowed a book',
    book: 'Web Development Basics',
    status: 'Borrowed',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Library Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Overview
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Monitor your library collection, members, and borrowing activity.
          </p>
        </div>

        <Link
          to="/admin/books"
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
        >
          <BookOpen size={18} />
          Manage books
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total book copies"
          value="1,248"
          description="Sample inventory"
          icon={BookOpen}
          color="blue"
        />

        <StatCard
          title="Currently borrowed"
          value="186"
          description="Sample active loans"
          icon={BookMarked}
          color="blue"
        />

        <StatCard
          title="Overdue loans"
          value="12"
          description="Sample overdue count"
          icon={Clock3}
          color="amber"
        />

        <StatCard
          title="Registered members"
          value="342"
          description="Sample student and teacher accounts"
          icon={Users}
          color="violet"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
            <div>
              <h2 className="font-semibold text-[var(--color-text)]">
                Recent activity
              </h2>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Example borrowing and return records
              </p>
            </div>

            <Activity
              size={20}
              className="text-[var(--color-text-muted)]"
            />
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {item.member}
                  </p>

                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {item.action}: {item.book}
                  </p>
                </div>

                <span
                  className={[
                    'w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                    item.status === 'Returned'
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
                  ].join(' ')}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] px-5 py-3">
            <Link
              to="/admin/transactions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            >
              View transactions <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[var(--color-primary)]/10 p-3 text-[var(--color-primary)]">
                <ClipboardCheck size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-[var(--color-text)]">
                  Account approvals
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Review membership applications
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
              Review student and teacher registrations before granting
              access to the library system.
            </p>

            <Link
              to="/admin/approvals"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            >
              Review applications <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[var(--color-secondary)]/10 p-3 text-[var(--color-secondary)]">
                <Radio size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-[var(--color-text)]">
                  RFID scanner
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Device integration
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] p-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-warning)]" />
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Not connected
                </p>
              </div>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                RFID device status will appear here once integrated.
              </p>
            </div>

            <Link
              to="/admin/rfid"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            >
              View scanner <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <p className="text-xs text-[var(--color-text-muted)]">
        Demo data — statistics and activity are not connected to live library records yet.
      </p>
    </div>
  )
}
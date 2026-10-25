import {
  BookOpen,
  CalendarCheck,
  CircleAlert,
  ScanLine,
  Cloud,
  ShieldCheck,
} from 'lucide-react'

const systemFeatures = [
  {
    icon: ScanLine,
    text: 'RFID-based book scanning',
    color: 'text-[var(--color-secondary)]',
  },
  {
    icon: CalendarCheck,
    text: 'Automatic borrowing and return tracking',
    color: 'text-[var(--color-primary)]',
  },
  {
    icon: Cloud,
    text: 'Cloud-based book image storage',
    color: 'text-[var(--color-secondary)]',
  },
  {
    icon: BookOpen,
    text: 'Three-day due date policy for borrowings',
    color: 'text-[var(--color-primary)]',
  },
  {
    icon: CircleAlert,
    text: 'Late return penalty policy',
    color: 'text-[var(--color-secondary)]',
  },
]

const libraryGuidelines = [
  {
    icon: CalendarCheck,
    text: 'Return borrowed books on or before their due dates',
    color: 'text-[var(--color-secondary)]',
  },
  {
    icon: BookOpen,
    text: 'Handle library books with care',
    color: 'text-[var(--color-primary)]',
  },
  {
    icon: ScanLine,
    text: 'RFID scanning is required for supported transactions',
    color: 'text-[var(--color-secondary)]',
  },
  {
    icon: ShieldCheck,
    text: 'Report lost or damaged books to library staff promptly',
    color: 'text-[var(--color-primary)]',
  },
]

function InfoCard({ title, description, items, accent, icon: HeaderIcon }) {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />

      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-[var(--color-background)] p-3 text-[var(--color-primary)]">
            <HeaderIcon size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)] sm:text-xl">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">
              {description}
            </p>
          </div>
        </div>

        <ul className="space-y-4">
          {items.map(({ icon: Icon, text, color }) => (
            <li key={text} className="flex items-start gap-3">
              <Icon
                size={18}
                className={`mt-0.5 shrink-0 ${color}`}
              />

              <span className="text-sm leading-6 text-[var(--color-text)]">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <section>
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          STUDENT & TEACHER PORTAL
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Library Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
          Welcome to the BookSmart. Explore library resources,
          keep track of your borrowing responsibilities, and review
          the guidelines for using library services.
        </p>
      </section>

      {/* Information cards */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InfoCard
          title="System Overview"
          description="Learn how our library system works."
          items={systemFeatures}
          accent="bg-[var(--color-secondary)]"
          icon={BookOpen}
        />

        <InfoCard
          title="Library Guidelines"
          description="Help keep library resources available for everyone."
          items={libraryGuidelines}
          accent="bg-[var(--color-primary)]"
          icon={ShieldCheck}
        />
      </div>

      {/* Reminder */}
      <section className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/5 p-4">
        <CircleAlert
          size={20}
          className="mt-0.5 shrink-0 text-[var(--color-primary)]"
        />

        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            Borrowing reminder
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
            Check your borrowing records and due dates regularly.
            Contact library staff if a book is lost, damaged, or
            cannot be returned on time.
          </p>
        </div>
      </section>
    </div>
  )
}
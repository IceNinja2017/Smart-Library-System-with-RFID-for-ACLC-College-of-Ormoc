import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  Users,
  ArrowLeftRight,
  Radio,
  Library,
  ShieldCheck,
} from 'lucide-react'

const navigation = [
  {
    label: 'Overview',
    path: '/admin',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Account Approvals',
    path: '/admin/approvals',
    icon: ClipboardCheck,
    end: false,
  },
  {
    label: 'Books & Inventory',
    path: '/admin/books',
    icon: BookOpen,
    end: false,
  },
  {
    label: 'Members',
    path: '/admin/members',
    icon: Users,
    end: false,
  },
  {
    label: 'Borrowing & Returns',
    path: '/admin/transactions',
    icon: ArrowLeftRight,
    end: false,
  },
  {
    label: 'RFID Scanner',
    path: '/admin/rfid',
    icon: Radio,
    end: false,
  },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
              <Library size={23} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-[var(--color-text)]">
                BookSmart
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">
                Administration Portal
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-[var(--color-background)] px-3 py-2 sm:flex">
            <ShieldCheck
              size={16}
              className="text-[var(--color-primary)]"
            />
            <span className="text-sm font-medium text-[var(--color-text)]">
              Administrator
            </span>
          </div>
        </div>

        <nav
          aria-label="Admin navigation"
          className="overflow-x-auto border-t border-[var(--color-border)]"
        >
          <div className="mx-auto flex max-w-[1600px] gap-1 px-4 sm:px-6 lg:px-8">
            {navigation.map(({ label, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={({ isActive }) =>
                  [
                    'inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                      : 'border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]',
                  ].join(' ')
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-border)] px-4 py-5 text-center text-xs text-[var(--color-text-muted)]">
        BookSmart · School Library Management System
      </footer>
    </div>
  )
}
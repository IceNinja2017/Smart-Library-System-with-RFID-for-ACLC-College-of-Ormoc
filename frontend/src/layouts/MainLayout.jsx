
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Radio,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthProvider'

export default function MainLayout({ mode = 'dashboard' }) {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isProfileMode = mode === 'profile'
  const dashboardPath = role === 'ADMIN' ? '/admin' : '/'

  const links = [
    {
      to: dashboardPath,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/books',
      label: 'Book catalog',
      icon: BookOpen,
    },
    {
      to: '/my-loans',
      label: 'My loans',
      icon: UserRound,
    },
  ]

  async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out failed:', error.message)
      return
    }

    setMobileOpen(false)
    navigate('/login', { replace: true })
  }

  function closeMobileNavigation() {
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] md:flex">

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={closeMobileNavigation}
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[var(--color-sidebar)] text-white transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/15 px-6">
          <div className="rounded-lg bg-white p-2 text-[var(--color-secondary)] shadow-sm">
            <BookOpen size={23} />
          </div>

          <div>
            <p className="font-bold tracking-tight text-white">
              BookSmart
            </p>
            <p className="text-xs text-white/80">
              Library portal
            </p>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileNavigation}
            className="ml-auto rounded-lg p-2 text-white/80 transition hover:bg-white/15 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dashboard navigation */}
        {!isProfileMode && (
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/55">
              Workspace
            </p>

            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={closeMobileNavigation}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-[var(--color-primary)] shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={19} />
                {label}
              </NavLink>
            ))}

            {/* RFID information */}
            <div className="mt-8 rounded-xl border border-white/15 border-l-4 border-l-[var(--color-secondary)] bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white">
                <Radio size={18} className="text-red-400" />
                <span className="text-sm font-semibold">
                  RFID system
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-white/65">
                Hardware integration will be connected through your API.
              </p>
            </div>
          </nav>
        )}

        {/* Restricted profile mode */}
        {isProfileMode && (
          <div className="flex-1 p-4">
            <div className="rounded-xl border border-white/15 border-l-4 border-l-[var(--color-secondary)] bg-white/10 p-4">
              <p className="text-sm font-semibold">
                Profile required
              </p>
              <p className="mt-2 text-xs leading-5 text-white/75">
                Complete your profile to request access to the library.
              </p>
            </div>
          </div>
        )}

        {/* User information and sign out */}
        <div className="shrink-0 border-t border-white/15 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="rounded-full border border-white/20 bg-white/10 p-2">
              <Users size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.email ?? 'Library user'}
              </p>
              <p className="text-xs text-white/60">
                {isProfileMode ? 'Profile setup' : 'Signed in'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-white/85 transition-colors hover:border-red-400/30 hover:bg-[var(--color-secondary)] hover:text-white"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">

        {/* Red Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b-4 border-b-[var(--color-secondary)] bg-[var(--color-primary)] px-5 text-white shadow-md md:px-8">

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/15 md:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="text-sm font-bold tracking-wide text-white">
              School Library
            </p>
            <p className="hidden text-xs text-white/75 sm:block">
              Library management system
            </p>
          </div>
        </div>

          {/* Portal Status */}
          <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                isProfileMode ? 'bg-yellow-300' : 'bg-green-300'
              }`}
            />
            {isProfileMode ? 'Profile setup' : 'Library portal'}
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-7xl p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

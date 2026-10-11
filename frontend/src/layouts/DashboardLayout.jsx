
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Radio,
  UserRound,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthProvider'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/books', label: 'Book catalog', icon: BookOpen },
  { to: '/my-loans', label: 'My loans', icon: UserRound },
]

export default function DashboardLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out failed:', error.message)
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="rounded-lg bg-emerald-700 p-2 text-white">
            <BookOpen size={23} />
          </div>
          <div>
            <p className="font-bold text-slate-900">Smart Library</p>
            <p className="text-xs text-slate-500">Library portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}

          <div className="mt-8 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-700">
              <Radio size={18} />
              <span className="text-sm font-semibold">RFID system</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Hardware integration will be connected through your API.
            </p>
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="rounded-full bg-slate-100 p-2">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {user?.email ?? 'Library user'}
              </p>
              <p className="text-xs text-slate-500">Signed in</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
          <button
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
          >
            <Menu size={22} />
          </button>
          <div className="hidden md:block">
            <p className="text-sm text-slate-500">
              School library management
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Library portal
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

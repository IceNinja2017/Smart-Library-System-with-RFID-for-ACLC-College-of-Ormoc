import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthProvider } from './auth/AuthProvider'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Login from './pages/Login'
import CompleteProfile from './pages/CompleteProfile'
import NotFound from './pages/NotFound'
import ProtectedRoute from './routes/ProtectedRoute'
import GuestRoute from './routes/GuestRoute'

function AppRoutes() {
  return (
    <Routes>
      {/* Guest routes */}
      <Route
        path="/login"
        element={<GuestRoute />}
      />

      {/* Complete Profile: shared layout, restricted sidebar */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <DashboardLayout mode="profile" />
          </ProtectedRoute>
        }
      >
        <Route index element={<CompleteProfile />} />
      </Route>

      {/* Main dashboard: full sidebar access */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout mode="dashboard" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="books" element={<Books />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
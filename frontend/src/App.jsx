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
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import PendingApproval from './pages/PendingApproval'
import ProfileRejected from './pages/ProfileRejected'

function AppRoutes() {
  return (
    <Routes>
      {/* Guest routes */}
      <Route
        path="/login"
        element={<GuestRoute />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />


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

            {/* Pending Approval: restricted access while awaiting review */}
      <Route
        path="/pending-approval"
        element={
          <ProtectedRoute>
            <DashboardLayout mode="profile" />
          </ProtectedRoute>
        }
      >
        <Route index element={<PendingApproval />} />
      </Route>

      <Route
        path="/profile-rejected"
        element={
          <ProtectedRoute>
            <DashboardLayout mode="profile" />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfileRejected />} />
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
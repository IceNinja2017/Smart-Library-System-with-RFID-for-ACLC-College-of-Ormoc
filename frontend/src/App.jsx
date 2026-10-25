import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthProvider } from './auth/AuthProvider'

import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AccountApprovals from './pages/admin/AccountApprovals'
import BooksInventory from './pages/admin/BooksInventory'
import Members from './pages/admin/Members'
import BorrowingReturns from './pages/admin/BorrowingReturns'
import RFIDScanner from './pages/admin/RFIDScanner'

// General pages
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Login from './pages/Login'
import Register from './pages/Register'
import CompleteProfile from './pages/CompleteProfile'
import PendingApproval from './pages/PendingApproval'
import ProfileRejected from './pages/ProfileRejected'
import NotFound from './pages/NotFound'
import VerifyEmail from './pages/VerifyEmail'
import Unauthorized from './pages/Unauthorized'

// Route guards
import ProtectedRoute from './routes/ProtectedRoute'
import GuestRoute from './routes/GuestRoute'
import RoleRoute from './routes/RoleRoute'

function AppRoutes() {
  return (
    <Routes>
      {/* Guest routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/register" element={<Register />} />

      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Complete Profile */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <MainLayout mode="profile" />
          </ProtectedRoute>
        }
      >
        <Route index element={<CompleteProfile />} />
      </Route>

      {/* Pending Approval */}
      <Route
        path="/pending-approval"
        element={
          <ProtectedRoute>
            <MainLayout mode="profile" />
          </ProtectedRoute>
        }
      >
        <Route index element={<PendingApproval />} />
      </Route>

      {/* Rejected Profile */}
      <Route
        path="/profile-rejected"
        element={
          <ProtectedRoute>
            <MainLayout mode="profile" />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfileRejected />} />
      </Route>

      {/* Main application layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout mode="dashboard" />
          </ProtectedRoute>
        }
      >
        {/* Student and teacher dashboard */}
        <Route
          index
          element={
            <RoleRoute allowedRoles={['STUDENT', 'TEACHER']}>
              <Dashboard />
            </RoleRoute>
          }
        />

        <Route path="books" element={<Books />} />

        {/* Admin section nested inside MainLayout */}
        <Route
          path="admin"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="approvals" element={<AccountApprovals />} />
          <Route path="books" element={<BooksInventory />} />
          <Route path="members" element={<Members />} />
          <Route path="transactions" element={<BorrowingReturns />} />
          <Route path="rfid" element={<RFIDScanner />} />
        </Route>
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
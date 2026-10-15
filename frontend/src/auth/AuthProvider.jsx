import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL

const ALLOWED_NEXT_STEPS = [
  'COMPLETE_PROFILE',
  'PENDING_APPROVAL',
  'PROFILE_REJECTED',
  'DASHBOARD',
]

const ALLOWED_ROLES = [
  'ADMIN',
  'STUDENT',
  'TEACHER',
  'PENDING',
]

const ALLOWED_APPROVAL_STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
]

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [nextStep, setNextStep] = useState(null)
  const [role, setRole] = useState(null)
  const [approvalStatus, setApprovalStatus] = useState(null)

  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Restore the existing Supabase session and listen for auth changes.
  useEffect(() => {
    let active = true

    async function initializeSession() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (!active) return
        if (error) throw error

        setSession(data.session ?? null)
      } catch {
        if (active) {
          setSession(null)
          setNextStep(null)
          setRole(null)
          setApprovalStatus(null)
          setProfileError(
            'Unable to restore your session. Please sign in again.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    initializeSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return

      setSession(newSession)

      if (!newSession) {
        setNextStep(null)
        setRole(null)
        setApprovalStatus(null)
        setProfileError('')
        setProfileLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  // Ask the backend for the user's profile and approval status.
  const refreshNextStep = useCallback(async () => {
    const accessToken = session?.access_token

    if (!accessToken) {
      setNextStep(null)
      setRole(null)
      setApprovalStatus(null)
      setProfileError('')
      setProfileLoading(false)
      return null
    }

    setProfileLoading(true)
    setProfileError('')

    try {
      if (!API_URL) {
        throw new Error('VITE_API_URL is not configured.')
      }

      const response = await fetch(`${API_URL}/auth/next-step`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
      })

      const responseText = await response.text()
      let result = {}

      if (responseText) {
        try {
          result = JSON.parse(responseText)
        } catch {
          throw new Error(
            `Invalid JSON from next-step endpoint (HTTP ${response.status}).`
          )
        }
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Profile check failed (HTTP ${response.status}).`
        )
      }

      if (!ALLOWED_NEXT_STEPS.includes(result.nextStep)) {
        throw new Error(
          `Unexpected nextStep value: ${String(result.nextStep)}`
        )
      }

      const validRole =
        result.role == null || ALLOWED_ROLES.includes(result.role)

      const validApprovalStatus =
        result.approvalStatus == null ||
        ALLOWED_APPROVAL_STATUSES.includes(result.approvalStatus)

      if (!validRole || !validApprovalStatus) {
        throw new Error('The server returned an invalid profile status.')
      }

      // Ensure the returned values are consistent with the next step.
      if (
        result.nextStep === 'DASHBOARD' &&
        (
          !['ADMIN', 'STUDENT', 'TEACHER'].includes(result.role) ||
          result.approvalStatus !== 'APPROVED'
        )
      ) {
        throw new Error('Your account status could not be verified.')
      }

      if (
        result.nextStep === 'PENDING_APPROVAL' &&
        result.approvalStatus !== 'PENDING'
      ) {
        throw new Error('Your account status could not be verified.')
      }

      if (
        result.nextStep === 'PROFILE_REJECTED' &&
        result.approvalStatus !== 'REJECTED'
      ) {
        throw new Error('Your account status could not be verified.')
      }

      setNextStep(result.nextStep)
      setRole(result.role ?? null)
      setApprovalStatus(result.approvalStatus ?? null)

      return result.nextStep
    } catch (error) {
      // Fail closed if the account status cannot be verified.
      setNextStep(null)
      setRole(null)
      setApprovalStatus(null)

      setProfileError(
        error instanceof Error
          ? error.message
          : 'Unable to verify your profile status.'
      )

      return null
    } finally {
      setProfileLoading(false)
    }
  }, [session?.access_token])

  // Refresh status when the authenticated session becomes available.
  useEffect(() => {
    if (loading) return

    if (session?.access_token) {
      refreshNextStep()
    } else {
      setNextStep(null)
      setRole(null)
      setApprovalStatus(null)
      setProfileError('')
      setProfileLoading(false)
    }
  }, [loading, session?.access_token, refreshNextStep])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    nextStep,
    role,
    approvalStatus,
    setNextStep,
    profileLoading,
    profileError,
    refreshNextStep,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
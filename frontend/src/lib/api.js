
import axios from 'axios'
import { supabase } from './supabase'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) throw error

  if (session?.access_token) {
    config.headers.Authorization =
      `Bearer ${session.access_token}`
  }

  return config
})

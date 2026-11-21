import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

export type AdminRole = 'admin' | 'editor' | 'staff'
export type Permission = 'enquiries' | 'content' | 'settings'

export interface AdminSession {
  userId: string
  email: string
  name: string
  role: AdminRole
  demo: boolean
}

interface AuthContextValue {
  session: AdminSession | null
  loading: boolean
  error: string
  demoMode: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  can: (permission: Permission) => boolean
}

const DEMO_KEY = 'easypermit:admin-demo:v1'

const AuthContext = createContext<AuthContextValue | null>(null)

function demoSession(): AdminSession {
  return {
    userId: 'demo-admin',
    email: 'bozescitadel@gmail.com',
    name: 'Administrator',
    role: 'admin',
    demo: true,
  }
}

function readDemoSession(): AdminSession | null {
  try {
    return sessionStorage.getItem(DEMO_KEY) === '1' ? demoSession() : null
  } catch {
    return null
  }
}

async function profileFor(userId: string, email: string): Promise<AdminSession | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('profiles').select('full_name, role').eq('id', userId).maybeSingle()
  if (error || !data) return null
  const role = data.role === 'admin' || data.role === 'editor' || data.role === 'staff' ? data.role : null
  if (!role) return null
  return {
    userId,
    email,
    name: data.full_name || email,
    role,
    demo: false,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const demoMode = import.meta.env.DEV && !supabaseConfigured
  const [session, setSession] = useState<AdminSession | null>(() => (demoMode ? readDemoSession() : null))
  const [loading, setLoading] = useState(supabaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    let active = true

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      if (data.session?.user) {
        const next = await profileFor(data.session.user.id, data.session.user.email ?? '')
        if (!next) await supabase?.auth.signOut()
        if (active) setSession(next)
      }
      if (active) setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession?.user) {
        setSession(null)
        return
      }
      void profileFor(nextSession.user.id, nextSession.user.email ?? '').then(async (next) => {
        if (!next) await supabase?.auth.signOut()
        setSession(next)
      })
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError('')
      const cleanEmail = email.trim().toLowerCase()

      if (!supabase) {
        if (!import.meta.env.DEV) {
          throw new Error('Admin authentication is not configured. Connect Supabase Auth before going live.')
        }
        if (cleanEmail !== 'bozescitadel@gmail.com' || password !== 'Travels2026$') {
          throw new Error('Use the admin credentials shown on this page, or connect Supabase Auth.')
        }
        sessionStorage.setItem(DEMO_KEY, '1')
        setSession(demoSession())
        return
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })
      if (signInError) throw new Error(signInError.message)
      if (!data.user) throw new Error('Sign in failed. Please try again.')
      const next = await profileFor(data.user.id, data.user.email ?? cleanEmail)
      if (!next) {
        await supabase.auth.signOut()
        throw new Error('This account does not have a staff profile. Ask an administrator to create one.')
      }
      setSession(next)
    },
    [],
  )

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    sessionStorage.removeItem(DEMO_KEY)
    setSession(null)
  }, [])

  const can = useCallback(
    (permission: Permission) => {
      if (!session) return false
      if (session.role === 'admin') return true
      if (session.role === 'editor') return permission === 'content'
      return permission === 'enquiries'
    },
    [session],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ session, loading, error, demoMode, signIn, signOut, can }),
    [session, loading, error, demoMode, signIn, signOut, can],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

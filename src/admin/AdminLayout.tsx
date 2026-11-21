import { useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, FileEdit, Inbox, LayoutDashboard, Loader2, LogOut, Menu, ShieldAlert, X } from 'lucide-react'
import { useAuth } from '../store/auth'
import { supabaseConfigured } from '../lib/supabase'
import { Logo } from '../components/Logo'
import { cn } from '../lib/utils'

export function AdminLoginPage() {
  const { session, signIn, demoMode, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(demoMode ? 'bozescitadel@gmail.com' : '')
  const [password, setPassword] = useState(demoMode ? 'Travels2026$' : '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-mist">
        <Loader2 className="h-6 w-6 animate-spin text-navy-500" />
      </div>
    )
  }

  if (session) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Sign in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-mist lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-navy-950 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative">
          <Logo variant="light" />
          <div className="mt-16 max-w-sm">
            <span className="eyebrow-dark mb-4">Staff area</span>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-white">
              Manage enquiries, content and the follow-up that matters.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              This area is restricted to authorised Easy Permit team members. All access should follow your internal data
              protection and client confidentiality policy.
            </p>
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-[11px] text-white/35">
          <ShieldAlert className="h-4 w-4 text-gold-400" />
          {supabaseConfigured ? 'Supabase authentication enabled' : 'Preview authentication only'}
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <LinkHome />
          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-extrabold text-navy-900">Sign in</h2>
            <p className="mt-2 text-[13px] text-body/65">Use your authorised staff account.</p>

            {demoMode && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12px] leading-relaxed text-amber-900">
                <strong className="font-bold">Preview mode.</strong> Supabase Auth is not configured. Use{' '}
                <span className="font-mono">bozescitadel@gmail.com</span> / <span className="font-mono">Travels2026$</span> to
                explore the dashboard. This bypass is disabled in production.
              </div>
            )}

            {!supabaseConfigured && !demoMode && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[12px] leading-relaxed text-red-800">
                Admin authentication is not configured. Connect Supabase Auth and add your staff profiles before using the
                admin area in production.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</div>}
              <div>
                <label className="label" htmlFor="admin-email">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="field"
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="field"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
          <p className="mt-5 text-center text-[11px] text-navy-400">
            Client data is confidential. Only access records you need for your role.
          </p>
        </div>
      </div>
    </div>
  )
}

function LinkHome() {
  return (
    <a href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-navy-500 hover:text-navy-900">
      <ArrowLeft className="h-3.5 w-3.5" /> Back to website
    </a>
  )
}

export function ProtectedAdminRoute() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-mist">
        <Loader2 className="h-6 w-6 animate-spin text-navy-500" />
      </div>
    )
  }

  if (!session) return <Navigate to="/admin" state={{ from: location.pathname }} replace />
  return <Outlet />
}

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox, permission: 'enquiries' as const },
  { to: '/admin/content', label: 'Website content', icon: FileEdit, permission: 'content' as const },
]

export function AdminLayout() {
  const { session, signOut, can } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  if (!session) return null

  return (
    <div className="min-h-screen bg-mist">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-[11px] text-amber-800">
        {session.demo
          ? 'Preview admin session. Data and content are stored in this browser only.'
          : 'Authorised staff area. Handle client data in line with your confidentiality policy.'}
      </div>
      <div className="flex">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-100 bg-white lg:sticky lg:top-0 lg:flex lg:h-[calc(100vh-33px)]">
          <div className="border-b border-navy-100 px-5 py-5">
            <Logo />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-navy-400">Staff dashboard</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
                {NAV.filter((item) => !item.permission || can(item.permission)).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition',
                    isActive ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-navy-500 transition hover:bg-navy-50 hover:text-navy-900"
            >
              <ExternalLink className="h-4 w-4" /> View website
            </a>
          </nav>
          <div className="border-t border-navy-100 p-3">
            <div className="rounded-xl bg-mist p-3">
              <p className="truncate text-[12px] font-bold text-navy-900">{session.name}</p>
              <p className="truncate text-[10.5px] text-navy-400">{session.email}</p>
              <span className="mt-1.5 inline-block rounded-full bg-navy-200/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-navy-600">
                {session.role}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold text-navy-500 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-100 bg-white px-4 lg:hidden">
            <Logo compact />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-navy-400">{session.role}</span>
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-navy-200 text-navy-800"
                aria-label="Toggle admin menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </header>

          {menuOpen && (
            <div className="border-b border-navy-100 bg-white p-3 lg:hidden">
              <nav className="space-y-1">
            {NAV.filter((item) => !item.permission || can(item.permission)).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold',
                        isActive ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" /> {item.label}
                  </NavLink>
                ))}
                <a href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-navy-500">
                  <ExternalLink className="h-4 w-4" /> View website
                </a>
              </nav>
              <div className="mt-3 flex items-center justify-between border-t border-navy-100 pt-3">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-navy-900">{session.name}</p>
                  <p className="truncate text-[10px] text-navy-400">{session.email}</p>
                </div>
                <button type="button" onClick={() => void signOut()} className="text-[11px] font-semibold text-red-600">
                  Sign out
                </button>
              </div>
            </div>
          )}

          <main className="p-4 sm:p-6 lg:p-8" key={location.pathname}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export function AdminPageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-body/65">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function AccessDenied() {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
      <ShieldAlert className="mx-auto h-8 w-8 text-red-500" />
      <h2 className="mt-3 font-display text-xl font-bold text-navy-900">Access restricted</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-body/70">
        Your role does not include access to this section. Contact an administrator if you need additional permissions.
      </p>
    </div>
  )
}

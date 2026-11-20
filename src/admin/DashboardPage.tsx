import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, CalendarDays, FileEdit, Inbox, RefreshCw, TrendingUp, Users } from 'lucide-react'
import { AdminPageHeader } from './AdminLayout'
import { AdminPanel, AdminStat, KindBadge, StatusBadge } from './AdminBits'
import { useAuth } from '../store/auth'
import { useLeads } from './useLeads'
import { useContent } from '../store/content'
import { formatDateTime } from '../lib/utils'

export function AdminDashboardPage() {
  const { session, can } = useAuth()
  const { leads, loading, error, refresh } = useLeads()
  const { articles, destinations, testimonials, packages } = useContent()
  const canViewLeads = can('enquiries')
  const canViewContent = can('content')

  const newLeads = leads.filter((lead) => lead.status === 'new').length
  const weekLeads = leads.filter((lead) => Date.now() - new Date(lead.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length
  const converted = leads.filter((lead) => lead.status === 'converted').length
  const pendingSync = leads.filter((lead) => lead.integrationStatus.startsWith('pending')).length
  const localMode = leads.length > 0 && leads.every((lead) => lead.origin === 'local')

  return (
    <div>
      <AdminPageHeader
        title={`Welcome, ${session?.name.split(' ')[0] ?? 'team'}`}
        description={
          canViewLeads
            ? 'A live view of incoming enquiries, follow-up status and content readiness.'
            : 'A view of the website content you can manage.'
        }
        action={
          <button type="button" onClick={refresh} className="btn-outline">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />

      {localMode && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12px] leading-relaxed text-amber-900">
          <strong className="font-bold">Preview data.</strong> These leads are stored in this browser because Supabase is not
          configured. Production submissions will be written to Supabase and queued for CRM sync.
        </div>
      )}

      {canViewLeads && error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[12px] text-red-800">
          Could not load leads: {error}
        </div>
      )}

      {canViewLeads ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStat label="Total leads" value={loading ? '—' : leads.length} hint="Enquiries, consultations and flights" icon={<Users className="h-4 w-4" />} />
            <AdminStat label="New" value={loading ? '—' : newLeads} hint="Awaiting first contact" tone="gold" icon={<Inbox className="h-4 w-4" />} />
            <AdminStat label="Last 7 days" value={loading ? '—' : weekLeads} hint="All lead types" tone="green" icon={<TrendingUp className="h-4 w-4" />} />
            <AdminStat label="Converted" value={loading ? '—' : converted} hint="Marked by your team" icon={<CalendarDays className="h-4 w-4" />} />
          </div>

          {pendingSync > 0 && (
            <div className="mt-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12px] text-amber-800 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> {pendingSync} lead{pendingSync === 1 ? '' : 's'} awaiting CRM/email integration.
              </span>
              <span className="text-[11px] text-amber-700">Configure Supabase Edge Function secrets to process the queue.</span>
            </div>
          )}

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
            <AdminPanel
              title="Recent enquiries"
              description="The latest submissions across all lead types."
              action={<Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-[11px] font-bold text-navy-700 hover:text-gold-700">View all <ArrowRight className="h-3.5 w-3.5" /></Link>}
            >
              {loading ? (
                <p className="py-8 text-center text-sm text-navy-400">Loading leads…</p>
              ) : leads.length === 0 ? (
                <div className="py-10 text-center">
                  <Inbox className="mx-auto h-7 w-7 text-navy-300" />
                  <p className="mt-3 text-sm font-semibold text-navy-700">No enquiries yet</p>
                  <p className="mt-1 text-[12px] text-navy-400">New submissions will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className="border-b border-navy-100 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                        <th className="pb-3 pr-4">Lead</th>
                        <th className="pb-3 pr-4">Type</th>
                        <th className="pb-3 pr-4">Service</th>
                        <th className="pb-3 pr-4">Received</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-50">
                      {leads.slice(0, 6).map((lead) => (
                        <tr key={lead.id} className="text-[12px]">
                          <td className="py-3 pr-4">
                            <p className="font-semibold text-navy-900">{lead.fullName}</p>
                            <p className="text-[10.5px] text-navy-400">{lead.email || lead.phone}</p>
                          </td>
                          <td className="py-3 pr-4"><KindBadge kind={lead.kind} /></td>
                          <td className="py-3 pr-4 text-navy-600">{lead.serviceCategory || '—'}{lead.destination ? ` • ${lead.destination}` : ''}</td>
                          <td className="py-3 pr-4 text-navy-500">{formatDateTime(lead.createdAt)}</td>
                          <td className="py-3"><StatusBadge status={lead.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </AdminPanel>

            <div className="space-y-5">
              <AdminPanel title="Quick actions">
                <div className="space-y-2">
                  <Link to="/admin/enquiries" className="flex items-center justify-between rounded-xl bg-navy-50 p-3 text-[12px] font-semibold text-navy-800 hover:bg-navy-100">
                    Review new leads <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {canViewContent && (
                    <Link to="/admin/content" className="flex items-center justify-between rounded-xl bg-navy-50 p-3 text-[12px] font-semibold text-navy-800 hover:bg-navy-100">
                      Update website content <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <a href="/" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-navy-50 p-3 text-[12px] font-semibold text-navy-800 hover:bg-navy-100">
                    View public website <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </AdminPanel>

              {canViewContent && (
                <AdminPanel title="Content status">
                  <div className="space-y-3 text-[12px]">
                    {[
                      { label: 'Destinations', value: destinations.filter((item) => item.published).length, to: '/admin/content' },
                      { label: 'Articles', value: articles.filter((item) => item.published).length, to: '/admin/content' },
                      { label: 'Testimonials', value: testimonials.filter((item) => item.published && item.permissionConfirmed).length, to: '/admin/content' },
                      { label: 'Packages', value: packages.filter((item) => item.published).length, to: '/admin/content' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between border-b border-navy-50 pb-2 last:border-0 last:pb-0">
                        <span className="text-navy-500">{item.label}</span>
                        <span className="font-bold text-navy-900">{item.value}</span>
                      </div>
                    ))}
                    <Link to="/admin/content" className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-gold-700 hover:text-gold-800">
                      <FileEdit className="h-3.5 w-3.5" /> Manage content
                    </Link>
                  </div>
                </AdminPanel>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStat label="Published articles" value={articles.filter((item) => item.published).length} />
          <AdminStat label="Published destinations" value={destinations.filter((item) => item.published).length} />
          <AdminStat label="Verified stories" value={testimonials.filter((item) => item.published && item.permissionConfirmed).length} />
          <AdminStat label="Published packages" value={packages.filter((item) => item.published).length} />
        </div>
      )}
    </div>
  )
}

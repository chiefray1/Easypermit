import { useState } from 'react'
import { Globe2, HelpCircle, Newspaper, Quote, Settings2, Sun } from 'lucide-react'
import { AccessDenied, AdminPageHeader } from '../AdminLayout'
import { useAuth } from '../../store/auth'
import { useContent } from '../../store/content'
import { cn } from '../../lib/utils'
import { SiteSettingsTab } from './SiteSettingsTab'
import { DestinationsTab } from './DestinationsTab'
import { ArticlesTab } from './ArticlesTab'
import { TestimonialsTab } from './TestimonialsTab'
import { PackagesTab } from './PackagesTab'
import { FaqsTab } from './FaqsTab'

type TabKey = 'settings' | 'destinations' | 'articles' | 'testimonials' | 'packages' | 'faqs'

export function AdminContentPage() {
  const { can } = useAuth()
  const { destinations, articles, testimonials, packages, faqs } = useContent()
  const [tab, setTab] = useState<TabKey>('settings')

  if (!can('content')) return <AccessDenied />

  const tabs: { key: TabKey; label: string; icon: typeof Settings2; count?: number }[] = [
    { key: 'settings', label: 'Site settings', icon: Settings2 },
    { key: 'destinations', label: 'Destinations', icon: Globe2, count: destinations.length },
    { key: 'articles', label: 'Articles', icon: Newspaper, count: articles.length },
    { key: 'testimonials', label: 'Testimonials', icon: Quote, count: testimonials.length },
    { key: 'packages', label: 'Packages', icon: Sun, count: packages.length },
    { key: 'faqs', label: 'FAQs', icon: HelpCircle, count: faqs.length },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Website content"
        description="Manage the content that appears on the public website. Publish only verified information and client stories with permission."
      />

      <div className="mb-5 flex gap-1.5 overflow-x-auto rounded-2xl border border-navy-100 bg-white p-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition',
              tab === item.key ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50',
            )}
          >
            <item.icon className={cn('h-3.5 w-3.5', tab === item.key ? 'text-gold-300' : 'text-gold-600')} />
            {item.label}
            {typeof item.count === 'number' && (
              <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold', tab === item.key ? 'bg-white/15 text-white' : 'bg-navy-100 text-navy-500')}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'settings' && <SiteSettingsTab />}
      {tab === 'destinations' && <DestinationsTab />}
      {tab === 'articles' && <ArticlesTab />}
      {tab === 'testimonials' && <TestimonialsTab />}
      {tab === 'packages' && <PackagesTab />}
      {tab === 'faqs' && <FaqsTab />}
    </div>
  )
}

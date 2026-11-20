import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Faq } from '../data/types'
import { cn } from '../lib/utils'

export function FaqAccordion({ items, defaultOpen }: { items: Faq[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? items[0]?.id ?? null)

  return (
    <div className="divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white">
      {items.map((item) => {
        const expanded = open === item.id
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left sm:px-6"
              onClick={() => setOpen(expanded ? null : item.id)}
              aria-expanded={expanded}
            >
              <span className={cn('text-[14.5px] font-semibold', expanded ? 'text-navy-900' : 'text-navy-800')}>
                {item.question}
              </span>
              <span
                className={cn(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full border transition',
                  expanded ? 'rotate-45 border-gold-500 bg-gold-500 text-white' : 'border-navy-200 text-navy-500',
                )}
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
            </button>
            {expanded && (
              <div className="px-5 pb-5 sm:px-6">
                <p className="max-w-3xl text-sm leading-relaxed text-body/80">{item.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

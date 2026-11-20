import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { useContent } from '../../store/content'
import type { SiteConfig } from '../../data/types'
import { isEmail } from '../../lib/utils'
import { TextField, TextareaField } from '../../components/forms/FormBits'

export function SiteSettingsTab() {
  const { site, updateSite, exportContent, importContent, resetContent } = useContent()
  const [form, setForm] = useState<SiteConfig>(site)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm(site)
  }, [site])

  function contact<K extends keyof SiteConfig['contact']>(key: K, value: SiteConfig['contact'][K]) {
    setForm((current) => ({ ...current, contact: { ...current.contact, [key]: value } }))
  }

  function social<K extends keyof SiteConfig['social']>(key: K, value: SiteConfig['social'][K]) {
    setForm((current) => ({ ...current, social: { ...current.social, [key]: value } }))
  }

  function save() {
    setError('')
    setMessage('')
    if (form.contact.email && !isEmail(form.contact.email)) {
      setError('Enter a valid contact email address or leave it blank.')
      return
    }
    updateSite(form)
    setMessage('Website settings saved.')
    window.setTimeout(() => setMessage(''), 3000)
  }

  function handleExport() {
    const blob = new Blob([exportContent()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `easypermit-content-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    setMessage('')
    try {
      const text = await file.text()
      importContent(text)
      setMessage('Content imported. Review the site and save any further edits.')
    } catch {
      setError('That file could not be imported. Use a JSON export from this page.')
    } finally {
      event.target.value = ''
    }
  }

  function handleReset() {
    if (!window.confirm('Reset all website content to the defaults? This cannot be undone.')) return
    resetContent()
    setMessage('Content reset to defaults.')
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12px] leading-relaxed text-amber-900">
        <strong className="font-bold">Preview content store.</strong> Changes are saved in this browser. When Supabase is
        connected, the content tables in the migration can be used to make edits shared across devices and staff. Keep the
        JSON export as a backup before switching environments.
      </div>

      <section className="rounded-2xl border border-navy-100 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-navy-900">Brand and contact</h2>
        <p className="mt-0.5 text-[11.5px] text-navy-400">These details appear in the navigation, footer and contact page.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField name="site-name" label="Business name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <TextField name="site-short" label="Short name" value={form.shortName} onChange={(value) => setForm({ ...form, shortName: value })} />
          <TextField name="site-legal" label="Legal name" value={form.legalName} onChange={(value) => setForm({ ...form, legalName: value })} />
          <TextField name="site-tagline" label="Tagline" value={form.tagline} onChange={(value) => setForm({ ...form, tagline: value })} />
          <TextareaField name="site-description" label="Business description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} className="sm:col-span-2" />
          <TextField name="contact-phone-display" label="Phone (display)" value={form.contact.phoneDisplay} onChange={(value) => contact('phoneDisplay', value)} placeholder="+234 …" />
          <TextField name="contact-phone-e164" label="Phone (dial link)" value={form.contact.phoneE164} onChange={(value) => contact('phoneE164', value)} placeholder="+234…" hint="Use the full international format." />
          <TextField name="contact-whatsapp" label="WhatsApp number" value={form.contact.whatsappE164} onChange={(value) => contact('whatsappE164', value)} placeholder="234…" hint="Digits only, including country code. Leave blank to hide WhatsApp buttons." />
          <TextField name="contact-email" label="Email address" type="email" value={form.contact.email} onChange={(value) => contact('email', value)} placeholder="hello@example.com" />
          <TextField name="contact-hours" label="Opening hours" value={form.contact.hours} onChange={(value) => contact('hours', value)} />
          <TextareaField name="contact-address" label="Office address" value={form.contact.address} onChange={(value) => contact('address', value)} className="sm:col-span-2" rows={2} />
        </div>
        <div className="mt-6 border-t border-navy-100 pt-5">
          <h3 className="text-sm font-bold text-navy-900">Social profiles</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <TextField name="social-instagram" label="Instagram URL" value={form.social.instagram} onChange={(value) => social('instagram', value)} />
            <TextField name="social-facebook" label="Facebook URL" value={form.social.facebook} onChange={(value) => social('facebook', value)} />
            <TextField name="social-tiktok" label="TikTok URL" value={form.social.tiktok} onChange={(value) => social('tiktok', value)} />
            <TextField name="social-linkedin" label="LinkedIn URL" value={form.social.linkedin} onChange={(value) => social('linkedin', value)} />
          </div>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11.5px] text-red-700">{error}</p>}
        {message && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[11.5px] text-emerald-700">{message}</p>}
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={save} className="btn-primary">Save website settings</button>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-100 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-navy-900">Content backup</h2>
        <p className="mt-0.5 text-[11.5px] text-navy-400">Export before importing or resetting. Import replaces the current content store.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={handleExport} className="btn-outline">
            <Download className="h-4 w-4" /> Export JSON
          </button>
          <button type="button" onClick={() => fileInput.current?.click()} className="btn-outline">
            <Upload className="h-4 w-4" /> Import JSON
          </button>
          <input ref={fileInput} type="file" accept="application/json" onChange={handleImport} className="hidden" aria-hidden="true" />
          <button type="button" onClick={handleReset} className="btn-ghost text-red-600 hover:bg-red-50">
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-100 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-navy-900">Environment overrides</h2>
        <p className="mt-0.5 text-[11.5px] text-navy-400">
          Contact details and integration keys can also be supplied through environment variables. Contact values saved here
          take precedence over <span className="font-mono">VITE_CONTACT_*</span> fallbacks.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-navy-50 p-3 text-[11px] text-navy-600">
            <p className="font-bold text-navy-800">VITE_WHATSAPP_NUMBER</p>
            <p className="mt-1">Fallback WhatsApp number if none is saved above.</p>
          </div>
          <div className="rounded-xl bg-navy-50 p-3 text-[11px] text-navy-600">
            <p className="font-bold text-navy-800">VITE_CONTACT_EMAIL</p>
            <p className="mt-1">Fallback email if none is saved above.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

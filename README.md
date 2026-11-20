# Easy Permit Travel Services

Production-oriented marketing and enquiry website for Easy Permit Travel Services, built with React, TypeScript, Vite, Tailwind CSS and Supabase.

## Included

- Public pages for study abroad, destinations, visas, travel, flights, holidays, resources, FAQs, contact and legal information.
- Study assessment, consultation booking and flight enquiry forms with consent capture.
- Supabase lead persistence and row-level security.
- Zoho CRM lead sync and Resend acknowledgement email edge functions.
- Staff dashboard with role-based access, lead filters, CSV export, status updates and content editors.
- SEO metadata, canonical URLs, JSON-LD, sitemap, robots rules and consent-gated analytics.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5174`.

Without Supabase credentials, development mode stores leads and content in the browser. This is preview behaviour only. In production, forms fail rather than pretending to persist data.

The preview admin is available at `/admin` with:

```text
admin@easypermit.local
demo-only
```

This bypass only works in development and is disabled in production builds.

## Environment

Frontend variables are listed in `.env.example`. Only variables prefixed with `VITE_` are exposed to the browser.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Canonical production URL, without a trailing slash. |
| `VITE_SUPABASE_URL` | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key. Safe for the browser with RLS enabled. |
| `VITE_CONTACT_PHONE` | Fallback phone number. |
| `VITE_CONTACT_EMAIL` | Fallback contact email. |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number, digits only including country code. |
| `VITE_GA_MEASUREMENT_ID` | Optional GA4 measurement ID. |
| `VITE_META_PIXEL_ID` | Optional Meta pixel ID. |
| `VITE_TIKTOK_PIXEL_ID` | Optional TikTok pixel ID. |

## Supabase setup

```bash
supabase link --project-ref <project-ref>
supabase db push
```

The migration creates all tables, enums, indexes, triggers, RLS policies and starter FAQs.

Create staff users in Supabase Auth, then create their profile rows. The dashboard requires a profile row with a valid role.

```sql
insert into public.profiles (id, full_name, role)
values ('<auth-user-id>', 'Staff Name', 'admin')
on conflict (id) do update set full_name = excluded.full_name, role = excluded.role;
```

Roles:

- `admin`: leads, content and settings. Can delete lead records.
- `editor`: content management only.
- `staff`: lead review and status updates only.

Do not enable public sign-ups unless you have another approval process. A user without a profile is rejected and signed out.

## Edge functions

Copy `supabase/.env.example` to `supabase/.env`, fill in the secrets, then deploy:

```bash
supabase secrets set --env-file supabase/.env
supabase functions deploy zoho-lead
supabase functions deploy send-acknowledgement
```

The browser invokes both functions after a successful Supabase insert.

### Zoho CRM

Create a Zoho OAuth client with access to the Leads module and generate a refresh token with at least:

```text
ZohoCRM.modules.leads.CREATE
```

Set the correct regional accounts and API domains, for example:

```text
ZOHO_ACCOUNTS_URL=https://accounts.zoho.eu
ZOHO_API_DOMAIN=https://www.zohoapis.eu
```

The function updates `integration_status` and `zoho_record_id` only after Zoho returns a record id. Missing credentials leave the lead as `pending_configuration`; failures are marked `failed` and written to `integration_logs`.

### Resend email

Verify the sending domain in Resend. `FROM_EMAIL` must use that verified domain. The acknowledgement function sends a client receipt and, when configured, a team notification. Email failures are logged but do not change the CRM sync status.

## Content management

The dashboard content editors currently persist to browser storage under `easypermit:content:v1`. They support JSON export, import and reset. The Supabase content tables and RLS policies are included for a server-backed CMS, but the frontend content provider is not yet wired to them.

Before relying on content changes across devices or staff, either:

1. Connect the content provider to the Supabase tables, or
2. Use the JSON export as the source of truth and keep a single content administrator.

Do not treat browser-local content as shared production data.

## Lead data

- Enquiries use `enquiries`, consultations use `consultation_bookings`, and flight requests use `flight_enquiries`.
- Anonymous users can insert only when `consent = true`.
- Staff can read and update leads according to RLS.
- CSV exports are generated in the browser from the records the signed-in user can access.
- Browser preview leads use `easypermit:leads:v1` and are never uploaded.

## Deployment

The repository includes `vercel.json` and `public/_redirects`.

1. Set the production environment variables in the hosting provider.
2. Deploy the Supabase migration and edge functions.
3. Update `VITE_SITE_URL`.
4. Replace the placeholder domain in `public/sitemap.xml` and `public/robots.txt`.
5. Add the real domain to the Resend and Zoho configurations.
6. Confirm HTTPS, SPA rewrites, admin `noindex` behaviour and form delivery.

Build check:

```bash
npm run typecheck
npm run build
```

## Content and claims

The site intentionally avoids invented contact details, testimonials, prices, tuition figures and approval guarantees. Add only verified business information. Testimonials require recorded permission before publication, enforced by the database check and reflected in the admin editor.

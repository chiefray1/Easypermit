create extension if not exists pgcrypto;

create type public.staff_role as enum ('admin', 'editor', 'staff');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'closed');
create type public.integration_status as enum ('pending', 'queued', 'synced', 'failed', 'pending_configuration');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.staff_role not null default 'staff',
  created_at timestamptz not null default now()
);

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  country text not null,
  flag text not null default '',
  image_url text not null default '',
  intro text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  reasons jsonb not null default '[]'::jsonb,
  courses jsonb not null default '[]'::jsonb,
  study_levels jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  expenses_note text not null default '',
  scholarships jsonb not null default '[]'::jsonb,
  intakes jsonb not null default '[]'::jsonb,
  visa_steps jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  last_verified date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  country_of_residence text not null default '',
  service_category text not null default 'other',
  destination text not null default '',
  preferred_intake text not null default '',
  budget_range text not null default '',
  details jsonb not null default '{}'::jsonb,
  lead_source text not null default 'website',
  utm jsonb not null default '{}'::jsonb,
  consent boolean not null default false,
  consent_at timestamptz,
  status public.lead_status not null default 'new',
  integration_status public.integration_status not null default 'pending',
  zoho_record_id text,
  created_at timestamptz not null default now(),
  constraint enquiries_consent_required check (consent = true)
);

create table public.consultation_bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  service_category text not null default 'other',
  preferred_date date,
  preferred_time text,
  notes text not null default '',
  consent boolean not null default false,
  consent_at timestamptz,
  lead_source text not null default 'website',
  status public.lead_status not null default 'new',
  integration_status public.integration_status not null default 'pending',
  zoho_record_id text,
  created_at timestamptz not null default now(),
  constraint consultation_consent_required check (consent = true)
);

create table public.flight_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  departure_city text not null,
  destination text not null,
  departure_date date,
  return_date date,
  trip_type text not null default 'Return',
  passengers integer not null default 1 check (passengers between 1 and 30),
  cabin_class text not null default 'Economy',
  notes text not null default '',
  consent boolean not null default false,
  consent_at timestamptz,
  lead_source text not null default 'website',
  status public.lead_status not null default 'new',
  integration_status public.integration_status not null default 'pending',
  zoho_record_id text,
  created_at timestamptz not null default now(),
  constraint flight_consent_required check (consent = true)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  category text not null default 'General',
  cover_image text not null default '',
  read_minutes integer not null default 5 check (read_minutes > 0),
  content jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  service_category text not null,
  destination text,
  quote text not null,
  outcome text,
  story_date date,
  permission_confirmed boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint testimonial_permission_required check (not published or permission_confirmed)
);

create table public.holiday_packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text not null,
  duration text not null,
  group_type text not null default 'Private',
  departure_period text not null default '',
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  indicative_price numeric(12, 2),
  currency text not null default 'NGN',
  price_note text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'General',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.integration_logs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  reference_id uuid,
  status text not null,
  message text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,
  subject_id uuid,
  consent_type text not null,
  granted boolean not null,
  source text,
  created_at timestamptz not null default now()
);

create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_status_idx on public.enquiries (status);
create index enquiries_service_idx on public.enquiries (service_category);
create index consultation_created_at_idx on public.consultation_bookings (created_at desc);
create index consultation_status_idx on public.consultation_bookings (status);
create index flight_created_at_idx on public.flight_enquiries (created_at desc);
create index flight_status_idx on public.flight_enquiries (status);
create index articles_published_idx on public.articles (published, published_at desc);
create index destinations_published_idx on public.destinations (published);
create index testimonials_published_idx on public.testimonials (published, permission_confirmed);
create index packages_published_idx on public.holiday_packages (published);
create index faqs_published_idx on public.faqs (published, category, sort_order);
create index integration_logs_reference_idx on public.integration_logs (reference_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger destinations_updated_at before update on public.destinations
for each row execute function public.set_updated_at();

create trigger articles_updated_at before update on public.articles
for each row execute function public.set_updated_at();

create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor', 'staff')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.can_manage_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.can_manage_leads()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

alter table public.profiles enable row level security;
alter table public.service_categories enable row level security;
alter table public.destinations enable row level security;
alter table public.enquiries enable row level security;
alter table public.consultation_bookings enable row level security;
alter table public.flight_enquiries enable row level security;
alter table public.articles enable row level security;
alter table public.testimonials enable row level security;
alter table public.holiday_packages enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.integration_logs enable row level security;
alter table public.consent_records enable row level security;

create policy "profiles_select_own" on public.profiles
for select to authenticated using (id = auth.uid());

create policy "profiles_select_staff" on public.profiles
for select to authenticated using (public.is_staff());

create policy "profiles_admin_all" on public.profiles
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "service_categories_public_read" on public.service_categories
for select to anon, authenticated using (active = true);

create policy "service_categories_staff_read" on public.service_categories
for select to authenticated using (public.is_staff());

create policy "service_categories_content_write" on public.service_categories
for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "destinations_public_read" on public.destinations
for select to anon, authenticated using (published = true);

create policy "destinations_staff_read" on public.destinations
for select to authenticated using (public.is_staff());

create policy "destinations_content_write" on public.destinations
for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "articles_public_read" on public.articles
for select to anon, authenticated using (published = true);

create policy "articles_staff_read" on public.articles
for select to authenticated using (public.is_staff());

create policy "articles_content_write" on public.articles
for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "testimonials_public_read" on public.testimonials
for select to anon, authenticated using (published = true and permission_confirmed = true);

create policy "testimonials_staff_read" on public.testimonials
for select to authenticated using (public.is_staff());

create policy "testimonials_content_write" on public.testimonials
for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "packages_public_read" on public.holiday_packages
for select to anon, authenticated using (published = true);

create policy "packages_staff_read" on public.holiday_packages
for select to authenticated using (public.is_staff());

create policy "packages_content_write" on public.holiday_packages
for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "faqs_public_read" on public.faqs
for select to anon, authenticated using (published = true);

create policy "faqs_staff_read" on public.faqs
for select to authenticated using (public.is_staff());

create policy "faqs_content_write" on public.faqs
for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "site_settings_public_read" on public.site_settings
for select to anon, authenticated using (true);

create policy "site_settings_content_write" on public.site_settings
for all to authenticated using (public.can_manage_content()) with check (public.can_manage_content());

create policy "enquiries_public_insert" on public.enquiries
for insert to anon, authenticated with check (consent = true);

create policy "enquiries_staff_read" on public.enquiries
for select to authenticated using (public.can_manage_leads());

create policy "enquiries_staff_update" on public.enquiries
for update to authenticated using (public.can_manage_leads()) with check (public.can_manage_leads());

create policy "enquiries_admin_delete" on public.enquiries
for delete to authenticated using (public.is_admin());

create policy "consultation_public_insert" on public.consultation_bookings
for insert to anon, authenticated with check (consent = true);

create policy "consultation_staff_read" on public.consultation_bookings
for select to authenticated using (public.can_manage_leads());

create policy "consultation_staff_update" on public.consultation_bookings
for update to authenticated using (public.can_manage_leads()) with check (public.can_manage_leads());

create policy "consultation_admin_delete" on public.consultation_bookings
for delete to authenticated using (public.is_admin());

create policy "flight_public_insert" on public.flight_enquiries
for insert to anon, authenticated with check (consent = true);

create policy "flight_staff_read" on public.flight_enquiries
for select to authenticated using (public.can_manage_leads());

create policy "flight_staff_update" on public.flight_enquiries
for update to authenticated using (public.can_manage_leads()) with check (public.can_manage_leads());

create policy "flight_admin_delete" on public.flight_enquiries
for delete to authenticated using (public.is_admin());

create policy "integration_logs_staff_read" on public.integration_logs
for select to authenticated using (public.can_manage_leads());

create policy "integration_logs_admin_delete" on public.integration_logs
for delete to authenticated using (public.is_admin());

create policy "consent_records_admin_read" on public.consent_records
for select to authenticated using (public.is_admin());

grant usage on schema public to anon, authenticated;

grant select on public.service_categories, public.destinations, public.articles,
  public.testimonials, public.holiday_packages, public.faqs, public.site_settings
to anon, authenticated;

grant insert on public.enquiries, public.consultation_bookings, public.flight_enquiries
to anon, authenticated;

grant select, update, delete on public.profiles, public.enquiries, public.consultation_bookings,
  public.flight_enquiries, public.service_categories, public.destinations, public.articles,
  public.testimonials, public.holiday_packages, public.faqs, public.site_settings,
  public.integration_logs, public.consent_records
to authenticated;

grant insert, update, delete on public.service_categories, public.destinations, public.articles,
  public.testimonials, public.holiday_packages, public.faqs, public.site_settings
to authenticated;

grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.can_manage_content() to authenticated;
grant execute on function public.can_manage_leads() to authenticated;

insert into public.service_categories (slug, name, description)
values
  ('study-abroad', 'Study Abroad', 'Course, institution and application guidance.'),
  ('visa-services', 'Visa Consultancy', 'Visa requirement review and application preparation.'),
  ('flight-booking', 'Flight Reservations', 'Route, fare and itinerary guidance.'),
  ('tours-holidays', 'Tours & Holidays', 'Personalised holiday planning.')
on conflict (slug) do nothing;

insert into public.site_settings (key, value)
values (
  'site',
  '{
    "name": "Easy Permit Travel Services",
    "shortName": "Easy Permit",
    "tagline": "Your Global Journey. Made Easier.",
    "legalName": "Easy Permit Travel Services",
    "contact": {
      "phoneDisplay": "",
      "phoneE164": "",
      "whatsappE164": "",
      "email": "",
      "address": "",
      "hours": "Monday–Friday, 9:00–17:00 (WAT)"
    }
  }'::jsonb
)
on conflict (key) do nothing;

insert into public.faqs (question, answer, category, published, sort_order)
values
  ('Do you guarantee admission or visa approval?', 'No. Admission decisions belong to institutions and visa decisions belong to the relevant authorities. We provide guidance, document support and preparation, but we cannot guarantee an outcome.', 'General', true, 1),
  ('How much do your services cost?', 'Fees depend on the service and scope of support. After your assessment or consultation, we confirm the applicable fees and what is included in writing before work begins. Third-party costs are separate.', 'Fees & Payments', true, 2),
  ('Which study destinations do you support?', 'Our current destination pages cover the United Kingdom, Germany, Canada, the United States, Malaysia and Ireland. Contact us if your preferred destination is not listed.', 'Study Abroad', true, 3),
  ('Can you help if I have a previous visa refusal?', 'Yes, we can review your history and help you understand what may need to change in a new application. A previous refusal does not automatically prevent approval, but it must be addressed honestly and consistently.', 'Visas', true, 4),
  ('Do you help with scholarships?', 'We can point you toward scholarship sources and help you organise supporting documents. We do not award scholarships and cannot guarantee that you will receive one.', 'Study Abroad', true, 5),
  ('How early should I start my application?', 'Start as early as practical. University deadlines, visa processing and travel arrangements can take months. A useful target is six to twelve months before your intended intake, though timelines vary.', 'Study Abroad', true, 6),
  ('Can you book flights after my visa is approved?', 'Yes. We can compare flight options at any stage, but check the visa and travel conditions before purchasing a restrictive ticket.', 'Flights & Travel', true, 7),
  ('Do you arrange accommodation?', 'Accommodation support depends on the destination and service. Tell us what you need in your assessment and we will confirm what can be included.', 'Flights & Travel', true, 8),
  ('How will you contact me?', 'We use the contact details you provide, normally by email and WhatsApp. We only contact you about your enquiry and related services.', 'General', true, 9),
  ('What should I prepare before a consultation?', 'Bring your academic results, English test results if available, passport details, intended intake, preferred destinations and a realistic budget. For visa enquiries, include your travel purpose, dates and any previous refusal history.', 'General', true, 10)
on conflict do nothing;

-- Indexes, row-level security, and the single public read surface for the job board.

-- ── Indexes ──────────────────────────────────────────────────────────────────
-- At v1 volume (tens to low hundreds of rows) none of these matter for speed. They
-- exist so that moving from client-side filtering to server-side SQL filtering in a
-- later phase is a query change rather than a migration.

create index idx_jobs_live on public.jobs (posted_at desc) where status = 'published';
create index idx_jobs_expires on public.jobs (expires_at) where status = 'published';
create index idx_jobs_role_family on public.jobs (role_family) where status = 'published';
create index idx_jobs_seniority on public.jobs (seniority) where status = 'published';
create index idx_jobs_state on public.jobs (state_code) where status = 'published';
create index idx_jobs_remote_type on public.jobs (remote_type) where status = 'published';
create index idx_jobs_employment on public.jobs (employment_type) where status = 'published';
create index idx_jobs_salary_min on public.jobs (salary_min)
  where status = 'published' and salary_min is not null;
create index idx_jobs_company on public.jobs (company_id);
create index idx_jobs_search on public.jobs using gin (search_vector);
create index idx_jobs_tags on public.jobs using gin (tags);

create index idx_alert_subs_active on public.job_alert_subscribers (last_sent_at)
  where status = 'active';
create index idx_alert_subs_ip on public.job_alert_subscribers (signup_ip_hash, created_at);
create index idx_alert_subs_roles on public.job_alert_subscribers using gin (role_families);
create index idx_alert_subs_states on public.job_alert_subscribers using gin (states);

create index idx_alert_sends_digest on public.job_alert_sends (digest_id);
create index idx_alert_sends_sub on public.job_alert_sends (subscriber_id, sent_at desc);

-- ── Public reference data ────────────────────────────────────────────────────

alter table public.job_role_families enable row level security;
alter table public.us_states enable row level security;
alter table public.companies enable row level security;

create policy "Anyone reads role families"
  on public.job_role_families for select using (true);

create policy "Anyone reads states"
  on public.us_states for select using (true);

create policy "Anyone reads companies"
  on public.companies for select using (true);

-- ── Jobs: public read of live listings only ──────────────────────────────────

alter table public.jobs enable row level security;

create policy "Anyone reads live jobs"
  on public.jobs for select
  using (
    status = 'published'
    and posted_at <= now()
    and expires_at > now()
  );

-- No insert, update or delete policies anywhere in this file. The service role bypasses
-- RLS, and it is the only write path (the publish script and the alert cron route).

-- ── Alert tables: no anon access at all ──────────────────────────────────────
-- RLS enabled with zero policies is deny-by-default. There is deliberately no insert
-- policy: adding one would expose an unauthenticated write endpoint through PostgREST.
-- Signup writes go through a Next.js Server Action using the service-role client.

alter table public.job_alert_subscribers enable row level security;
alter table public.job_alert_sends enable row level security;

revoke all on public.job_alert_subscribers from anon, authenticated;
revoke all on public.job_alert_sends from anon, authenticated;

-- ── public_jobs: the one surface the application reads ───────────────────────
-- security_invoker is load-bearing. A plain view runs as its owner and would silently
-- bypass the RLS policy above, turning this into an unrestricted read of every draft
-- and expired row.

create view public.public_jobs
with (security_invoker = true) as
select
  j.id,
  j.slug,
  j.title,
  j.summary,
  j.description_html,
  j.role_family,
  rf.label as role_family_label,
  j.seniority,
  j.employment_type,
  j.remote_type,
  j.state_code,
  s.name as state_name,
  s.slug as state_slug,
  j.city,
  j.salary_min,
  j.salary_max,
  j.salary_currency,
  j.salary_period,
  j.salary_disclosed,
  j.apply_url,
  j.apply_email,
  j.tags,
  j.posted_at,
  j.expires_at,
  c.slug as company_slug,
  c.name as company_name,
  c.website as company_website,
  c.logo_url as company_logo_url,
  c.blurb as company_blurb
from public.jobs j
  join public.companies c on c.id = j.company_id
  join public.job_role_families rf on rf.slug = j.role_family
  left join public.us_states s on s.code = j.state_code
where j.status = 'published'
  and j.posted_at <= now()
  and j.expires_at > now();

grant select on public.public_jobs to anon, authenticated;

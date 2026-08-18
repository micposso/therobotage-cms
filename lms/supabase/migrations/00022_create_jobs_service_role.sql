-- Least-privilege Postgres role for the frontend's job-board write paths.
--
-- frontend/ (the public marketing site) previously reused this project's
-- SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS on every table in this database,
-- including the LMS's enrollments, submissions, RRA capstone data and credentials.
-- That gives a public signup form and a cron endpoint the same blast radius as the
-- LMS's own trusted backend. This role has no bypassrls and no grants outside the
-- tables below, so it can never read or write anything else in this project.
--
-- Covers every caller of frontend's getSupabaseJobsService() (formerly
-- getSupabaseAdmin()): subscribeJobAlerts, unsubscribeJobAlerts/resubscribeJobAlerts,
-- the one-click unsubscribe route, the alert cron, and the expired-job fallback read
-- in jobsQueries.ts.
--
-- After running this migration, mint a JWT with payload { "role": "jobs_alert_service" }
-- signed with this project's JWT secret (Project Settings -> API -> JWT Settings) and
-- set it as SUPABASE_JOBS_SERVICE_KEY on the frontend Railway service. Then remove
-- SUPABASE_SERVICE_ROLE_KEY from that service entirely -- it should no longer exist
-- outside the LMS deployment.

create role jobs_alert_service nologin noinherit;
grant jobs_alert_service to authenticator;
grant usage on schema public to jobs_alert_service;

-- Expired-job fallback read (jobsQueries.getExpiredJobBySlug). The existing "Anyone
-- reads live jobs" policy on public.jobs deliberately excludes draft/expired rows, so a
-- bare grant would do nothing here -- this role needs its own policy.
grant select on public.jobs, public.companies, public.job_role_families, public.us_states
  to jobs_alert_service;

create policy "jobs_alert_service reads every job"
  on public.jobs for select
  to jobs_alert_service
  using (true);

-- Weekly digest candidate query (cron/job-alerts) reads the same live-listing surface
-- anon already can, just via the service credential instead of the browser key.
grant select on public.public_jobs to jobs_alert_service;

-- Alert subscribers: signup upsert, unsubscribe/resubscribe updates, and the cron's
-- per-page reads + last_sent_at/send_count updates.
grant select, insert, update on public.job_alert_subscribers to jobs_alert_service;

create policy "jobs_alert_service manages subscribers"
  on public.job_alert_subscribers for all
  to jobs_alert_service
  using (true)
  with check (true);

-- Alert sends: the cron's dedupe read, claim insert, and claim-release delete after a
-- failed batch send.
grant select, insert, delete on public.job_alert_sends to jobs_alert_service;

create policy "jobs_alert_service manages sends"
  on public.job_alert_sends for all
  to jobs_alert_service
  using (true)
  with check (true);

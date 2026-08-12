-- Weekly job-alert digest subscribers and per-job send audit.

create table public.job_alert_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,

  -- An empty array means "everything". That is the default, and it is the
  -- highest-converting signup path, so a bare email with no preferences still works.
  role_families text[] not null default '{}',
  states text[] not null default '{}',
  seniorities text[] not null default '{}',
  remote_only boolean not null default false,

  status text not null default 'active'
    check (status in ('pending', 'active', 'unsubscribed', 'bounced', 'complained')),

  -- v1 is single opt-in. These two columns exist from day one so the Phase 2 switch to
  -- double opt-in needs no migration.
  confirm_token uuid not null default gen_random_uuid(),
  confirmed_at timestamptz,

  unsubscribe_token uuid not null unique default gen_random_uuid(),
  unsubscribed_at timestamptz,

  last_sent_at timestamptz,
  send_count integer not null default 0,

  -- Which page the signup came from, for lead attribution:
  -- 'jobs-index' | 'job-detail:<slug>' | 'role-page:<family>'
  source text,

  -- sha256(ip + JOB_ALERT_IP_SALT). Never store a raw IP address.
  signup_ip_hash text,
  user_agent text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The unique constraint below is the dedupe mechanism, not just an audit trail: a
-- subscriber can never be sent the same job twice, regardless of last_sent_at drift,
-- a re-run, or two overlapping cron invocations.
create table public.job_alert_sends (
  id bigint generated always as identity primary key,
  subscriber_id uuid not null references public.job_alert_subscribers(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  digest_id uuid not null,
  sent_at timestamptz not null default now(),
  unique (subscriber_id, job_id)
);

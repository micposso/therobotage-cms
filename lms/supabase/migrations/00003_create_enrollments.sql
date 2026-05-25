create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  cohort_id uuid not null references public.cohorts(id),
  course_slug text not null,
  status text not null default 'active'
    check (status in ('active', 'paused', 'complete')),
  lemon_squeezy_order_id text,
  is_founding boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, cohort_id)
);

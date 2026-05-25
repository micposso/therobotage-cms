create table public.week_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  week_number integer not null,
  state text not null default 'locked'
    check (state in (
      'locked', 'available', 'in_progress',
      'submitted', 'revision_requested', 'complete'
    )),
  content_viewed_at timestamptz,
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(enrollment_id, week_number)
);

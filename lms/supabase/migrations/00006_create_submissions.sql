create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  week_number integer not null,
  draft text not null default '',
  content text,
  submitted_at timestamptz,
  due_date timestamptz,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'revision_requested', 'approved')),
  is_late boolean not null default false,
  instructor_comment text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  draft_saved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(enrollment_id, week_number)
);

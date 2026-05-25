create table public.rra_submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  signal_clarity_score integer check (signal_clarity_score between 1 and 5),
  signal_clarity_rationale text,
  spatial_legibility_score integer check (spatial_legibility_score between 1 and 5),
  spatial_legibility_rationale text,
  perceived_presence_score integer check (perceived_presence_score between 1 and 5),
  perceived_presence_rationale text,
  failure_transparency_score integer check (failure_transparency_score between 1 and 5),
  failure_transparency_rationale text,
  interaction_fit_score integer check (interaction_fit_score between 1 and 5),
  interaction_fit_rationale text,
  recovery_design_score integer check (recovery_design_score between 1 and 5),
  recovery_design_rationale text,
  overall_summary text,
  total_res numeric(2,1),
  submitted_at timestamptz,
  due_date timestamptz,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'passed', 'revision_requested')),
  instructor_comment text,
  passed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(enrollment_id)
);

create table public.rra_files (
  id uuid primary key default gen_random_uuid(),
  rra_submission_id uuid not null references public.rra_submissions(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  storage_path text not null,
  uploaded_at timestamptz not null default now()
);

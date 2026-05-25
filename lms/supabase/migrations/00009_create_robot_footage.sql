create table public.robot_footage (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  week_number integer not null default 5,
  video_storage_path text not null,
  interaction_log_path text,
  uploaded_at timestamptz not null default now(),
  viewed_at timestamptz,
  uploaded_by uuid references public.profiles(id),
  unique(enrollment_id, week_number)
);

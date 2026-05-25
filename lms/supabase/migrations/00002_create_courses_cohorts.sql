create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_title text not null,
  description text,
  total_weeks integer not null default 6,
  created_at timestamptz not null default now()
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  name text not null,
  start_date date not null,
  week_start_dates date[] not null,
  zoom_url text,
  zoom_recording_url text,
  zoom_ics_url text,
  status text not null default 'upcoming'
    check (status in ('upcoming', 'active', 'complete')),
  max_seats integer default 10,
  created_at timestamptz not null default now()
);

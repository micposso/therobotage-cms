create table public.week_content (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  week_number integer not null,
  title text not null,
  subtitle text,
  format text not null default 'self_paced'
    check (format in ('live_zoom', 'self_paced', 'capstone')),
  rxd_dimensions text[] not null default '{}',
  estimated_hours numeric(3,1),
  body_markdown text not null default '',
  topics text[] not null default '{}',
  learning_outcomes text[] not null default '{}',
  resources jsonb not null default '[]',
  deliverable_prompt text,
  deliverable_word_min integer,
  deliverable_word_max integer,
  deliverable_accepts_files boolean not null default false,
  deliverable_file_types text[] default '{}',
  deliverable_max_file_size_mb integer default 25,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, week_number)
);

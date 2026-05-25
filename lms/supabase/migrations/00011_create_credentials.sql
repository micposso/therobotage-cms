create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  course_slug text not null,
  credential_net_badge_url text,
  credential_net_public_url text,
  issued_at timestamptz not null default now(),
  is_founding boolean not null default false
);

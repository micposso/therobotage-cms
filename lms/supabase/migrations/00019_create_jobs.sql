-- Companies and job listings for the marketing-site job board.
--
-- Source of truth for this data is markdown in frontend/jobs/*.md. Rows are written
-- only by frontend/scripts/publish-jobs.mjs using the service-role key. Never hand-edit
-- rows in the Supabase dashboard: the next publish run would overwrite the change, and
-- git would no longer describe what is live.

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  website text,
  logo_url text,
  blurb text,
  hq_city text,
  hq_state char(2) references public.us_states(code),
  size_bucket text
    check (size_bucket in ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  company_id uuid not null references public.companies(id) on delete restrict,

  -- Denormalized from companies. A generated column may only reference columns in its
  -- own row, so search_vector below cannot join to companies. The publish script keeps
  -- this in sync; nothing else writes it.
  company_name text not null,

  title text not null check (char_length(title) between 3 and 120),
  summary text not null check (char_length(summary) <= 180),
  description_md text not null,
  description_html text not null,

  role_family text not null references public.job_role_families(slug),
  seniority text not null
    check (seniority in ('intern', 'entry', 'mid', 'senior', 'staff', 'lead', 'director-plus')),
  employment_type text not null
    check (employment_type in ('full-time', 'part-time', 'contract', 'internship', 'temporary')),
  remote_type text not null
    check (remote_type in ('onsite', 'hybrid', 'remote-us')),

  state_code char(2) references public.us_states(code),
  city text,

  salary_min integer,
  salary_max integer,
  salary_currency char(3) not null default 'USD',
  salary_period text not null default 'year' check (salary_period in ('year', 'hour')),
  salary_disclosed boolean generated always as (salary_min is not null) stored,

  apply_url text,
  apply_email citext,
  tags text[] not null default '{}',

  posted_at timestamptz not null default now(),
  expires_at timestamptz not null,
  status text not null default 'published'
    check (status in ('draft', 'published', 'closed', 'archived')),

  source_url text,

  -- sha256 of the normalized frontmatter plus body. Lets the publish script skip
  -- unchanged rows instead of rewriting every job on every run.
  content_hash text not null,

  search_vector tsvector not null default ''::tsvector,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A physical role must say where it is. Fully remote roles are US-wide by policy.
  constraint jobs_location_required
    check (remote_type = 'remote-us' or (state_code is not null and city is not null)),
  constraint jobs_apply_route_required
    check (apply_url is not null or apply_email is not null),
  constraint jobs_salary_pairing
    check ((salary_min is null) = (salary_max is null)),
  constraint jobs_salary_order
    check (salary_max is null or salary_max >= salary_min),
  constraint jobs_salary_sanity
    check (
      salary_min is null
      or (salary_period = 'year' and salary_min between 20000 and 1500000 and salary_max <= 2000000)
      or (salary_period = 'hour' and salary_min >= 7 and salary_max <= 500)
    ),
  constraint jobs_expiry_after_post check (expires_at > posted_at)
);

create function public.set_jobs_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.company_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.city, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(new.tags, ' ')), 'C');

  return new;
end;
$$;

create trigger set_jobs_search_vector_before_write
before insert or update of title, company_name, summary, city, tags
on public.jobs
for each row
execute function public.set_jobs_search_vector();

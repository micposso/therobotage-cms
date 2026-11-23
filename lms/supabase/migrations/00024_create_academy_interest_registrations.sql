create table public.academy_interest_registrations (
  program text not null,
  version text not null,
  cohort text not null,
  email text not null check (email = lower(btrim(email)) and length(email) between 1 and 254),
  full_name text not null check (length(btrim(full_name)) between 1 and 254),
  audience text not null check (audience in ('student', 'professional')),
  primary_interest text check (primary_interest in ('design', 'product', 'research', 'other')),
  marketing_consent boolean not null,
  source_page text not null,
  utm jsonb not null,
  first_submitted_at timestamptz not null,
  last_submitted_at timestamptz not null,
  promo_eligible_at timestamptz,
  promo_audience text check (promo_audience in ('student', 'professional')),
  primary key (program, version, cohort, email)
);

alter table public.academy_interest_registrations enable row level security;
revoke all on public.academy_interest_registrations from public, anon, authenticated;

-- Follow the job-board service pattern. This role can only execute the signup
-- function and cannot query registrations or other Academy or LMS records.
-- Configure the frontend's SUPABASE_ACADEMY_INTEREST_SERVICE_KEY with a
-- project-signed JWT whose role claim is academy_interest_service.
create role academy_interest_service nologin noinherit;
grant academy_interest_service to authenticator;
grant usage on schema public to academy_interest_service;

create function public.record_academy_interest(
  p_program text, p_version text, p_cohort text, p_email text,
  p_full_name text, p_audience text, p_primary_interest text,
  p_marketing_consent boolean, p_source_page text, p_utm jsonb,
  p_submitted_at timestamptz, p_promo_eligible boolean
) returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  eligible_at timestamptz := case when p_promo_eligible then p_submitted_at end;
begin
  insert into public.academy_interest_registrations (
    program, version, cohort, email, full_name, audience, primary_interest,
    marketing_consent, source_page, utm, first_submitted_at, last_submitted_at,
    promo_eligible_at, promo_audience
  ) values (
    p_program, p_version, p_cohort, p_email, p_full_name, p_audience, p_primary_interest,
    p_marketing_consent, p_source_page, p_utm, p_submitted_at, p_submitted_at,
    eligible_at, case when p_promo_eligible then p_audience end
  ) on conflict (program, version, cohort, email) do nothing;

  if found then return true; end if;

  update public.academy_interest_registrations as r set
    first_submitted_at = least(r.first_submitted_at, p_submitted_at),
    last_submitted_at = greatest(r.last_submitted_at, p_submitted_at),
    full_name = case when p_submitted_at >= r.last_submitted_at then p_full_name else r.full_name end,
    audience = case when p_submitted_at >= r.last_submitted_at then p_audience else r.audience end,
    primary_interest = case when p_submitted_at >= r.last_submitted_at then p_primary_interest else r.primary_interest end,
    marketing_consent = case when p_submitted_at >= r.last_submitted_at then p_marketing_consent else r.marketing_consent end,
    source_page = case when p_submitted_at < r.first_submitted_at then p_source_page else r.source_page end,
    utm = case when p_submitted_at < r.first_submitted_at then p_utm else r.utm end,
    promo_eligible_at = least(r.promo_eligible_at, eligible_at),
    promo_audience = case
      when eligible_at is not null and (r.promo_eligible_at is null or eligible_at < r.promo_eligible_at)
      then p_audience else r.promo_audience end
  where r.program = p_program and r.version = p_version and r.cohort = p_cohort and r.email = p_email;

  if not found then raise exception 'Academy interest row could not be updated'; end if;
  return false;
end;
$$;

revoke all on function public.record_academy_interest(text, text, text, text, text, text, text, boolean, text, jsonb, timestamptz, boolean)
  from public, anon, authenticated;
grant execute on function public.record_academy_interest(text, text, text, text, text, text, text, boolean, text, jsonb, timestamptz, boolean)
  to academy_interest_service;

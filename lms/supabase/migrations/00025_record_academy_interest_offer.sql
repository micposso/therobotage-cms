alter table public.academy_interest_registrations
  add column offer_id text,
  add column quoted_audience text check (quoted_audience in ('student', 'professional')),
  add column quoted_tuition_minor integer check (quoted_tuition_minor > 0),
  add column quoted_currency text check (quoted_currency ~ '^[A-Z]{3}$'),
  add column invitation_window_days integer check (invitation_window_days > 0),
  add constraint academy_interest_quote_complete check (
    (offer_id is null and quoted_audience is null and quoted_tuition_minor is null
      and quoted_currency is null and invitation_window_days is null)
    or (offer_id is not null and quoted_audience is not null and quoted_tuition_minor is not null
      and quoted_currency is not null)
  );

-- The existing table does not record a monetary quote for legacy submissions.
-- Leave their original eligibility, audience, and timestamps intact.
create function public.record_academy_interest_offer(
  p_program text, p_version text, p_cohort text, p_email text,
  p_full_name text, p_audience text, p_primary_interest text,
  p_marketing_consent boolean, p_source_page text, p_utm jsonb,
  p_starts_at timestamptz, p_ends_before timestamptz, p_founding_offer_id text, p_standard_offer_id text,
  p_founding_tuition_minor integer, p_standard_tuition_minor integer, p_currency text, p_invitation_days integer
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  accepted_at timestamptz;
  founding boolean;
  first_registration boolean;
  saved public.academy_interest_registrations%rowtype;
begin
  -- Serialize acceptance for this program/cohort/email so concurrent submissions agree on the first quote.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    pg_catalog.jsonb_build_array(p_program, p_version, p_cohort, p_email)::text, 0));
  accepted_at := pg_catalog.clock_timestamp();
  founding := accepted_at >= p_starts_at and accepted_at < p_ends_before;

  insert into public.academy_interest_registrations (
    program, version, cohort, email, full_name, audience, primary_interest,
    marketing_consent, source_page, utm, first_submitted_at, last_submitted_at,
    promo_eligible_at, promo_audience, offer_id, quoted_audience,
    quoted_tuition_minor, quoted_currency, invitation_window_days
  ) values (
    p_program, p_version, p_cohort, p_email, p_full_name, p_audience, p_primary_interest,
    p_marketing_consent, p_source_page, p_utm, accepted_at, accepted_at,
    case when founding then accepted_at end, case when founding then p_audience end,
    case when founding then p_founding_offer_id else p_standard_offer_id end, p_audience,
    case when founding then p_founding_tuition_minor else p_standard_tuition_minor end,
    p_currency, case when founding then p_invitation_days end
  ) on conflict (program, version, cohort, email) do nothing
  returning * into saved;

  first_registration := found;
  if not first_registration then
    update public.academy_interest_registrations as r set
      last_submitted_at = greatest(r.last_submitted_at, accepted_at),
      full_name = case when accepted_at >= r.last_submitted_at then p_full_name else r.full_name end,
      audience = case when accepted_at >= r.last_submitted_at then p_audience else r.audience end,
      primary_interest = case when accepted_at >= r.last_submitted_at then p_primary_interest else r.primary_interest end,
      marketing_consent = case when accepted_at >= r.last_submitted_at then p_marketing_consent else r.marketing_consent end
    where r.program = p_program and r.version = p_version and r.cohort = p_cohort and r.email = p_email
    returning * into strict saved;
  end if;

  return pg_catalog.jsonb_build_object(
    'firstRegistration', first_registration,
    'founding', case when saved.offer_id is null then saved.promo_eligible_at is not null
      else saved.invitation_window_days is not null end,
    'tuitionMinor', saved.quoted_tuition_minor,
    'currency', saved.quoted_currency,
    'invitationDays', saved.invitation_window_days
  );
end;
$$;

revoke all on function public.record_academy_interest_offer(
  text, text, text, text, text, text, text, boolean, text, jsonb,
  timestamptz, timestamptz, text, text, integer, integer, text, integer
) from public, anon, authenticated;
grant execute on function public.record_academy_interest_offer(
  text, text, text, text, text, text, text, boolean, text, jsonb,
  timestamptz, timestamptz, text, text, integer, integer, text, integer
) to academy_interest_service;

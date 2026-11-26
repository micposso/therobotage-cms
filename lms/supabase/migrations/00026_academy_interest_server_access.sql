-- Older frontend deployments use the existing server-only service key.
grant execute on function public.record_academy_interest_offer(
  text, text, text, text, text, text, text, boolean, text, jsonb,
  timestamptz, timestamptz, text, text, integer, integer, text, integer
) to service_role;

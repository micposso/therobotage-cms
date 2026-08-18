# TODO

## Job alerts: finish the Supabase key migration, then re-enable signup

The job board's `JobAlertSignup` component is currently **hidden** on `/jobs` and
`/jobs/[slug]` (removed from both pages on 2026-08-18) while the Supabase credential
migration below is finished. Re-enabling it before the migration is done would let real
signups start flowing through the still-broken cron pipeline and the still-shared
service_role key.

Background: the frontend's job-alert code (signup, unsubscribe, weekly digest cron) was
using the LMS project's Supabase `service_role` key, which bypasses RLS on every table in
the shared database — including LMS enrollments, submissions and credentials. It also
turned out the `.github/workflows/job-alerts.yml` cron had never run because the GitHub
repo has no `SITE_URL` / `CRON_SECRET` secrets configured at all.

- [ ] Run migration `lms/supabase/migrations/00022_create_jobs_service_role.sql` against
      the shared Supabase project (SQL editor or `supabase db push`). Creates the scoped
      `jobs_alert_service` Postgres role (no bypassrls, access limited to
      jobs/companies/taxonomy tables + `job_alert_subscribers` + `job_alert_sends`).
- [ ] Mint a JWT with payload `{"role": "jobs_alert_service"}`, signed with that Supabase
      project's JWT secret (Project Settings → API → JWT Settings).
- [ ] On the **frontend** Railway service: add `SUPABASE_JOBS_SERVICE_KEY` with that JWT.
      Remove `SUPABASE_SERVICE_ROLE_KEY` from that service entirely — it should only
      exist on the LMS Railway service from now on.
- [ ] Add GitHub repo secrets `SITE_URL` (`https://therobotage.com`) and `CRON_SECRET`
      (must match the value on the Railway frontend service) under Settings → Secrets and
      variables → Actions.
- [ ] Manually trigger `.github/workflows/job-alerts.yml` with dry-run checked and confirm
      the response reports `"failures":[]`.
- [ ] Re-add `<JobAlertSignup />` to `frontend/src/app/jobs/page.tsx` (was
      `source="jobs-index"`, sat right after the `<Suspense>` explorer block, inside
      `<section className={styles.section}>`) and to
      `frontend/src/app/jobs/[slug]/page.tsx` (was inside its own
      `<section className={styles.alertSection}>` after `<RelatedJobs />`, with
      `source={`job-detail:${job.slug}`}`, `defaultRoleFamily`, `defaultState` props —
      see git history around 2026-08-18 for the exact removed JSX).

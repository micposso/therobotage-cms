create table public.peer_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_enrollment_id uuid not null references public.enrollments(id),
  reviewee_enrollment_id uuid not null references public.enrollments(id),
  rra_submission_id uuid not null references public.rra_submissions(id),
  strengths text,
  improvements text,
  holistic_rating text,
  submitted_at timestamptz,
  status text not null default 'assigned'
    check (status in ('assigned', 'submitted')),
  created_at timestamptz not null default now(),
  unique(reviewer_enrollment_id, reviewee_enrollment_id)
);

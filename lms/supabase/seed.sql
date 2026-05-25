-- ─── Seed: REP course ──────────────────────────────────────
insert into public.courses (id, slug, title, short_title, description, total_weeks)
values (
  'a1000000-0000-0000-0000-000000000001',
  'rep',
  'Robotics Experience Practitioner',
  'REP',
  'The foundational credential built on the Robot Experience Design (RXD) framework.',
  6
) on conflict (slug) do nothing;


-- ─── Seed: Founding Cohort ─────────────────────────────────
-- Adjust start dates as needed for local testing.
insert into public.cohorts (id, course_id, name, start_date, week_start_dates, status, max_seats)
values (
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Founding Cohort',
  '2025-01-06',
  array[
    '2025-01-06'::date,
    '2025-01-13'::date,
    '2025-01-20'::date,
    '2025-01-27'::date,
    '2025-02-03'::date,
    '2025-02-10'::date
  ],
  'active',
  10
) on conflict do nothing;


-- ─── Seed: Week content stubs ──────────────────────────────
insert into public.week_content (course_id, week_number, title, subtitle, format, rxd_dimensions, estimated_hours, deliverable_prompt, deliverable_word_min, deliverable_word_max)
values
  ('a1000000-0000-0000-0000-000000000001', 1, 'What Is Human Robotics Experience?', 'Live Zoom · Wednesday 7pm ET', 'live_zoom', '{}', 2.5, null, null, null),
  ('a1000000-0000-0000-0000-000000000001', 2, 'Signal Clarity & Spatial Legibility', null, 'self_paced', array['Signal Clarity','Spatial Legibility'], 2.5,
    'Write a 500–800 word signal audit of a robot you have observed or interacted with. Identify at least three moments where signal clarity succeeded or failed. Use the RXD framework to name what was happening.', 500, 800),
  ('a1000000-0000-0000-0000-000000000001', 3, 'Perceived Presence', null, 'self_paced', array['Perceived Presence'], 2.5,
    'Select a deployed robot and analyse its perceived presence across voice, form, and aesthetic. 500–800 words. Reference at least two of the three presence factors.', 500, 800),
  ('a1000000-0000-0000-0000-000000000001', 4, 'Interaction Fit & Failure Transparency', null, 'self_paced', array['Interaction Fit','Failure Transparency'], 2.5,
    'Document a failure scenario for a robot in your chosen deployment context. Describe what failed, what the robot communicated (or failed to communicate), and how you would redesign the failure moment. 500–800 words.', 500, 800),
  ('a1000000-0000-0000-0000-000000000001', 5, 'Recovery Design & Applied Use Cases', null, 'self_paced', array['Recovery Design'], 2.5,
    'Write an interaction specification for a 10-minute Reachy Mini session. Describe the scenario, the robot''s objectives, the expected human responses, and the recovery behaviours you want to observe. 500–800 words.', 500, 800),
  ('a1000000-0000-0000-0000-000000000001', 6, 'Capstone: Robot Readiness Audit', null, 'capstone', array['Signal Clarity','Spatial Legibility','Perceived Presence','Failure Transparency','Interaction Fit','Recovery Design'], 4.0, null, null, null)
on conflict (course_id, week_number) do nothing;

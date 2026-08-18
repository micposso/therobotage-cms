-- The job board is scoped to the human/product side of robotics only -- product, UX
-- design, user research, and marketing. It deliberately does not carry engineering,
-- hardware, or technical-research roles; that distinction is the board's whole reason
-- to exist over a generic robotics-jobs aggregator.
--
-- taxonomy.json (frontend/jobs/taxonomy.json) is already cut over to these four
-- families; scripts/publish-jobs.mjs validates every job markdown file against it, so no
-- job can be published under an old family from here on.
--
-- The eleven technical/sales/ops families seeded in migration 00018 are intentionally
-- left in place rather than dropped: jobs.role_family is a foreign key to this table,
-- and dropping a row an existing (possibly archived) job still references would fail.
-- They simply stop being valid choices going forward -- nothing in the app surfaces a
-- role family with zero live jobs (see getJobFacets in src/lib/jobs.ts), so they are
-- inert immediately, without a data migration.

insert into public.job_role_families (slug, label, blurb, sort_order) values
  ('product', 'Product',
   'Product management for machines people have to work alongside -- roadmap, strategy, and the tradeoffs between what a robot can do and what it should do.', 10),
  ('design-ux', 'Design and UX',
   'Product design, UX design, interaction design, and creative -- the visual, spatial, and behavioral choices that decide whether a robot is legible to the people near it.', 20),
  ('user-research', 'User Research',
   'UX research and user research -- studying how people actually perceive, trust, and work alongside robots, in the field and in the lab.', 30),
  ('marketing', 'Marketing',
   'Product marketing, brand, and creative marketing -- positioning and storytelling for machines that have to earn trust in person, not just on a spec sheet.', 40)
on conflict (slug) do nothing;

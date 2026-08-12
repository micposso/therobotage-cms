-- Job board taxonomy.
--
-- These tables serve the marketing site (therobotage.com/jobs), not the LMS. They live
-- in this migration chain because both apps share one Supabase project.
--
-- Lookup tables rather than Postgres enums: role families will grow over time, and
-- `alter type ... add value` cannot run inside a transaction. The rows also carry the
-- display label, blurb and sort order that the filter UI and the SEO landing pages
-- need, so the taxonomy has exactly one home.

create extension if not exists citext;
create extension if not exists pgcrypto;

create table public.job_role_families (
  slug text primary key,
  label text not null,
  blurb text not null,
  sort_order integer not null default 100
);

insert into public.job_role_families (slug, label, blurb, sort_order) values
  ('perception-ml', 'Perception and Machine Learning',
   'Sensing, state estimation, and the learned models that turn raw sensor data into decisions.', 10),
  ('controls-motion', 'Controls and Motion Planning',
   'Whole-body control, trajectory planning, navigation, and the math that makes machines move safely.', 20),
  ('software-platform', 'Software and Platform',
   'Fleet management, cloud infrastructure, simulation, and the tooling the rest of the stack runs on.', 30),
  ('mechanical-hardware', 'Mechanical and Hardware',
   'Actuators, structures, thermal, and the physical design of the machine itself.', 40),
  ('embedded-electrical', 'Embedded and Electrical',
   'Firmware, motor drivers, power systems, and board-level design.', 50),
  ('manufacturing-test', 'Manufacturing, Quality and Test',
   'Bringing a robot from one working unit to a repeatable production line.', 60),
  ('field-deployment', 'Field Deployment and Service',
   'Installing, commissioning, and keeping robots running at customer sites.', 70),
  ('teleoperation-data', 'Teleoperation and Data Operations',
   'Remote operation, data collection, annotation, and the human labor behind autonomy.', 80),
  ('product-design-hri', 'Product, Design and HRI',
   'Product management, interaction design, and the human side of robot experience.', 90),
  ('research-scientist', 'Research Scientist',
   'Publishing research roles at the frontier of robot learning and manipulation.', 100),
  ('sales-bd', 'Sales and Business Development',
   'Selling robots and robot-shaped services into industrial and commercial buyers.', 110),
  ('operations-ga', 'Operations and Administration',
   'Supply chain, finance, people, legal, and the functions that keep a robotics company running.', 120);

-- The job board is US-only. This table is the enforcement point: jobs.state_code is a
-- foreign key into it, so a listing outside the 50 states plus DC cannot be inserted.
create table public.us_states (
  code char(2) primary key,
  name text not null,
  slug text not null unique
);

insert into public.us_states (code, name, slug) values
  ('AL', 'Alabama', 'alabama'),
  ('AK', 'Alaska', 'alaska'),
  ('AZ', 'Arizona', 'arizona'),
  ('AR', 'Arkansas', 'arkansas'),
  ('CA', 'California', 'california'),
  ('CO', 'Colorado', 'colorado'),
  ('CT', 'Connecticut', 'connecticut'),
  ('DE', 'Delaware', 'delaware'),
  ('DC', 'District of Columbia', 'district-of-columbia'),
  ('FL', 'Florida', 'florida'),
  ('GA', 'Georgia', 'georgia'),
  ('HI', 'Hawaii', 'hawaii'),
  ('ID', 'Idaho', 'idaho'),
  ('IL', 'Illinois', 'illinois'),
  ('IN', 'Indiana', 'indiana'),
  ('IA', 'Iowa', 'iowa'),
  ('KS', 'Kansas', 'kansas'),
  ('KY', 'Kentucky', 'kentucky'),
  ('LA', 'Louisiana', 'louisiana'),
  ('ME', 'Maine', 'maine'),
  ('MD', 'Maryland', 'maryland'),
  ('MA', 'Massachusetts', 'massachusetts'),
  ('MI', 'Michigan', 'michigan'),
  ('MN', 'Minnesota', 'minnesota'),
  ('MS', 'Mississippi', 'mississippi'),
  ('MO', 'Missouri', 'missouri'),
  ('MT', 'Montana', 'montana'),
  ('NE', 'Nebraska', 'nebraska'),
  ('NV', 'Nevada', 'nevada'),
  ('NH', 'New Hampshire', 'new-hampshire'),
  ('NJ', 'New Jersey', 'new-jersey'),
  ('NM', 'New Mexico', 'new-mexico'),
  ('NY', 'New York', 'new-york'),
  ('NC', 'North Carolina', 'north-carolina'),
  ('ND', 'North Dakota', 'north-dakota'),
  ('OH', 'Ohio', 'ohio'),
  ('OK', 'Oklahoma', 'oklahoma'),
  ('OR', 'Oregon', 'oregon'),
  ('PA', 'Pennsylvania', 'pennsylvania'),
  ('RI', 'Rhode Island', 'rhode-island'),
  ('SC', 'South Carolina', 'south-carolina'),
  ('SD', 'South Dakota', 'south-dakota'),
  ('TN', 'Tennessee', 'tennessee'),
  ('TX', 'Texas', 'texas'),
  ('UT', 'Utah', 'utah'),
  ('VT', 'Vermont', 'vermont'),
  ('VA', 'Virginia', 'virginia'),
  ('WA', 'Washington', 'washington'),
  ('WV', 'West Virginia', 'west-virginia'),
  ('WI', 'Wisconsin', 'wisconsin'),
  ('WY', 'Wyoming', 'wyoming');

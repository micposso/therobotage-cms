-- ─── Profiles ──────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Admins read all profiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Courses ───────────────────────────────────────────────
alter table public.courses enable row level security;

create policy "Authenticated users read courses"
  on public.courses for select using (auth.uid() is not null);


-- ─── Cohorts ───────────────────────────────────────────────
alter table public.cohorts enable row level security;

create policy "Authenticated users read cohorts"
  on public.cohorts for select using (auth.uid() is not null);

create policy "Admins manage cohorts"
  on public.cohorts for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Enrollments ───────────────────────────────────────────
alter table public.enrollments enable row level security;

create policy "Students read own enrollments"
  on public.enrollments for select using (user_id = auth.uid());

create policy "Admins read all enrollments"
  on public.enrollments for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Week Content ──────────────────────────────────────────
alter table public.week_content enable row level security;

create policy "Authenticated users read week content"
  on public.week_content for select using (auth.uid() is not null);

create policy "Admins manage week content"
  on public.week_content for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Week Progress ─────────────────────────────────────────
alter table public.week_progress enable row level security;

create policy "Students manage own week progress"
  on public.week_progress for all
  using (exists (
    select 1 from public.enrollments e
    where e.id = week_progress.enrollment_id and e.user_id = auth.uid()
  ));

create policy "Admins read all week progress"
  on public.week_progress for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Submissions ───────────────────────────────────────────
alter table public.submissions enable row level security;

create policy "Students manage own submissions"
  on public.submissions for all
  using (exists (
    select 1 from public.enrollments e
    where e.id = submissions.enrollment_id and e.user_id = auth.uid()
  ));

create policy "Instructors read all submissions"
  on public.submissions for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));

create policy "Instructors update submissions"
  on public.submissions for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Submission Files ──────────────────────────────────────
alter table public.submission_files enable row level security;

create policy "Students manage own files"
  on public.submission_files for all
  using (exists (
    select 1 from public.submissions s
    join public.enrollments e on s.enrollment_id = e.id
    where s.id = submission_files.submission_id and e.user_id = auth.uid()
  ));

create policy "Instructors read all files"
  on public.submission_files for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── RRA Submissions ───────────────────────────────────────
alter table public.rra_submissions enable row level security;

create policy "Students manage own RRA"
  on public.rra_submissions for all
  using (exists (
    select 1 from public.enrollments e
    where e.id = rra_submissions.enrollment_id and e.user_id = auth.uid()
  ));

create policy "Instructors manage all RRA"
  on public.rra_submissions for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Robot Footage ─────────────────────────────────────────
alter table public.robot_footage enable row level security;

create policy "Students read own footage"
  on public.robot_footage for select
  using (exists (
    select 1 from public.enrollments e
    where e.id = robot_footage.enrollment_id and e.user_id = auth.uid()
  ));

create policy "Admins manage footage"
  on public.robot_footage for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Peer Reviews ──────────────────────────────────────────
alter table public.peer_reviews enable row level security;

create policy "Students manage own reviews"
  on public.peer_reviews for all
  using (exists (
    select 1 from public.enrollments e
    where e.id = peer_reviews.reviewer_enrollment_id and e.user_id = auth.uid()
  ));

create policy "Admins manage all reviews"
  on public.peer_reviews for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Credentials ───────────────────────────────────────────
alter table public.credentials enable row level security;

create policy "Students read own credentials"
  on public.credentials for select using (user_id = auth.uid());

create policy "Admins manage credentials"
  on public.credentials for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Coach Conversations ───────────────────────────────────
alter table public.coach_conversations enable row level security;

create policy "Students manage own conversations"
  on public.coach_conversations for all
  using (exists (
    select 1 from public.enrollments e
    where e.id = coach_conversations.enrollment_id and e.user_id = auth.uid()
  ));


-- ─── Coach Messages ────────────────────────────────────────
alter table public.coach_messages enable row level security;

create policy "Students manage own messages"
  on public.coach_messages for all
  using (exists (
    select 1 from public.coach_conversations cc
    join public.enrollments e on cc.enrollment_id = e.id
    where cc.id = coach_messages.conversation_id and e.user_id = auth.uid()
  ));


-- ─── RAG Chunks ────────────────────────────────────────────
alter table public.rag_chunks enable row level security;

create policy "Authenticated users read rag chunks"
  on public.rag_chunks for select using (auth.uid() is not null);

create policy "Admins manage rag chunks"
  on public.rag_chunks for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  ));


-- ─── Storage RLS ───────────────────────────────────────────
create policy "Students upload own deliverables"
  on storage.objects for insert
  with check (
    bucket_id = 'deliverables'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Students read own deliverables"
  on storage.objects for select
  using (
    bucket_id = 'deliverables'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Instructors read all deliverables"
  on storage.objects for select
  using (
    bucket_id = 'deliverables'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('instructor', 'admin')
    )
  );

create policy "Admins upload footage"
  on storage.objects for insert
  with check (
    bucket_id = 'footage'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('instructor', 'admin')
    )
  );

create policy "Students view own footage"
  on storage.objects for select
  using (
    bucket_id = 'footage'
    and exists (
      select 1 from public.robot_footage rf
      join public.enrollments e on rf.enrollment_id = e.id
      where e.user_id = auth.uid()
        and rf.video_storage_path = name
    )
  );

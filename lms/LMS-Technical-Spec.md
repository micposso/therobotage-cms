# The Robot Age — LMS Technical Specification
## learn.therobotage.com

> This document extends the LMS design specification with implementation-level technical decisions. It covers the full stack: Supabase as the data and auth layer, Google OAuth, Resend transactional email, file-based deliverable uploads, instructor review workflows, deadline enforcement, and an AI learning coach powered by the Anthropic API with a retrieval-augmented generation (RAG) pipeline. Everything here inherits the design tokens, component patterns, voice rules, and forbidden patterns defined in `LMS.md`.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Supabase Schema](#3-supabase-schema)
4. [Authentication](#4-authentication)
5. [File Upload System](#5-file-upload-system)
6. [Deliverable Submission & Review Workflow](#6-deliverable-submission--review-workflow)
7. [Due Dates & Deadline Engine](#7-due-dates--deadline-engine)
8. [Email System (Resend)](#8-email-system-resend)
9. [AI Learning Coach](#9-ai-learning-coach)
10. [RAG Pipeline](#10-rag-pipeline)
11. [API Route Structure](#11-api-route-structure)
12. [Row-Level Security Policies](#12-row-level-security-policies)
13. [Real-Time Subscriptions](#13-real-time-subscriptions)
14. [Admin Panel](#14-admin-panel)
15. [Deployment & Infrastructure](#15-deployment--infrastructure)
16. [Environment Variables](#16-environment-variables)
17. [Migration & Seed Strategy](#17-migration--seed-strategy)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Client (Next.js 14 App Router)                                 │
│  learn.therobotage.com                                          │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Auth Pages  │  │ Course Pages │  │ AI Coach Chat Panel      │ │
│  │ (Google     │  │ (Sidebar +   │  │ (Streaming responses,    │ │
│  │  OAuth)     │  │  Content +   │  │  RAG-grounded, per-week  │ │
│  │             │  │  Deliverable)│  │  context)                │ │
│  └────────────┘  └──────────────┘  └──────────────────────────┘ │
└──────────┬──────────────┬───────────────────┬───────────────────┘
           │              │                   │
           ▼              ▼                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  Next.js API Routes (Route Handlers)                             │
│  /api/auth/*     /api/submissions/*    /api/coach/*              │
│  /api/uploads/*  /api/admin/*          /api/webhooks/*           │
└──────┬──────────────┬──────────────────────┬────────────────────┘
       │              │                      │
       ▼              ▼                      ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────────────────────┐
│  Supabase    │  │  Supabase    │  │  Anthropic API               │
│  Auth        │  │  Storage     │  │  claude-sonnet-4-20250514    │
│  (Google     │  │  (Deliverable│  │  + RAG context injection     │
│   OAuth)     │  │   files,     │  │                              │
│              │  │   footage)   │  │  Supabase pgvector           │
│  Supabase    │  │              │  │  (Embeddings store)          │
│  Postgres    │  │              │  │                              │
│  (All data)  │  │              │  │                              │
└─────────────┘  └──────────────┘  └──────────────────────────────┘
       │
       ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────────────────────┐
│  Resend      │  │ Lemon        │  │  Credential.net              │
│  (Email)     │  │ Squeezy      │  │  (Badge issuance)            │
│              │  │ (Webhooks)   │  │                              │
└─────────────┘  └──────────────┘  └──────────────────────────────┘
```

The system is a single Next.js 14 application deployed on Vercel. Supabase provides authentication, the Postgres database, object storage for file uploads, real-time subscriptions for live feedback notifications, and pgvector for the RAG embedding store. The Anthropic API powers the AI learning coach. Resend handles all transactional email. Lemon Squeezy and Credential.net integrate via webhooks.

---

## 2. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server components, route handlers, streaming support for AI chat |
| Database | Supabase Postgres | Managed Postgres with RLS, real-time, built-in auth, pgvector extension |
| ORM | Supabase JS Client + raw SQL for complex queries | Direct integration, no additional ORM layer needed with Supabase |
| Auth | Supabase Auth (Google OAuth provider) | Native integration with RLS, handles token refresh and session management |
| File Storage | Supabase Storage | Signed URLs, RLS on buckets, integrated with same project |
| Vector Store | Supabase pgvector | Embedding storage for RAG — no separate vector DB needed |
| AI | Anthropic API (claude-sonnet-4-20250514) | Learning coach chat, streaming responses |
| Embeddings | Anthropic Voyager or OpenAI text-embedding-3-small | Embedding generation for RAG chunks |
| Email | Resend | Transactional email: summaries, reminders, feedback notifications |
| Payments | Lemon Squeezy (webhook only) | LMS receives enrollment webhooks — no payment processing |
| Credentials | Credential.net API | Badge issuance on capstone pass |
| Hosting | Vercel | Edge-optimized, native Next.js support |
| Video | Supabase Storage (large file bucket) | Robot footage stored as signed-URL objects |

---

## 3. Supabase Schema

All tables use UUIDs as primary keys via `gen_random_uuid()`. Timestamps default to `now()`. The schema extends the data models from `LMS.md` with file upload support, due dates, and AI coach tables.

### 3.1 Core Tables

```sql
-- Enable pgvector for RAG
create extension if not exists vector;

-- ─── Users ─────────────────────────────────────────────────
-- Supabase Auth manages the auth.users table.
-- This is a public profile table that mirrors auth and adds role.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'student'
    check (role in ('student', 'instructor', 'admin')),
  credential_net_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─── Courses ───────────────────────────────────────────────
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,             -- 'rep', 'rpdp', 'rsp', 'rxr'
  title text not null,                   -- 'Robotics Experience Practitioner'
  short_title text not null,             -- 'REP'
  description text,
  total_weeks integer not null default 6,
  created_at timestamptz not null default now()
);


-- ─── Cohorts ───────────────────────────────────────────────
create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  name text not null,                    -- 'Founding Cohort'
  start_date date not null,
  week_start_dates date[] not null,      -- array of dates, length = course.total_weeks
  zoom_url text,                         -- Week 1 live session
  zoom_recording_url text,               -- Added post-session
  zoom_ics_url text,                     -- Calendar file URL
  status text not null default 'upcoming'
    check (status in ('upcoming', 'active', 'complete')),
  max_seats integer default 10,
  created_at timestamptz not null default now()
);


-- ─── Enrollments ───────────────────────────────────────────
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  cohort_id uuid not null references public.cohorts(id),
  course_slug text not null,
  status text not null default 'active'
    check (status in ('active', 'paused', 'complete')),
  lemon_squeezy_order_id text,
  is_founding boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, cohort_id)
);


-- ─── Week Content ──────────────────────────────────────────
-- Static content per course week (authored by admin, not per-cohort).
create table public.week_content (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  week_number integer not null,
  title text not null,                   -- 'What Is Human Robotics Experience?'
  subtitle text,                         -- 'Live Zoom · Wednesday 7pm ET'
  format text not null default 'self_paced'
    check (format in ('live_zoom', 'self_paced', 'capstone')),
  rxd_dimensions text[] not null default '{}',  -- ['Signal Clarity', 'Spatial Legibility']
  estimated_hours numeric(3,1),
  body_markdown text not null default '',        -- Full week content in MDX
  topics text[] not null default '{}',
  learning_outcomes text[] not null default '{}',
  resources jsonb not null default '[]',         -- [{title, url, type}]
  deliverable_prompt text,               -- The exact deliverable description
  deliverable_word_min integer,          -- e.g. 500
  deliverable_word_max integer,          -- e.g. 800
  deliverable_accepts_files boolean not null default false,
  deliverable_file_types text[] default '{}',    -- ['pdf', 'docx', 'png', 'jpg']
  deliverable_max_file_size_mb integer default 25,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, week_number)
);


-- ─── Week Progress ─────────────────────────────────────────
create table public.week_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  week_number integer not null,
  state text not null default 'locked'
    check (state in (
      'locked', 'available', 'in_progress',
      'submitted', 'revision_requested', 'complete'
    )),
  content_viewed_at timestamptz,
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(enrollment_id, week_number)
);


-- ─── Submissions ───────────────────────────────────────────
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  week_number integer not null,
  draft text not null default '',
  content text,                          -- Final submitted text
  submitted_at timestamptz,
  due_date timestamptz,                  -- Computed from cohort schedule
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'revision_requested', 'approved')),
  is_late boolean not null default false,
  instructor_comment text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  draft_saved_at timestamptz,            -- Last auto-save timestamp
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(enrollment_id, week_number)
);


-- ─── Submission Files ──────────────────────────────────────
-- Supports multiple file attachments per submission.
create table public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  file_name text not null,
  file_type text not null,               -- MIME type
  file_size integer not null,            -- bytes
  storage_path text not null,            -- Supabase Storage path
  uploaded_at timestamptz not null default now()
);


-- ─── RRA Submissions (Capstone) ────────────────────────────
create table public.rra_submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  signal_clarity_score integer check (signal_clarity_score between 1 and 5),
  signal_clarity_rationale text,
  spatial_legibility_score integer check (spatial_legibility_score between 1 and 5),
  spatial_legibility_rationale text,
  perceived_presence_score integer check (perceived_presence_score between 1 and 5),
  perceived_presence_rationale text,
  failure_transparency_score integer check (failure_transparency_score between 1 and 5),
  failure_transparency_rationale text,
  interaction_fit_score integer check (interaction_fit_score between 1 and 5),
  interaction_fit_rationale text,
  recovery_design_score integer check (recovery_design_score between 1 and 5),
  recovery_design_rationale text,
  overall_summary text,
  total_res numeric(2,1),                -- Computed average
  submitted_at timestamptz,
  due_date timestamptz,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'passed', 'revision_requested')),
  instructor_comment text,
  passed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(enrollment_id)
);


-- ─── RRA Files (Capstone attachments) ──────────────────────
create table public.rra_files (
  id uuid primary key default gen_random_uuid(),
  rra_submission_id uuid not null references public.rra_submissions(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  storage_path text not null,
  uploaded_at timestamptz not null default now()
);


-- ─── Robot Footage ─────────────────────────────────────────
create table public.robot_footage (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  week_number integer not null default 5,
  video_storage_path text not null,      -- Supabase Storage path
  interaction_log_path text,             -- Optional log file
  uploaded_at timestamptz not null default now(),
  viewed_at timestamptz,                 -- Student first view
  uploaded_by uuid references public.profiles(id),
  unique(enrollment_id, week_number)
);


-- ─── Peer Reviews ──────────────────────────────────────────
create table public.peer_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_enrollment_id uuid not null references public.enrollments(id),
  reviewee_enrollment_id uuid not null references public.enrollments(id),
  rra_submission_id uuid not null references public.rra_submissions(id),
  strengths text,
  improvements text,
  holistic_rating text,                  -- qualitative, not numeric
  submitted_at timestamptz,
  status text not null default 'assigned'
    check (status in ('assigned', 'submitted')),
  created_at timestamptz not null default now(),
  unique(reviewer_enrollment_id, reviewee_enrollment_id)
);


-- ─── Credentials ───────────────────────────────────────────
create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  course_slug text not null,
  credential_net_badge_url text,
  credential_net_public_url text,
  issued_at timestamptz not null default now(),
  is_founding boolean not null default false
);
```

### 3.2 AI Coach Tables

```sql
-- ─── RAG Document Chunks ───────────────────────────────────
-- Stores chunked course content for retrieval-augmented generation.
create table public.rag_chunks (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  week_number integer,                   -- null = general course content
  source_type text not null
    check (source_type in (
      'week_content', 'rxd_framework', 'white_paper',
      'deliverable_rubric', 'faq', 'resource'
    )),
  source_title text not null,
  chunk_text text not null,
  chunk_index integer not null default 0,
  embedding vector(1536) not null,       -- dimension matches embedding model
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- HNSW index for fast similarity search
create index on public.rag_chunks
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);


-- ─── Coach Conversations ───────────────────────────────────
-- Stores chat history between student and AI coach.
create table public.coach_conversations (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  week_number integer,                   -- Scoped to a specific week, or null for general
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.coach_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  rag_chunks_used uuid[] default '{}',   -- References to chunks used for this response
  created_at timestamptz not null default now()
);
```

### 3.3 Indexes

```sql
-- Performance indexes
create index idx_enrollments_user on public.enrollments(user_id);
create index idx_enrollments_cohort on public.enrollments(cohort_id);
create index idx_week_progress_enrollment on public.week_progress(enrollment_id);
create index idx_submissions_enrollment on public.submissions(enrollment_id);
create index idx_submissions_status on public.submissions(status);
create index idx_submission_files_submission on public.submission_files(submission_id);
create index idx_coach_messages_conversation on public.coach_messages(conversation_id);
create index idx_rag_chunks_course_week on public.rag_chunks(course_slug, week_number);
create index idx_credentials_user on public.credentials(user_id);
```

---

## 4. Authentication

### 4.1 Supabase Auth with Google OAuth

Authentication uses Supabase Auth configured with Google as the OAuth provider. No email/password in V1 — Google sign-in only, which simplifies onboarding for professionals who already have Google accounts.

**Configuration:**

1. Create a Google OAuth 2.0 Client ID in Google Cloud Console.
2. Set the authorized redirect URI to `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`.
3. Enable Google provider in the Supabase Dashboard under Authentication > Providers.
4. Store `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Supabase project settings.

**Client-side sign-in flow:**

```typescript
// lib/supabase/auth.ts
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  return { data, error }
}
```

**Server-side session validation:**

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServer() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

**Auth callback route (`app/auth/callback/route.ts`):**

```typescript
import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createSupabaseServer()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

### 4.2 Role Assignment

Roles are stored on the `profiles` table. New users default to `student`. Instructors and admins are promoted manually via the Supabase Dashboard or an admin API endpoint.

**Middleware (`middleware.ts`):**

```typescript
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */)
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect unauthenticated users
  if (!user && !request.nextUrl.pathname.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Gate admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'instructor'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|signin|auth).*)'],
}
```

---

## 5. File Upload System

### 5.1 Supabase Storage Buckets

Two buckets, both with RLS enabled:

| Bucket | Purpose | Max file size | Allowed types |
|---|---|---|---|
| `deliverables` | Student submission attachments | 25 MB | pdf, docx, png, jpg, jpeg, md, txt |
| `footage` | Robot footage (admin-uploaded) | 500 MB | mp4, mov, webm |

**Bucket creation (via Supabase Dashboard or migration):**

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('deliverables', 'deliverables', false, 26214400,
    array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/png', 'image/jpeg', 'text/plain', 'text/markdown']),
  ('footage', 'footage', false, 524288000,
    array['video/mp4', 'video/quicktime', 'video/webm']);
```

### 5.2 Storage RLS Policies

```sql
-- Students can upload to their own submission folder
create policy "Students upload own deliverables"
  on storage.objects for insert
  with check (
    bucket_id = 'deliverables'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Students can read their own files
create policy "Students read own deliverables"
  on storage.objects for select
  using (
    bucket_id = 'deliverables'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Instructors/admins can read all deliverables
create policy "Instructors read all deliverables"
  on storage.objects for select
  using (
    bucket_id = 'deliverables'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('instructor', 'admin')
    )
  );

-- Only admins can upload footage
create policy "Admins upload footage"
  on storage.objects for insert
  with check (
    bucket_id = 'footage'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('instructor', 'admin')
    )
  );

-- Students can view their own footage
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
```

### 5.3 Upload Flow (Client)

```typescript
// components/FileUpload/FileUpload.tsx
async function uploadFile(file: File, submissionId: string) {
  const user = (await supabase.auth.getUser()).data.user
  const path = `${user.id}/${submissionId}/${file.name}`

  const { data, error } = await supabase.storage
    .from('deliverables')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  // Record file metadata in database
  await supabase.from('submission_files').insert({
    submission_id: submissionId,
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    storage_path: data.path,
  })

  return data.path
}
```

**File retrieval uses signed URLs** (valid for 1 hour):

```typescript
async function getFileUrl(storagePath: string) {
  const { data } = await supabase.storage
    .from('deliverables')
    .createSignedUrl(storagePath, 3600)
  return data?.signedUrl
}
```

---

## 6. Deliverable Submission & Review Workflow

### 6.1 Submission States

```
┌─────────┐   auto-save    ┌─────────┐   student submits   ┌───────────┐
│  draft   │ ──────────────→│  draft   │ ─────────────────→ │ submitted │
│ (empty)  │   every 60s    │ (saved)  │                    │           │
└─────────┘                 └─────────┘                     └─────┬─────┘
                                                                  │
                                          ┌───────────────────────┤
                                          │                       │
                                          ▼                       ▼
                                  ┌───────────────┐       ┌──────────┐
                                  │   revision    │       │ approved │
                                  │   requested   │       │          │
                                  └───────┬───────┘       └──────────┘
                                          │
                                          │ student resubmits
                                          ▼
                                  ┌───────────┐
                                  │ submitted │  (cycle repeats)
                                  └───────────┘
```

### 6.2 Auto-Save

Drafts auto-save every 60 seconds using a debounced `PATCH` call. The `draft_saved_at` field updates on each save. The save indicator in the UI shows one of three states: "Saved", "Saving…", or "Error saving."

```typescript
// hooks/useAutoSave.ts
export function useAutoSave(submissionId: string, content: string) {
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>('saved')

  useEffect(() => {
    const timer = setTimeout(async () => {
      setSaveState('saving')
      const { error } = await supabase
        .from('submissions')
        .update({ draft: content, draft_saved_at: new Date().toISOString() })
        .eq('id', submissionId)

      setSaveState(error ? 'error' : 'saved')
    }, 60_000)

    return () => clearTimeout(timer)
  }, [content, submissionId])

  return saveState
}
```

### 6.3 Submission with Files

When a student submits, the API route handler performs these steps atomically:

1. Validate word count against `week_content.deliverable_word_min` / `deliverable_word_max`.
2. Validate attached files against `deliverable_file_types` and `deliverable_max_file_size_mb`.
3. Check that the current date is before or on the due date (flag `is_late` if past).
4. Update `submissions.status` to `submitted`, copy `draft` to `content`, set `submitted_at`.
5. Update `week_progress.state` to `submitted`.
6. Trigger a Resend email to the instructor notifying them of the new submission.

### 6.4 Instructor Review

Instructors access submissions via `/admin/submissions`. For each submission, they can:

- Read the full text content.
- Download attached files via signed URLs.
- Write a comment in `instructor_comment`.
- Choose **Approve** (sets `status: 'approved'`, `week_progress.state: 'complete'`) or **Request revision** (sets `status: 'revision_requested'`, `week_progress.state: 'revision_requested'`).

On either action, a Resend email is sent to the student with the outcome and comment.

### 6.5 Revision Cycle

When revision is requested, the student's submission is unlocked for editing. The `draft` field retains the previously submitted content so the student can revise in-place. On resubmission, the same flow from 6.3 repeats. There is no limit on revision cycles.

---

## 7. Due Dates & Deadline Engine

### 7.1 Due Date Computation

Due dates are derived from the cohort's `week_start_dates` array. Each week's deliverable is due the day before the next week opens.

```typescript
// lib/deadlines.ts
export function computeDueDate(
  weekStartDates: string[],
  weekNumber: number
): Date | null {
  // Week 1 has no deliverable
  if (weekNumber === 1) return null

  // Weeks 2–5: due the day before the next week opens
  if (weekNumber < weekStartDates.length) {
    const nextWeekStart = new Date(weekStartDates[weekNumber]) // 0-indexed: weekNumber = index of next week
    nextWeekStart.setDate(nextWeekStart.getDate() - 1)
    nextWeekStart.setHours(23, 59, 59, 999)
    return nextWeekStart
  }

  // Week 6 (capstone): due 14 days after Week 6 opens
  const capstoneDue = new Date(weekStartDates[weekNumber - 1])
  capstoneDue.setDate(capstoneDue.getDate() + 14)
  capstoneDue.setHours(23, 59, 59, 999)
  return capstoneDue
}
```

### 7.2 Due Date Population

When a student enrolls (via Lemon Squeezy webhook), the system creates `submissions` rows for weeks 2–6 with pre-computed `due_date` values based on the cohort schedule.

### 7.3 Late Submission Handling

Late submissions are accepted but flagged. The `is_late` boolean is set to `true` if `submitted_at > due_date`. The UI displays this with a muted status label: "Submitted late." Instructors see late flags in the admin inbox.

### 7.4 Reminder Emails

Resend sends two deadline reminders per deliverable:

| Trigger | Timing | Subject line |
|---|---|---|
| Upcoming reminder | 48 hours before due date | `Week [n] deliverable due in 2 days` |
| Final reminder | 12 hours before due date | `Week [n] deliverable due tonight` |

These are scheduled via a Vercel Cron Job that runs every 6 hours, queries submissions with `status = 'draft'` and approaching `due_date`, and triggers the appropriate Resend call.

```typescript
// app/api/cron/reminders/route.ts
// Vercel Cron: runs every 6 hours
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const now = new Date()
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  const in12h = new Date(now.getTime() + 12 * 60 * 60 * 1000)

  // Query pending submissions with upcoming deadlines
  const { data: upcoming } = await supabaseAdmin
    .from('submissions')
    .select('*, enrollments!inner(user_id, cohort_id, course_slug)')
    .eq('status', 'draft')
    .lte('due_date', in48h.toISOString())
    .gt('due_date', now.toISOString())

  for (const submission of upcoming ?? []) {
    const hoursLeft = (new Date(submission.due_date).getTime() - now.getTime()) / 3600000
    const template = hoursLeft <= 12 ? 'final_reminder' : 'upcoming_reminder'
    await sendDeadlineReminder(submission, template)
  }

  return Response.json({ processed: upcoming?.length ?? 0 })
}
```

---

## 8. Email System (Resend)

### 8.1 Configuration

```typescript
// lib/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS
  ?? 'The Robot Age <onboarding@resend.dev>'
```

### 8.2 Email Templates

All emails use React Email templates rendered server-side. They follow the TRA voice rules: direct, specific, no encouragement copy.

| Template | Trigger | Key content |
|---|---|---|
| `WelcomeEmail` | Enrollment created | Cohort name, start date, Week 1 Zoom link |
| `WeekUnlockedEmail` | Cron job on `week_start_dates` | Week number, title, deliverable summary, due date |
| `WeekSummaryEmail` | Week content opened | Summary of key topics, deliverable prompt recap, deadline |
| `DeadlineReminderEmail` | 48h and 12h before due date | Week number, hours remaining, direct link to submission page |
| `SubmissionReceivedEmail` | Student submits | Confirmation, expected feedback window ("Feedback within 5 business days.") |
| `FeedbackReceivedEmail` | Instructor reviews | Outcome (approved/revision), instructor comment excerpt, link |
| `FootageReadyEmail` | Admin uploads footage | Link to footage viewer |
| `PeerReviewAssignedEmail` | Admin triggers assignment | Link to peer review page |
| `CredentialIssuedEmail` | Capstone passed | Badge URL, credential public link |

### 8.3 Week Summary Email

A new email type not in the original spec. After a student opens a week for the first time (tracked via `content_viewed_at`), the system sends a summary email within 1 hour containing: the week's key topics, the deliverable prompt, the due date, and a link to the AI learning coach for that week.

```typescript
// lib/email/sendWeekSummary.ts
export async function sendWeekSummary(enrollment: Enrollment, weekContent: WeekContent) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: enrollment.user.email,
    subject: `Week ${weekContent.week_number}: ${weekContent.title}`,
    react: WeekSummaryEmail({
      studentName: enrollment.user.full_name,
      weekNumber: weekContent.week_number,
      title: weekContent.title,
      topics: weekContent.topics,
      deliverablePrompt: weekContent.deliverable_prompt,
      dueDate: formatDate(weekContent.due_date),
      coachUrl: `${BASE_URL}/courses/${enrollment.course_slug}/week/${weekContent.week_number}#coach`,
    }),
  })
}
```

---

## 9. AI Learning Coach

### 9.1 Product Concept

The AI Learning Coach is a chat interface scoped to each week of the course. It answers student questions about the RXD framework, the week's content, the deliverable requirements, and general robotics experience design concepts. It does not write deliverables for students. It does not score or evaluate work. It is a study companion grounded in TRA's own content.

**Voice rules for the coach:**

The coach follows the same TRA voice: direct, specific, no encouragement copy. It speaks like a knowledgeable colleague, not a tutor. It references framework dimensions by name. It does not say "That's a great question!" or "You're on the right track!" It answers the question.

### 9.2 Architecture

```
Student sends message
       │
       ▼
┌─────────────────────────┐
│ /api/coach/chat          │
│                          │
│ 1. Load conversation     │
│    history (last 20 msgs)│
│                          │
│ 2. Embed the user's      │
│    message               │
│                          │
│ 3. Query pgvector for    │
│    top-k relevant chunks │
│    (k=5, filtered by     │
│    course + week scope)  │
│                          │
│ 4. Build system prompt   │
│    with RAG context      │
│                          │
│ 5. Call Anthropic API    │
│    (streaming)           │
│                          │
│ 6. Stream response to    │
│    client                │
│                          │
│ 7. Save user + assistant │
│    messages to DB        │
└─────────────────────────┘
```

### 9.3 System Prompt

```typescript
const COACH_SYSTEM_PROMPT = `You are the AI Learning Coach for The Robot Age — a credential program in Robot Experience Design (RXD). You help students understand the RXD framework, the week's content, and their deliverable requirements.

Rules:
- Answer questions about RXD dimensions, robotics experience design, and course content.
- Reference the retrieved context below to ground your answers in TRA's published material.
- If the retrieved context does not contain the answer, say so. Do not invent framework details.
- Do not write, draft, or outline deliverables for the student. If asked, explain what the deliverable requires and point them to the prompt.
- Do not evaluate or score student work. That is the instructor's role.
- Be direct. State the answer first. No filler, no encouragement copy, no "great question."
- Use American English. Use RXD vocabulary: "week" not "module," "deliverable" not "assignment."
- Keep responses concise. One to three paragraphs unless the question requires more depth.
- When referencing a specific RXD dimension, name it exactly: Signal Clarity, Spatial Legibility, Perceived Presence, Failure Transparency, Interaction Fit, Recovery Design.

Current context:
- Course: {courseName}
- Week: {weekNumber} — {weekTitle}
- RXD Dimensions this week: {dimensions}

Retrieved content:
{ragContext}
`
```

### 9.4 API Route

```typescript
// app/api/coach/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { message, conversationId, enrollmentId, weekNumber } = await request.json()

  // 1. Verify the student owns this enrollment
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  // ... authorization check ...

  // 2. Get or create conversation
  let conversation = await getOrCreateConversation(enrollmentId, weekNumber)

  // 3. Load conversation history (last 20 messages)
  const history = await loadHistory(conversation.id, 20)

  // 4. Generate embedding for user message
  const embedding = await generateEmbedding(message)

  // 5. Retrieve relevant RAG chunks
  const chunks = await queryRAGChunks(embedding, courseSlug, weekNumber, 5)

  // 6. Build messages array
  const ragContext = chunks.map(c =>
    `[${c.source_type}: ${c.source_title}]\n${c.chunk_text}`
  ).join('\n\n---\n\n')

  const systemPrompt = COACH_SYSTEM_PROMPT
    .replace('{courseName}', courseName)
    .replace('{weekNumber}', String(weekNumber))
    .replace('{weekTitle}', weekTitle)
    .replace('{dimensions}', dimensions.join(', '))
    .replace('{ragContext}', ragContext)

  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: message },
  ]

  // 7. Stream response from Anthropic
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  // 8. Save user message
  await saveMessage(conversation.id, 'user', message)

  // 9. Stream to client, collect full response
  const encoder = new TextEncoder()
  let fullResponse = ''

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullResponse += event.delta.text
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`))
        }
      }
      // Save assistant response
      await saveMessage(conversation.id, 'assistant', fullResponse, chunks.map(c => c.id))
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

### 9.5 Coach UI Component

The coach is a slide-out panel on the right side of the week content page. It is triggered by a persistent "Ask the coach" button fixed to the bottom-right of the content area.

**Visual specs (following TRA design system):**

- Panel width: `360px` on desktop, full-width on mobile
- Background: `var(--color-bg)`
- Border-left: `1px solid var(--color-border)`
- Header: `--font-display`, weight 400, `--text-sm`, text "RXD Coach · Week [n]"
- Messages use `--font-body`, weight 300, `--text-sm`
- User messages: right-aligned, `--color-border` background
- Coach messages: left-aligned, no background
- Input: border-bottom only (`1px solid var(--color-border-strong)`), `--font-body`
- Send button: Pattern A (filled), `--text-xs`
- No avatars, no emoji, no typing indicators with animated dots. A simple "Thinking…" label in `--color-text-muted` during streaming.

### 9.6 Rate Limits

To control API costs:

- Maximum 30 messages per student per day.
- Maximum 1,024 tokens per response.
- Maximum conversation history context: 20 messages (older messages are trimmed from the API call, not deleted from the database).

---

## 10. RAG Pipeline

### 10.1 Content Ingestion

RAG content is ingested from the following sources:

| Source | Source type | Scope |
|---|---|---|
| Week content (body markdown) | `week_content` | Per-week |
| Deliverable prompts | `deliverable_rubric` | Per-week |
| RXD White Paper | `rxd_framework` | General |
| RXD dimension definitions | `rxd_framework` | General |
| FAQ content | `faq` | General |
| Resource documents (PDFs) | `resource` | Per-week |

### 10.2 Chunking Strategy

Documents are split into chunks of approximately 500 tokens with 50-token overlap. Chunk boundaries prefer paragraph breaks. Each chunk retains metadata: `course_slug`, `week_number`, `source_type`, `source_title`, and `chunk_index`.

```typescript
// scripts/ingest-rag.ts
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,         // ~500 tokens
  chunkOverlap: 200,       // ~50 tokens
  separators: ['\n\n', '\n', '. ', ' '],
})

async function ingestDocument(
  content: string,
  metadata: { courseSlug: string; weekNumber?: number; sourceType: string; sourceTitle: string }
) {
  const chunks = await splitter.createDocuments([content])

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i].pageContent)

    await supabaseAdmin.from('rag_chunks').insert({
      course_slug: metadata.courseSlug,
      week_number: metadata.weekNumber ?? null,
      source_type: metadata.sourceType,
      source_title: metadata.sourceTitle,
      chunk_text: chunks[i].pageContent,
      chunk_index: i,
      embedding,
      metadata: {},
    })
  }
}
```

### 10.3 Embedding Generation

```typescript
// lib/embeddings.ts
// Using OpenAI's embedding model for cost efficiency.
// Alternatively, use Anthropic's Voyager when available.
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}
```

### 10.4 Retrieval Query

```typescript
// lib/rag.ts
export async function queryRAGChunks(
  embedding: number[],
  courseSlug: string,
  weekNumber: number | null,
  topK: number = 5
) {
  // Query chunks relevant to this week + general course content
  const { data } = await supabaseAdmin.rpc('match_rag_chunks', {
    query_embedding: embedding,
    match_count: topK,
    filter_course: courseSlug,
    filter_week: weekNumber,
  })

  return data
}
```

**Postgres function for similarity search:**

```sql
create or replace function match_rag_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  filter_course text default null,
  filter_week int default null
)
returns table (
  id uuid,
  course_slug text,
  week_number int,
  source_type text,
  source_title text,
  chunk_text text,
  similarity float
)
language sql stable
as $$
  select
    rc.id,
    rc.course_slug,
    rc.week_number,
    rc.source_type,
    rc.source_title,
    rc.chunk_text,
    1 - (rc.embedding <=> query_embedding) as similarity
  from public.rag_chunks rc
  where
    (filter_course is null or rc.course_slug = filter_course)
    and (filter_week is null or rc.week_number = filter_week or rc.week_number is null)
  order by rc.embedding <=> query_embedding
  limit match_count;
$$;
```

### 10.5 Re-Ingestion

Content re-ingestion runs as a manual script (`npm run ingest-rag`) whenever course content is updated. The script deletes existing chunks for the affected `course_slug` + `week_number` and re-creates them. This is acceptable for V1 given the small content corpus (six weeks of material plus framework docs).

---

## 11. API Route Structure

```
app/
├── api/
│   ├── auth/
│   │   └── callback/route.ts              # Google OAuth callback
│   │
│   ├── submissions/
│   │   ├── [id]/route.ts                  # GET, PATCH (auto-save), PUT (submit)
│   │   └── [id]/files/route.ts            # POST (upload), GET (list files)
│   │
│   ├── rra/
│   │   ├── [enrollmentId]/route.ts        # GET, PUT (submit capstone)
│   │   └── [enrollmentId]/files/route.ts  # POST, GET
│   │
│   ├── coach/
│   │   ├── chat/route.ts                  # POST (send message, streaming)
│   │   └── conversations/route.ts         # GET (list conversations)
│   │
│   ├── progress/
│   │   └── [enrollmentId]/route.ts        # GET (all week states)
│   │
│   ├── footage/
│   │   └── [enrollmentId]/route.ts        # GET (signed video URL)
│   │
│   ├── admin/
│   │   ├── cohorts/route.ts               # GET, POST
│   │   ├── cohorts/[id]/route.ts          # GET, PATCH
│   │   ├── submissions/route.ts           # GET (inbox, filtered)
│   │   ├── submissions/[id]/review/route.ts  # POST (approve/revision)
│   │   ├── footage/route.ts               # POST (upload + link to student)
│   │   ├── credentials/route.ts           # POST (issue), GET (list)
│   │   └── students/route.ts              # GET (all enrolled students)
│   │
│   ├── webhooks/
│   │   ├── lemonsqueezy/route.ts          # POST (enrollment on purchase)
│   │   └── credentialnet/route.ts         # POST (badge issuance callback)
│   │
│   └── cron/
│       ├── unlock-weeks/route.ts          # Check cohort schedules, unlock weeks
│       ├── reminders/route.ts             # Send deadline reminders
│       └── week-summaries/route.ts        # Send week summary emails
```

---

## 12. Row-Level Security Policies

All tables have RLS enabled. Key policies:

```sql
-- Profiles: users can read their own profile
alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins read all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
  );


-- Enrollments: students see their own, admins see all
alter table public.enrollments enable row level security;

create policy "Students read own enrollments"
  on public.enrollments for select
  using (user_id = auth.uid());

create policy "Admins read all enrollments"
  on public.enrollments for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
  );


-- Submissions: students read/write own, instructors read all
alter table public.submissions enable row level security;

create policy "Students manage own submissions"
  on public.submissions for all
  using (
    exists (
      select 1 from public.enrollments
      where enrollments.id = submissions.enrollment_id
        and enrollments.user_id = auth.uid()
    )
  );

create policy "Instructors read all submissions"
  on public.submissions for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
  );

create policy "Instructors update submissions"
  on public.submissions for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
  );


-- Coach conversations: students access only their own
alter table public.coach_conversations enable row level security;

create policy "Students manage own conversations"
  on public.coach_conversations for all
  using (
    exists (
      select 1 from public.enrollments
      where enrollments.id = coach_conversations.enrollment_id
        and enrollments.user_id = auth.uid()
    )
  );

-- Week content: readable by all authenticated users
alter table public.week_content enable row level security;

create policy "Authenticated users read week content"
  on public.week_content for select
  using (auth.uid() is not null);
```

---

## 13. Real-Time Subscriptions

Supabase Realtime is used for two scenarios:

**Feedback notifications:** When an instructor submits feedback on a submission, the student sees a real-time notification without refreshing.

```typescript
// hooks/useSubmissionUpdates.ts
useEffect(() => {
  const channel = supabase
    .channel(`submission-${submissionId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'submissions',
      filter: `id=eq.${submissionId}`,
    }, (payload) => {
      if (payload.new.status !== payload.old.status) {
        onStatusChange(payload.new)
      }
    })
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [submissionId])
```

**Footage availability:** When admin uploads robot footage for a student's Week 5, the student sees a notification if they are on the platform.

---

## 14. Admin Panel

The admin panel at `/admin` is a server-rendered section with role-gating enforced both in middleware and at the data layer via RLS.

### 14.1 Sections

**Cohort Management (`/admin/cohorts`):**
- Create cohort (name, course, start date, max seats).
- Set `week_start_dates` array (auto-calculated from start date with 7-day intervals, editable).
- Set Zoom URL for Week 1.
- View enrolled students per cohort.
- Toggle cohort status (upcoming → active → complete).

**Submission Inbox (`/admin/submissions`):**
- Filterable by cohort, week number, status.
- Sortable by submitted date, due date.
- Late submissions flagged visually.
- Inline view of submission text + file downloads.
- Feedback form: comment textarea + Approve / Request Revision buttons.

**Footage Upload (`/admin/footage`):**
- Select student (from enrollment list).
- Upload video file to Supabase Storage `footage` bucket.
- Optionally upload interaction log file.
- On upload, system sends notification email to student via Resend.

**Credential Issuance (`/admin/credentials`):**
- View all students with `rra_submissions.status = 'passed'`.
- One-click credential issuance triggers Credential.net API call.
- Founding cohort flag auto-applied based on `enrollments.is_founding`.

**Student View (`/admin/students`):**
- Per-student progress dashboard: all six weeks with states, submission dates, feedback status.
- Link to each submission detail.
- Coach usage stats (messages sent per week).

---

## 15. Deployment & Infrastructure

### 15.1 Vercel Configuration

- **Framework:** Next.js 14
- **Domain:** `learn.therobotage.com` (subdomain of `therobotage.com`)
- **Node.js version:** 20.x
- **Build command:** `next build`
- **Output directory:** `.next`
- **Regions:** `iad1` (US East) — matches target audience timezone (ET)

### 15.2 Vercel Cron Jobs

Defined in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/unlock-weeks",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/reminders",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/week-summaries",
      "schedule": "0 * * * *"
    }
  ]
}
```

| Job | Schedule | Purpose |
|---|---|---|
| `unlock-weeks` | Daily at midnight UTC | Compare `cohort.week_start_dates` to current date, update `week_progress.state` from `locked` to `available`, send unlock emails |
| `reminders` | Every 6 hours | Query pending submissions with approaching due dates, send reminder emails |
| `week-summaries` | Hourly | Check for students who opened a week (content_viewed_at set) but haven't received a summary email yet, send summary |

### 15.3 Supabase Project

- **Region:** US East (to minimize latency with Vercel `iad1`)
- **Plan:** Pro (required for >500MB database, daily backups, and pgvector)
- **Extensions enabled:** `vector` (pgvector), `pg_cron` (optional, for DB-level scheduling)
- **Storage:** Two buckets (`deliverables`, `footage`) with RLS

---

## 16. Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# Google OAuth (configured in Supabase Dashboard, not in app code)
# GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in Supabase Auth settings

# Anthropic
ANTHROPIC_API_KEY=<api_key>

# OpenAI (for embeddings only)
OPENAI_API_KEY=<api_key>

# Resend
RESEND_API_KEY=<api_key>
RESEND_FROM_ADDRESS=The Robot Age <onboarding@resend.dev>

# Lemon Squeezy
LEMONSQUEEZY_WEBHOOK_SECRET=<webhook_signing_secret>

# Credential.net
CREDENTIALNET_API_KEY=<api_key>
CREDENTIALNET_ORG_ID=<org_id>

# Cron
CRON_SECRET=<random_secret_for_cron_auth>

# App
NEXT_PUBLIC_APP_URL=https://learn.therobotage.com
```

---

## 17. Migration & Seed Strategy

### 17.1 Migrations

All schema changes are managed as numbered SQL migration files in `supabase/migrations/`. Run via `supabase db push` (for development) or `supabase db migrate` (for production).

```
supabase/migrations/
├── 00001_create_profiles.sql
├── 00002_create_courses_cohorts.sql
├── 00003_create_enrollments.sql
├── 00004_create_week_content.sql
├── 00005_create_week_progress.sql
├── 00006_create_submissions.sql
├── 00007_create_submission_files.sql
├── 00008_create_rra.sql
├── 00009_create_robot_footage.sql
├── 00010_create_peer_reviews.sql
├── 00011_create_credentials.sql
├── 00012_create_rag_tables.sql
├── 00013_create_coach_tables.sql
├── 00014_create_storage_buckets.sql
├── 00015_create_rls_policies.sql
├── 00016_create_indexes.sql
├── 00017_create_functions.sql
```

### 17.2 Seed Data

```
supabase/seed.sql
```

Seeds the following for development:

- One course record (REP).
- One cohort (Founding Cohort, 10 seats, start date in the past for testing).
- Week content for all six weeks (populated from the curriculum document).
- Two test users: one student, one admin.
- One enrollment linking the student to the cohort.
- Week progress records for all six weeks.
- RAG chunks pre-ingested from the curriculum and RXD framework content.

---

## Appendix: Component File Map

```
src/
├── app/
│   ├── layout.tsx                     # Root layout, font loading, Supabase provider
│   ├── globals.css                    # Design tokens only
│   ├── signin/
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── auth/callback/route.ts
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── courses/
│   │   ├── page.tsx
│   │   ├── [slug]/
│   │   │   ├── page.tsx
│   │   │   ├── page.module.css
│   │   │   ├── week/[n]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── page.module.css
│   │   │   │   ├── submit/page.tsx
│   │   │   │   └── footage/page.tsx
│   │   │   ├── capstone/page.tsx
│   │   │   └── peer-review/page.tsx
│   ├── profile/
│   │   ├── page.tsx
│   │   └── credentials/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                 # Admin layout with role guard
│   │   ├── page.tsx
│   │   ├── cohorts/
│   │   ├── submissions/
│   │   ├── footage/
│   │   ├── credentials/
│   │   └── students/
│   └── api/                           # See Section 11
│
├── components/
│   ├── LMSNav/
│   ├── CourseSidebar/
│   ├── WeekCard/
│   ├── ProgressBar/
│   ├── StatusBadge/
│   ├── DeliverablePanel/
│   ├── SubmissionEditor/
│   ├── FileUpload/
│   ├── FileList/
│   ├── FeedbackBlock/
│   ├── RESScoreCard/
│   ├── RRAForm/
│   ├── FootageViewer/
│   ├── CredentialCard/
│   ├── CoachPanel/
│   ├── CoachMessage/
│   ├── CoachInput/
│   ├── AdminSubmissionRow/
│   ├── InstructorFeedbackForm/
│   ├── DeadlineBadge/
│   └── LateBadge/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser client
│   │   ├── server.ts                  # Server client
│   │   └── admin.ts                   # Service role client (for webhooks, cron)
│   ├── anthropic.ts                   # Anthropic client init
│   ├── embeddings.ts                  # Embedding generation
│   ├── rag.ts                         # RAG query logic
│   ├── resend.ts                      # Email client
│   ├── deadlines.ts                   # Due date computation
│   └── email/
│       ├── templates/                 # React Email templates
│       └── send.ts                    # Email dispatch helpers
│
├── hooks/
│   ├── useAutoSave.ts
│   ├── useSubmissionUpdates.ts
│   ├── useCoach.ts
│   └── useWordCount.ts
│
└── scripts/
    └── ingest-rag.ts                  # RAG content ingestion script
```

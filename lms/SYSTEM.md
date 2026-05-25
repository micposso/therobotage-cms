# SYSTEM.md — The Robot Age LMS

Technical reference for `learn.therobotage.com`. Covers architecture, data models, API surface, and how each major system works end-to-end.

---

## 1. Stack Overview

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 — App Router, React 19, React Compiler |
| Language | TypeScript (strict) |
| Database | Supabase Postgres (hosted) |
| Auth | Supabase Auth — Google OAuth only |
| ORM | Supabase JS client (no Prisma) |
| Storage | Supabase Storage — two private buckets |
| AI Coach | Anthropic `claude-sonnet-4-6` via SSE streaming |
| RAG Embeddings | OpenAI `text-embedding-3-small` (dimension 1536) |
| Vector Search | pgvector — HNSW index, cosine similarity |
| Email | Resend — `onboarding@resend.dev` sender until domain verified |
| Payments | Lemon Squeezy — webhook-driven enrollment |
| Credentials | Credential.net — badge issuance on capstone pass |
| Deployment | Vercel — 3 cron jobs defined in `vercel.json` |
| Styling | CSS Modules co-located with components, no Tailwind |

---

## 2. Repository Layout

```
lms/
├── src/
│   ├── app/
│   │   ├── (public)/          # Unauthenticated routes: /signin
│   │   ├── (app)/             # Authenticated routes: /dashboard, /courses, /admin
│   │   ├── api/               # All API routes
│   │   └── auth/callback/     # OAuth callback
│   ├── components/            # UI components with co-located CSS modules
│   ├── hooks/                 # Client-side React hooks
│   ├── lib/                   # Shared server utilities
│   │   ├── supabase/          # client.ts, server.ts, admin.ts
│   │   ├── anthropic.ts       # AI Coach client
│   │   ├── embeddings.ts      # OpenAI embeddings
│   │   ├── rag.ts             # RAG query + chunking
│   │   ├── resend.ts          # Email client
│   │   ├── deadlines.ts       # Due date logic
│   │   └── email/send.ts      # All email send functions
│   ├── types/index.ts         # All TypeScript interfaces
│   └── proxy.ts               # Next.js 16 middleware (named export `proxy`)
├── supabase/
│   ├── migrations/            # 00001–00017 ordered SQL files
│   └── seed.sql               # REP course, Founding Cohort, week stubs
└── vercel.json                # Cron job schedules
```

---

## 3. Authentication

**Provider:** Google OAuth only (no email/password in V1).

**Flow:**
1. User clicks "Continue with Google" on `/signin`
2. `supabase.auth.signInWithOAuth` redirects to Google
3. Google returns to `/auth/callback?code=...`
4. `route.ts` exchanges the code for a session via `supabase.auth.exchangeCodeForSession()`
5. Redirects to `/dashboard`

**Session handling:** All server components and API routes call `supabase.auth.getUser()` (never `getSession()` — the latter does not re-validate the JWT with Supabase's server). The `@supabase/ssr` package wires cookies automatically.

**On first sign-in:** The `handle_new_user` Postgres trigger fires on `auth.users` insert and creates a `profiles` row with `role = 'student'` and metadata (name, avatar) from Google.

**Middleware (`src/proxy.ts`):**
- Routes starting with `/dashboard`, `/courses`, `/profile`, `/admin` require a session — redirect to `/signin` if missing.
- Routes starting with `/signin`, `/signup`, `/forgot-password`, `/reset-password` redirect to `/dashboard` if already signed in.
- Routes starting with `/admin` additionally query `profiles.role` — redirects to `/dashboard` if role is not `admin` or `instructor`.

---

## 4. Database Schema

17 migration files in `supabase/migrations/`, applied in order. All tables have Row-Level Security enabled.

### profiles
Extends `auth.users`. Created automatically via trigger on sign-up.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | matches `auth.users.id` |
| email | text | |
| full_name | text | from Google OAuth metadata |
| avatar_url | text | from Google OAuth metadata |
| role | text | `student` \| `instructor` \| `admin` |
| credential_net_id | text | Credential.net recipient ID |

### courses
Static course catalogue. Seeded with REP (Robot Experience Professional).

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| slug | text unique | e.g. `rep` |
| title | text | |
| total_weeks | integer | 6 for REP |

### cohorts
Each cohort is a run of a course with a fixed calendar.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| course_id | uuid FK → courses | |
| name | text | e.g. `Founding Cohort` |
| start_date | date | |
| week_start_dates | text[] | Array of ISO dates, one per week |
| zoom_url | text | Week 1 live session URL |
| status | text | `upcoming` \| `active` \| `complete` |
| max_seats | integer | null = unlimited |

### enrollments
One row per student per cohort. Created by the Lemon Squeezy webhook.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → profiles | |
| cohort_id | uuid FK → cohorts | |
| course_slug | text | denormalized for fast queries |
| status | text | `active` \| `paused` \| `complete` |
| lemon_squeezy_order_id | text | |
| is_founding | boolean | founding cohort flag |
| unique | (user_id, cohort_id) | |

### week_content
Course content per week. Set by instructors, read by students.

| Column | Type | Notes |
|---|---|---|
| course_id | uuid FK | |
| week_number | integer | 1–6 |
| title, subtitle | text | |
| format | text | `live_zoom` \| `self_paced` \| `capstone` |
| body_markdown | text | Week content |
| topics, learning_outcomes | text[] | |
| resources | jsonb | `[{title, url, type}]` |
| deliverable_prompt | text | null = no deliverable |
| deliverable_word_min/max | integer | |
| deliverable_accepts_files | boolean | |
| deliverable_file_types | text[] | MIME types |
| deliverable_max_file_size_mb | integer | |

### week_progress
One row per enrollment per week. State machine for student progress.

| Column | Type | Notes |
|---|---|---|
| enrollment_id | uuid FK | |
| week_number | integer | |
| state | text | See state machine below |
| content_viewed_at | timestamptz | set when student first visits week |
| submitted_at, approved_at | timestamptz | |

**State machine:**
```
locked → available → in_progress → submitted → approved
                                             ↓
                                    revision_requested → submitted
```
- `locked → available`: cron job (`/api/cron/unlock-weeks`) runs daily and checks `cohort.week_start_dates`
- `available → in_progress`: set when student first loads the week page
- `in_progress → submitted`: set when student submits deliverable
- `submitted → approved` or `revision_requested`: set by instructor via feedback API
- `revision_requested → submitted`: student re-submits

### submissions
One row per enrollment per week (unique constraint). Draft saved separately from submitted content.

| Column | Type | Notes |
|---|---|---|
| enrollment_id | uuid FK | |
| week_number | integer | |
| draft | text | auto-saved every 2s |
| content | text | set on final submit |
| status | text | `draft` \| `submitted` \| `revision_requested` \| `approved` |
| due_date | timestamptz | computed from `cohort.week_start_dates` |
| is_late | boolean | set at submit time |
| instructor_comment | text | feedback from instructor |
| reviewed_by | uuid FK → profiles | |
| draft_saved_at | timestamptz | last auto-save timestamp |

### submission_files
File attachments for week deliverables. Stored in Supabase Storage `deliverables` bucket.

### rra_submissions
Robot Readiness Audit — the capstone (week 6). Six RES dimension scores (1–5) plus rationale.

| Column | Type | Notes |
|---|---|---|
| enrollment_id | uuid FK unique | one RRA per enrollment |
| signal_clarity_score | integer | 1–5 |
| spatial_legibility_score | integer | 1–5 |
| perceived_presence_score | integer | 1–5 |
| failure_transparency_score | integer | 1–5 |
| interaction_fit_score | integer | 1–5 |
| recovery_design_score | integer | 1–5 |
| total_res | integer | sum of all 6, computed on submit |
| status | text | `draft` \| `submitted` \| `passed` \| `revision_requested` |

### robot_footage
Video files from Reachy Mini sessions (week 5). Stored in Supabase Storage `footage` bucket. Viewing is gated — `viewed_at` must be set before the capstone unlocks.

### peer_reviews
Assigned by instructors. Reviewer evaluates another student's RRA.

### credentials
Issued when instructor marks RRA `passed`. Stores Credential.net badge and public URLs.

### rag_chunks
Course content chunked and embedded for the AI Coach RAG pipeline.

| Column | Type | Notes |
|---|---|---|
| course_slug | text | |
| week_number | integer | null = course-wide |
| source_type | text | `week_content` \| `rxd_framework` \| `white_paper` \| `deliverable_rubric` \| `faq` \| `resource` |
| chunk_text | text | ~2000 chars |
| embedding | vector(1536) | from OpenAI |
| metadata | jsonb | arbitrary extra context |

HNSW index: `m=16`, `ef_construction=64`, cosine distance operator.

### coach_conversations / coach_messages
Persisted chat history. Each conversation is scoped to an enrollment and optionally a week.

---

## 5. Storage Buckets

Both buckets are **private** — no public URLs. Files are served via signed URLs generated server-side.

| Bucket | Max size | Who uploads | Who reads |
|---|---|---|---|
| `deliverables` | 25 MB per file | Students (own submissions) | Student (own) + Instructors |
| `footage` | 500 MB per file | Instructors / admins only | Student (own) + Instructors |

Storage path conventions:
- Deliverables: `{enrollmentId}/{submissionId}/{timestamp}-{filename}`
- RRA files: `rra/{enrollmentId}/{timestamp}-{filename}`
- Footage: `{enrollmentId}/week{n}/{timestamp}-{filename}`

---

## 6. API Routes

All routes are under `src/app/api/`. Auth check pattern: every route calls `supabase.auth.getUser()` and returns `401` if no session. Ownership is verified against the enrollment's `user_id`.

### Student Routes

#### `GET /api/submissions/by-week?courseSlug=&weekNumber=`
Returns the student's submission for a given week (creates a draft record if none exists). Also computes and stores the `due_date` from `cohort.week_start_dates`.

#### `GET /api/submissions/[id]`
Fetch a submission with its files.

#### `PATCH /api/submissions/[id]`
Auto-save draft. Body: `{ draft: string }`. Updates `draft` and `draft_saved_at`. Blocked if status is `submitted` or `approved`.

#### `PUT /api/submissions/[id]`
Final submit. Body: `{ content: string }`. Sets `status = 'submitted'`, `submitted_at`, `is_late`. Also updates `week_progress.state → submitted`.

#### `POST /api/submissions/[id]/files`
Multipart file upload. Max 25 MB, allowed MIME types from `week_content.deliverable_file_types`. Uploads to `deliverables` bucket, inserts `submission_files` row.

#### `DELETE /api/submissions/[id]/files?fileId=`
Deletes file from storage and `submission_files` table.

#### `GET /api/week-content?courseSlug=&weekNumber=`
Fetch `week_content` row for a given course and week.

#### `GET /api/progress/[enrollmentId]`
Fetch all `week_progress` rows for an enrollment.

#### `PATCH /api/progress/[enrollmentId]`
Body: `{ weekNumber, state }`. Only `in_progress` is a student-settable state (sets `content_viewed_at`). All other state transitions happen server-side via API or cron.

#### `GET /api/rra/[enrollmentId]`
Fetch the RRA submission with files.

#### `PATCH /api/rra/[enrollmentId]`
Save RRA draft fields. Upserts the record. Blocked if status is `submitted` or `passed`.

#### `PUT /api/rra/[enrollmentId]`
Final submit. Validates all 6 scores are present, computes `total_res`, sets `status = 'submitted'`.

#### `POST /api/rra/[enrollmentId]/files`
Upload file to RRA submission (same rules as deliverable files).

#### `GET /api/footage/[enrollmentId]`
List footage records for an enrollment.

#### `POST /api/footage/[enrollmentId]/viewed`
Body: `{ footageId }`. Marks footage as viewed by setting `viewed_at`. Required before the capstone unlocks.

#### `GET /api/coach/conversations?enrollmentId=`
List all conversations for an enrollment with their messages.

#### `POST /api/coach/conversations`
Body: `{ enrollmentId, weekNumber? }`. Create a new coach conversation.

#### `POST /api/coach/chat`
Body: `{ conversationId, message, courseSlug, weekNumber? }`. Streams SSE response from Claude. Daily limit: 30 user messages per conversation. See AI Coach section for full detail.

#### `PUT /api/peer-review/[reviewId]`
Body: `{ strengths, improvements, holisticRating? }`. Submit peer review; sets `status = 'submitted'`.

### Admin Routes (instructor | admin role required)

#### `GET /api/admin/submissions?cohortId=&status=&weekNumber=`
List all submissions across cohorts with student profiles. Filterable.

#### `GET /api/admin/submissions/[id]`
Fetch single submission with files and student profile.

#### `POST /api/admin/submissions/[id]/feedback`
Body: `{ comment, decision }` where `decision` is `approved` or `revision_requested`. Updates submission status, updates `week_progress` state, sends `FeedbackReceived` email to student.

#### `GET /api/admin/cohorts`
List all cohorts with course info.

#### `POST /api/admin/cohorts`
Create a cohort. Admin only.

#### `GET /api/admin/students?cohortId=`
List enrollments with profiles, cohort info, and week progress.

#### `GET /api/admin/footage?enrollmentId=`
List all footage records with student and cohort info.

#### `POST /api/admin/footage`
Upload footage on behalf of a student. Multipart. Sets `viewed_at` immediately (admin upload = already seen).

#### `GET /api/admin/credentials`
List all issued credentials.

#### `POST /api/admin/credentials`
Body: `{ userId, courseSlug, credentialNetBadgeUrl?, credentialNetPublicUrl?, isFounding? }`. Issue a credential and send `CredentialIssued` email.

### Webhook Routes (no session required — HMAC or key-based auth)

#### `POST /api/webhooks/lemonsqueezy`
Validates `x-signature` header via HMAC-SHA256 against `LEMONSQUEEZY_WEBHOOK_SECRET`. On `order_created` event: finds the buyer's `auth.users` record by email, finds the active cohort for the purchased course, upserts an `enrollments` row, sends `Welcome` email. If the user hasn't signed in yet, writes to a `pending_enrollments` table for deferred enrollment.

#### `POST /api/webhooks/credentialnet`
Receives badge URLs from Credential.net after issuance. Updates `credentials` record with `credential_net_badge_url` and `credential_net_public_url`.

### Cron Routes (Bearer `CRON_SECRET` required)

#### `GET /api/cron/unlock-weeks`
Runs daily at midnight UTC. For every active cohort, compares today's date against `cohort.week_start_dates`. For each week whose start date has passed and whose `week_progress.state` is still `locked`, sets state to `available` and sends `WeekUnlocked` email (only on the exact unlock day).

#### `GET /api/cron/reminders`
Runs every 6 hours. Finds draft submissions with a `due_date` in the future. Sends `DeadlineReminder` email at 48h, 24h, and 6h windows.

#### `GET /api/cron/week-summaries`
Runs hourly but only acts on Mondays. For each cohort, identifies the week that just ended and sends `WeekSummary` emails summarizing each student's progress state.

### Ingest Route

#### `POST /api/ingest`
Bearer `CRON_SECRET` required. Body: `{ courseSlug, weekNumber?, sourceType, sourceTitle, text, metadata? }`. Splits text into ~2000-char chunks with 200-char overlap, generates OpenAI embeddings, and inserts into `rag_chunks`. Used to populate the RAG knowledge base from course material.

---

## 7. AI Learning Coach

The coach is a per-enrollment conversational AI scoped to course content.

**Architecture:**

```
Student message
    ↓
POST /api/coach/chat
    ↓
1. Auth + ownership check
2. Daily limit check (30 user messages/day from coach_messages)
3. Fetch last 20 messages as context (COACH_HISTORY_LIMIT)
4. RAG retrieval:
   - generateEmbedding(message) → OpenAI text-embedding-3-small
   - match_rag_chunks() pgvector cosine search → top 5 chunks
5. Build system prompt with RAG context injected
6. anthropic.messages.stream() → claude-sonnet-4-6
7. Stream SSE chunks to client (text/event-stream)
8. On stream complete: persist assistant message to coach_messages
```

**Client-side:** `useCoach` hook manages message state, SSE parsing, and abort controller. `CoachPanel` component renders the conversation with auto-scroll.

**RAG pipeline:**
- Content is ingested via `POST /api/ingest` (call this after adding/updating course content)
- `splitIntoChunks()` in `src/lib/rag.ts` does recursive text splitting with 2000-char target and 200-char overlap
- At query time, the student's message is embedded and compared against `rag_chunks` for the same `course_slug` and `week_number` (or course-wide chunks)
- Top 5 chunks are injected into the Claude system prompt as `## Relevant course material`

**Constants** (`src/lib/anthropic.ts`):
- Model: `claude-sonnet-4-6`
- Max tokens per response: 1024
- History window: 20 messages
- Daily limit: 30 user messages

---

## 8. Enrollment Flow

```
Student purchases on therobotage.com
    ↓
Lemon Squeezy fires order_created webhook
    ↓
POST /api/webhooks/lemonsqueezy
    ↓
Validates HMAC-SHA256 signature
    ↓
Looks up buyer email in auth.users
    ↓ (if user exists)
Finds active cohort for course_slug
    ↓
INSERT enrollments (user_id, cohort_id, course_slug, lemon_squeezy_order_id)
    ↓
Sends Welcome email via Resend
    ↓
Cron: unlock-weeks creates week_progress rows as dates pass
```

If the user hasn't signed up yet when the webhook fires (bought before creating account), a `pending_enrollments` record is written. That table needs a trigger or sign-in hook to complete enrollment on first login (not yet implemented — needs a `handle_pending_enrollment` function).

---

## 9. Deliverable Submission Flow

```
Student visits /courses/[slug]/week/[n]/submit
    ↓
GET /api/submissions/by-week — creates draft if none exists
    ↓
Student types → useAutoSave fires PATCH every 2s of inactivity
    ↓
Student clicks Submit → PUT /api/submissions/[id]
    ↓
Sets content, status=submitted, is_late (compared to due_date), submitted_at
Sets week_progress.state = submitted
    ↓
Instructor sees submission in /admin/submissions
    ↓
POST /api/admin/submissions/[id]/feedback { decision, comment }
    ↓
Sets submission.status = approved | revision_requested
Sets week_progress.state accordingly
Sends FeedbackReceived email to student
    ↓
Student gets real-time update via Supabase Realtime (useSubmissionUpdates hook)
```

**Auto-save detail:** `useAutoSave` debounces 2 seconds after each keystroke, then PATCHes the draft. The `savedAt` timestamp is displayed next to the word count. The `flush()` method is called before final submit to ensure the latest content is saved.

---

## 10. Capstone (RRA) Unlock Gate

Week 6 / capstone requires two conditions:

1. `robot_footage.viewed_at IS NOT NULL` for at least one week-5 footage record on the enrollment
2. `week_progress.state = 'complete'` for week 5 (requires instructor approval of week 5 deliverable)

Both are checked server-side in `src/app/(app)/courses/[slug]/capstone/page.tsx` before rendering the RRAForm.

---

## 11. Credential Issuance Flow

```
Instructor reviews RRA in /admin/submissions (or a future /admin/rra page)
    ↓
Marks RRA as passed
    ↓
POST /api/admin/credentials { userId, courseSlug, isFounding? }
    ↓
INSERT credentials
Sends CredentialIssued email (badge + public URL)
    ↓
Credential.net API call (external, not yet wired — webhook receives badge URLs)
    ↓
POST /api/webhooks/credentialnet { badgeUrl, publicUrl, recipientEmail, courseSlug }
    ↓
UPDATE credentials with badge URLs
```

---

## 12. Deadline Engine

`src/lib/deadlines.ts` computes all due dates from `cohort.week_start_dates`.

**Rule:** Deliverables are due the day before the next week opens (23:59:59 local time). The final week is due 14 days after it opens.

```typescript
computeDueDate(weekStartDates, weekNumber):
  if weekNumber === 1 → null (no deliverable)
  if weekNumber < total weeks → day before weekStartDates[weekNumber] at 23:59:59
  if final week → weekStartDates[weekNumber-1] + 14 days at 23:59:59
```

`is_late` is computed at submit time by comparing `submitted_at` to `due_date`. It is permanent once set.

---

## 13. Email System

All emails sent via Resend. Sender: `onboarding@resend.dev` (switch to `@therobotage.com` once domain is verified in Resend).

All send functions are in `src/lib/email/send.ts`:

| Function | Trigger | Subject |
|---|---|---|
| `sendWelcome` | Lemon Squeezy webhook | Welcome to The Robot Age |
| `sendWeekUnlocked` | Cron: unlock-weeks | Week N is now open |
| `sendWeekSummary` | Cron: week-summaries (Mondays) | Cohort — Week N summary |
| `sendDeadlineReminder` | Cron: reminders (48h, 24h, 6h) | Week N deliverable due … |
| `sendSubmissionReceived` | (not yet called — wire to PUT submit) | Week N deliverable received |
| `sendFeedbackReceived` | Admin feedback POST | Week N approved / revision requested |
| `sendFootageReady` | (wire to admin footage upload) | Your robot footage is ready |
| `sendPeerReviewAssigned` | (wire to admin peer review assignment) | Peer review assigned |
| `sendCredentialIssued` | Admin credentials POST | REP credential issued |

---

## 14. Supabase Client Pattern

Three clients, all in `src/lib/supabase/`:

| File | Usage | Key |
|---|---|---|
| `client.ts` | Client components only | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon) |
| `server.ts` | Server components, API routes | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon) + cookie auth |
| `admin.ts` | Webhooks, cron, admin writes | `SUPABASE_SERVICE_ROLE_KEY` — bypasses RLS |

All three clients are **lazy** (instantiated on first call, not at module load) to avoid build-time failures when env vars are absent.

Server client reads/writes cookies using Next.js `cookies()` from `next/headers` — required for `@supabase/ssr` session persistence across server requests.

---

## 15. Row-Level Security Summary

| Table | Student | Instructor/Admin |
|---|---|---|
| profiles | Read/update own | Read all |
| courses | Read (authenticated) | Read (authenticated) |
| cohorts | Read (authenticated) | Read + write |
| enrollments | Read own | Read all |
| week_content | Read (authenticated) | Read + write |
| week_progress | Read + write own | Read all |
| submissions | Read + write own | Read all + update (feedback) |
| submission_files | Read + write own | Read all |
| rra_submissions | Read + write own | Read + write all |
| rra_files | (via rra_submissions) | (via rra_submissions) |
| robot_footage | Read own | Read + write all |
| peer_reviews | Read + write own (as reviewer) | Read + write all |
| credentials | Read own | Read + write all |
| coach_conversations | Read + write own | — |
| coach_messages | Read + write own | — |
| rag_chunks | Read (authenticated) | Read + write |
| storage: deliverables | Upload/read own | Read all |
| storage: footage | Read own | Upload + read all |

Webhooks and cron routes use `supabaseAdmin` (service role) which bypasses all RLS.

---

## 16. Environment Variables

| Variable | Required | Used in |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | All Supabase clients |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Anon clients (client + server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | `supabase/admin.ts` — never sent to browser |
| `ANTHROPIC_API_KEY` | Yes | AI Coach streaming |
| `OPENAI_API_KEY` | Yes | RAG embeddings |
| `RESEND_API_KEY` | Yes | All transactional email |
| `RESEND_FROM_ADDRESS` | No | Defaults to `onboarding@resend.dev` |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Yes | Webhook HMAC verification |
| `CREDENTIALNET_API_KEY` | Future | Not yet wired |
| `CREDENTIALNET_ORG_ID` | Future | Not yet wired |
| `CRON_SECRET` | Yes | All cron + ingest routes (Bearer auth) |
| `NEXT_PUBLIC_APP_URL` | Yes | Email links (`https://learn.therobotage.com`) |
| `NEXT_PUBLIC_MARKETING_URL` | Yes | Nav links back to `therobotage.com` |

---

## 17. Cron Jobs

Defined in `vercel.json`. All routes verify `Authorization: Bearer {CRON_SECRET}`.

| Route | Schedule | What it does |
|---|---|---|
| `/api/cron/unlock-weeks` | `0 0 * * *` (midnight UTC daily) | Unlocks weeks by checking `cohort.week_start_dates` against today |
| `/api/cron/reminders` | `0 */6 * * *` (every 6 hours) | Sends deadline reminder emails at 48h, 24h, 6h windows |
| `/api/cron/week-summaries` | `0 * * * *` (hourly, acts on Mondays only) | Sends week summary emails when a new week begins |

---

## 18. Database Setup

Run migrations in order before deploying. Prerequisites:
1. Enable the `vector` extension in Supabase Dashboard → Database → Extensions
2. Run `supabase/migrations/00001_create_profiles.sql` through `00017_create_functions.sql` in order
3. Run `supabase/seed.sql` to create the REP course, Founding Cohort, and 6 week content stubs
4. Enable Google OAuth in Supabase Dashboard → Authentication → Providers

Using the CLI:
```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

---

## 19. Known Gaps (not yet implemented)

| Gap | Location | Notes |
|---|---|---|
| `pending_enrollments` table | `webhooks/lemonsqueezy` | Needs a `handle_pending_enrollment` trigger to complete enrollment on first login |
| Credential.net API call | `admin/credentials` | Currently manual — no outbound API call to Credential.net on issuance |
| `sendSubmissionReceived` | `submissions/[id] PUT` | Email not yet called on submit |
| `sendFootageReady` | `admin/footage POST` | Email not yet called after admin uploads footage |
| `sendPeerReviewAssigned` | Peer review assignment | No assignment UI or email trigger yet |
| RAG ingest for initial content | `api/ingest` | Manual call needed after seeding week content |
| Admin RRA review page | `/admin/rra` | Capstone review happens via submissions page for now |

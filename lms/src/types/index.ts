export type UserRole = 'student' | 'instructor' | 'admin'
export type WeekState = 'locked' | 'available' | 'in_progress' | 'submitted' | 'revision_requested' | 'complete'
export type SubmissionStatus = 'draft' | 'submitted' | 'revision_requested' | 'approved'
export type RRAStatus = 'draft' | 'submitted' | 'passed' | 'revision_requested'
export type CohortStatus = 'upcoming' | 'active' | 'complete'
export type EnrollmentStatus = 'active' | 'paused' | 'complete'
export type WeekFormat = 'live_zoom' | 'self_paced' | 'capstone'
export type PeerReviewStatus = 'assigned' | 'submitted'
export type MessageRole = 'user' | 'assistant'
export type RAGSourceType = 'week_content' | 'rxd_framework' | 'white_paper' | 'deliverable_rubric' | 'faq' | 'resource'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  credential_net_id: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  slug: string
  title: string
  short_title: string
  description: string | null
  total_weeks: number
  created_at: string
}

export interface Cohort {
  id: string
  course_id: string
  name: string
  start_date: string
  week_start_dates: string[]
  zoom_url: string | null
  zoom_recording_url: string | null
  zoom_ics_url: string | null
  status: CohortStatus
  max_seats: number | null
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  cohort_id: string
  course_slug: string
  status: EnrollmentStatus
  lemon_squeezy_order_id: string | null
  is_founding: boolean
  created_at: string
}

export interface Resource {
  title: string
  url: string
  type: 'pdf' | 'link' | 'video'
}

export interface WeekContent {
  id: string
  course_id: string
  week_number: number
  title: string
  subtitle: string | null
  format: WeekFormat
  rxd_dimensions: string[]
  estimated_hours: number | null
  body_markdown: string
  topics: string[]
  learning_outcomes: string[]
  resources: Resource[]
  deliverable_prompt: string | null
  deliverable_word_min: number | null
  deliverable_word_max: number | null
  deliverable_accepts_files: boolean
  deliverable_file_types: string[]
  deliverable_max_file_size_mb: number
  created_at: string
  updated_at: string
}

export interface WeekProgress {
  id: string
  enrollment_id: string
  week_number: number
  state: WeekState
  content_viewed_at: string | null
  submitted_at: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface Submission {
  id: string
  enrollment_id: string
  week_number: number
  draft: string
  content: string | null
  submitted_at: string | null
  due_date: string | null
  status: SubmissionStatus
  is_late: boolean
  instructor_comment: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  draft_saved_at: string | null
  created_at: string
  updated_at: string
}

export interface SubmissionFile {
  id: string
  submission_id: string
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  uploaded_at: string
}

export type RRAdimensionScore = 1 | 2 | 3 | 4 | 5

export interface RRASubmission {
  id: string
  enrollment_id: string
  signal_clarity_score: RRAdimensionScore | null
  signal_clarity_rationale: string | null
  spatial_legibility_score: RRAdimensionScore | null
  spatial_legibility_rationale: string | null
  perceived_presence_score: RRAdimensionScore | null
  perceived_presence_rationale: string | null
  failure_transparency_score: RRAdimensionScore | null
  failure_transparency_rationale: string | null
  interaction_fit_score: RRAdimensionScore | null
  interaction_fit_rationale: string | null
  recovery_design_score: RRAdimensionScore | null
  recovery_design_rationale: string | null
  overall_summary: string | null
  total_res: number | null
  submitted_at: string | null
  due_date: string | null
  status: RRAStatus
  instructor_comment: string | null
  passed_at: string | null
  reviewed_by: string | null
  created_at: string
  updated_at: string
}

export interface RRAFile {
  id: string
  rra_submission_id: string
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  uploaded_at: string
}

export interface RobotFootage {
  id: string
  enrollment_id: string
  week_number: number
  video_storage_path: string
  interaction_log_path: string | null
  uploaded_at: string
  viewed_at: string | null
  uploaded_by: string | null
}

export interface PeerReview {
  id: string
  reviewer_enrollment_id: string
  reviewee_enrollment_id: string
  rra_submission_id: string
  strengths: string | null
  improvements: string | null
  holistic_rating: string | null
  submitted_at: string | null
  status: PeerReviewStatus
  created_at: string
}

export interface Credential {
  id: string
  user_id: string
  course_slug: string
  credential_net_badge_url: string | null
  credential_net_public_url: string | null
  issued_at: string
  is_founding: boolean
}

export interface RAGChunk {
  id: string
  course_slug: string
  week_number: number | null
  source_type: RAGSourceType
  source_title: string
  chunk_text: string
  chunk_index: number
  metadata: Record<string, unknown>
  created_at: string
}

export interface CoachConversation {
  id: string
  enrollment_id: string
  week_number: number | null
  created_at: string
  updated_at: string
}

export interface CoachMessage {
  id: string
  conversation_id: string
  role: MessageRole
  content: string
  rag_chunks_used: string[]
  created_at: string
}

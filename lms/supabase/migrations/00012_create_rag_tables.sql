create extension if not exists vector;

create table public.rag_chunks (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  week_number integer,
  source_type text not null
    check (source_type in (
      'week_content', 'rxd_framework', 'white_paper',
      'deliverable_rubric', 'faq', 'resource'
    )),
  source_title text not null,
  chunk_text text not null,
  chunk_index integer not null default 0,
  embedding vector(1536) not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index on public.rag_chunks
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

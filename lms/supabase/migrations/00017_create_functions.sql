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

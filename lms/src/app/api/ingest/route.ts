import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateEmbedding } from '@/lib/embeddings'
import { splitIntoChunks } from '@/lib/rag'
import type { RAGSourceType } from '@/types'

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { courseSlug, weekNumber, sourceType, sourceTitle, text, metadata } = await req.json()

  if (!courseSlug || !sourceType || !sourceTitle || !text) {
    return NextResponse.json(
      { error: 'courseSlug, sourceType, sourceTitle, and text required' },
      { status: 400 }
    )
  }

  const validTypes: RAGSourceType[] = ['week_content', 'rxd_framework', 'white_paper', 'deliverable_rubric', 'faq', 'resource']
  if (!validTypes.includes(sourceType)) {
    return NextResponse.json({ error: `sourceType must be one of: ${validTypes.join(', ')}` }, { status: 400 })
  }

  const chunks = splitIntoChunks(text)
  const inserted: string[] = []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const embedding = await generateEmbedding(chunk)

    const { data, error } = await supabaseAdmin
      .from('rag_chunks')
      .insert({
        course_slug: courseSlug,
        week_number: weekNumber ?? null,
        source_type: sourceType,
        source_title: sourceTitle,
        chunk_text: chunk,
        chunk_index: i,
        embedding,
        metadata: metadata ?? {},
      })
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    inserted.push(data.id)
  }

  return NextResponse.json({ ok: true, chunks: inserted.length, ids: inserted }, { status: 201 })
}

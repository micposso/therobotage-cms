import { supabaseAdmin } from './supabase/admin'
import { generateEmbedding } from './embeddings'
import type { RAGChunk } from '@/types'

export const RAG_TOP_K = 5

export async function queryRAGChunks(
  query: string,
  courseSlug: string,
  weekNumber: number | null,
  topK: number = RAG_TOP_K
): Promise<RAGChunk[]> {
  const embedding = await generateEmbedding(query)

  const { data, error } = await supabaseAdmin.rpc('match_rag_chunks', {
    query_embedding: embedding,
    match_count: topK,
    filter_course: courseSlug,
    filter_week: weekNumber,
  })

  if (error) throw error
  return data ?? []
}

export function formatRAGContext(chunks: RAGChunk[]): string {
  return chunks
    .map((c) => `[${c.source_type}: ${c.source_title}]\n${c.chunk_text}`)
    .join('\n\n---\n\n')
}

// Simple recursive text splitter for ingest script
export function splitIntoChunks(text: string, chunkSize = 2000, overlap = 200): string[] {
  const separators = ['\n\n', '\n', '. ', ' ']
  const chunks: string[] = []

  function split(content: string, sepIndex: number): string[] {
    if (content.length <= chunkSize || sepIndex >= separators.length) {
      return [content]
    }
    const sep = separators[sepIndex]
    const parts = content.split(sep)
    const result: string[] = []
    let current = ''

    for (const part of parts) {
      const candidate = current ? current + sep + part : part
      if (candidate.length <= chunkSize) {
        current = candidate
      } else {
        if (current) result.push(current)
        current = part.length > chunkSize ? split(part, sepIndex + 1).join(sep) : part
      }
    }
    if (current) result.push(current)
    return result
  }

  const raw = split(text, 0)
  for (let i = 0; i < raw.length; i++) {
    chunks.push(raw[i])
    // Add overlap with previous chunk for context continuity
    if (i > 0 && overlap > 0) {
      const prev = raw[i - 1]
      const overlapText = prev.slice(-overlap)
      if (!raw[i].startsWith(overlapText)) {
        chunks[chunks.length - 1] = overlapText + ' ' + raw[i]
      }
    }
  }
  return chunks
}

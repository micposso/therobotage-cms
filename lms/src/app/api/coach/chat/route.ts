import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { anthropic, COACH_MODEL, COACH_MAX_TOKENS, COACH_HISTORY_LIMIT, COACH_DAILY_LIMIT } from '@/lib/anthropic'
import { queryRAGChunks, formatRAGContext } from '@/lib/rag'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversationId, message, courseSlug, weekNumber } = await req.json()
  if (!conversationId || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'conversationId and message required' }, { status: 400 })
  }

  // Verify conversation belongs to this user via enrollment
  const { data: conversation } = await supabase
    .from('coach_conversations')
    .select('id, enrollment_id')
    .eq('id', conversationId)
    .single()

  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', conversation.enrollment_id)
    .single()

  if (!enrollment || enrollment.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check daily message limit
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('coach_messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .eq('role', 'user')
    .gte('created_at', todayStart.toISOString())

  if ((count ?? 0) >= COACH_DAILY_LIMIT) {
    return NextResponse.json({ error: 'Daily message limit reached' }, { status: 429 })
  }

  // Fetch recent history
  const { data: history } = await supabase
    .from('coach_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(COACH_HISTORY_LIMIT)

  const messages = (history ?? []).reverse()

  // RAG retrieval
  let ragContext = ''
  let ragChunkIds: string[] = []
  try {
    const chunks = await queryRAGChunks(message, courseSlug, weekNumber ?? null)
    ragContext = formatRAGContext(chunks)
    ragChunkIds = chunks.map((c) => c.id)
  } catch {
    // RAG failure is non-fatal; proceed without context
  }

  const systemPrompt = `You are the AI Learning Coach for The Robot Age, an online course about robot experience design (RXD).

You help students understand course material, work through deliverables, and apply the RXD framework to real-world robot interactions.

Be encouraging, specific, and pedagogically sound. Ask clarifying questions when helpful. Never write deliverables for students — guide them to their own insights.

${ragContext ? `## Relevant course material:\n\n${ragContext}` : ''}`.trim()

  // Save user message
  await supabase.from('coach_messages').insert({
    conversation_id: conversationId,
    role: 'user',
    content: message,
    rag_chunks_used: [],
  })

  // Stream response from Anthropic
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = ''

      try {
        const anthropicStream = await anthropic.messages.stream({
          model: COACH_MODEL,
          max_tokens: COACH_MAX_TOKENS,
          system: systemPrompt,
          messages: [
            ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
            { role: 'user', content: message },
          ],
        })

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const text = chunk.delta.text
            fullResponse += text
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
          }
        }

        // Save assistant message after streaming completes
        await supabase.from('coach_messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: fullResponse,
          rag_chunks_used: ragChunkIds,
        })

        // Update conversation updated_at
        await supabase
          .from('coach_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Stream error'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

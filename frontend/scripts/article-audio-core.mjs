import crypto from 'node:crypto'
import { marked } from 'marked'

export const MAX_INPUT_LENGTH = 3800 // Leave room below the API's 4096-character limit.
export const AUDIO_MODEL = 'gpt-4o-mini-tts'
export const AUDIO_VOICE = 'marin'
export const AUDIO_INSTRUCTIONS = 'Narrate this journalism clearly and naturally. Use a measured, neutral editorial tone. Do not add or change any words.'

export function sourceHash(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex')
}

function inlineText(tokens = []) {
  return tokens.map((token) => {
    if (token.type === 'image' || token.type === 'html') return ''
    if (token.tokens) return inlineText(token.tokens)
    if (token.type === 'br') return ' '
    return token.text ?? ''
  }).join('')
}

function blockText(tokens) {
  const blocks = []
  for (const token of tokens) {
    if (token.type === 'heading' || token.type === 'paragraph' || token.type === 'text') {
      const value = inlineText(token.tokens ?? [token]).replace(/\s+/g, ' ').trim()
      if (value && !/^(Header and card images|Image credit|Photo credit):/i.test(value)) blocks.push(value)
    } else if (token.type === 'list') {
      for (const item of token.items) blocks.push(...blockText(item.tokens))
    } else if (token.type === 'blockquote') {
      blocks.push(...blockText(token.tokens))
    }
  }
  return blocks
}

export function narrationBlocks(title, markdown) {
  return [title.trim(), ...blockText(marked.lexer(markdown))]
}

function splitLongBlock(block, maxLength) {
  if (block.length <= maxLength) return [block]
  const sentences = block.match(/[^.!?]+[.!?]+(?:["'”’])?|[^.!?]+$/g) ?? [block]
  const parts = []
  let current = ''
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/)
    for (const word of words) {
      if (word.length > maxLength) throw new Error('A word exceeds the speech input limit')
      if (current && current.length + word.length + 1 > maxLength) {
        parts.push(current)
        current = ''
      }
      current += current ? ` ${word}` : word
    }
  }
  if (current) parts.push(current)
  return parts
}

export function narrationChunks(blocks, maxLength = MAX_INPUT_LENGTH) {
  const chunks = []
  let current = ''
  for (const block of blocks.flatMap((value) => splitLongBlock(value, maxLength))) {
    if (current && current.length + block.length + 2 > maxLength) {
      chunks.push(current)
      current = ''
    }
    current += current ? `\n\n${block}` : block
  }
  if (current) chunks.push(current)
  return chunks
}

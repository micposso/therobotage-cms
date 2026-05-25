'use client'

import { useState, useCallback } from 'react'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useWordCount } from '@/hooks/useWordCount'
import { FileUpload } from '@/components/FileUpload/FileUpload'
import { FileList } from '@/components/FileList/FileList'
import type { Submission, SubmissionFile, WeekContent } from '@/types'
import styles from './SubmissionEditor.module.css'

interface SubmissionEditorProps {
  submission: Submission
  weekContent: WeekContent
  files: SubmissionFile[]
  onSubmitted: (s: Submission) => void
}

export function SubmissionEditor({ submission, weekContent, files: initialFiles, onSubmitted }: SubmissionEditorProps) {
  const [draft, setDraft] = useState(submission.draft ?? '')
  const [files, setFiles] = useState<SubmissionFile[]>(initialFiles)
  const [savedAt, setSavedAt] = useState<string | null>(submission.draft_saved_at)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wordCount = useWordCount(draft)
  const { flush } = useAutoSave(submission.id, draft, setSavedAt)

  const editable = submission.status === 'draft' || submission.status === 'revision_requested'
  const minWords = weekContent.deliverable_word_min ?? 0
  const maxWords = weekContent.deliverable_word_max ?? Infinity
  const withinWordLimit = wordCount >= minWords && wordCount <= maxWords

  const handleSubmit = useCallback(async () => {
    if (!withinWordLimit || submitting) return
    setSubmitting(true)
    setError(null)
    await flush()
    const res = await fetch(`/api/submissions/${submission.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: draft }),
    })
    if (res.ok) {
      onSubmitted(await res.json())
    } else {
      const data = await res.json()
      setError(data.error ?? 'Submission failed')
    }
    setSubmitting(false)
  }, [draft, submission.id, flush, withinWordLimit, submitting, onSubmitted])

  const handleFileUploaded = useCallback((file: SubmissionFile) => {
    setFiles((prev) => [...prev, file])
  }, [])

  const handleFileDeleted = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  return (
    <div className={styles.editor}>
      <div className={styles.prompt}>
        <p>{weekContent.deliverable_prompt}</p>
      </div>

      <textarea
        className={styles.textarea}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={!editable}
        placeholder="Write your response here."
        rows={20}
      />

      <div className={styles.meta}>
        <span className={`${styles.wordCount} ${!withinWordLimit && wordCount > 0 ? styles.wordCountError : ''}`}>
          {wordCount} words
          {minWords > 0 && ` (min ${minWords}`}
          {maxWords < Infinity && `–${maxWords}`}
          {minWords > 0 && ')'}
        </span>
        {savedAt && (
          <span className={styles.savedAt}>
            Saved {new Date(savedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
        )}
      </div>

      {weekContent.deliverable_accepts_files && (
        <div className={styles.files}>
          <FileList
            files={files}
            submissionId={submission.id}
            editable={editable}
            onDeleted={handleFileDeleted}
          />
          {editable && (
            <FileUpload
              submissionId={submission.id}
              acceptedTypes={weekContent.deliverable_file_types}
              maxSizeMb={weekContent.deliverable_max_file_size_mb}
              onUploaded={handleFileUploaded}
            />
          )}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {editable && (
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!withinWordLimit || submitting}
          type="button"
        >
          {submitting ? 'Submitting…' : 'Submit deliverable'}
        </button>
      )}
    </div>
  )
}

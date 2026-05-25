'use client'

import { useState } from 'react'
import type { SubmissionFile } from '@/types'
import styles from './FileList.module.css'

interface FileListProps {
  files: SubmissionFile[]
  submissionId: string
  editable: boolean
  onDeleted: (fileId: string) => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileList({ files, submissionId, editable, onDeleted }: FileListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  if (files.length === 0) return null

  async function handleDelete(fileId: string) {
    setDeleting(fileId)
    const res = await fetch(`/api/submissions/${submissionId}/files?fileId=${fileId}`, {
      method: 'DELETE',
    })
    if (res.ok) onDeleted(fileId)
    setDeleting(null)
  }

  return (
    <ul className={styles.list}>
      {files.map((file) => (
        <li key={file.id} className={styles.item}>
          <span className={styles.name}>{file.file_name}</span>
          <span className={styles.size}>{formatBytes(file.file_size)}</span>
          {editable && (
            <button
              type="button"
              className={styles.remove}
              onClick={() => handleDelete(file.id)}
              disabled={deleting === file.id}
            >
              {deleting === file.id ? '…' : 'Remove'}
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

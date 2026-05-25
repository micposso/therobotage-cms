'use client'

import { useRef, useState } from 'react'
import type { SubmissionFile } from '@/types'
import styles from './FileUpload.module.css'

interface FileUploadProps {
  submissionId: string
  acceptedTypes: string[]
  maxSizeMb: number
  onUploaded: (file: SubmissionFile) => void
}

export function FileUpload({ submissionId, acceptedTypes, maxSizeMb, onUploaded }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File must be under ${maxSizeMb}MB`)
      return
    }

    setError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`/api/submissions/${submissionId}/files`, {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      onUploaded(await res.json())
    } else {
      const data = await res.json()
      setError(data.error ?? 'Upload failed')
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        type="file"
        className={styles.input}
        accept={acceptedTypes.join(',')}
        onChange={handleChange}
        disabled={uploading}
        id="file-upload"
      />
      <label htmlFor="file-upload" className={`${styles.label} ${uploading ? styles.uploading : ''}`}>
        {uploading ? 'Uploading…' : 'Attach file'}
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}

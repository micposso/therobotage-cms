'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Submission } from '@/types'

export function useSubmissionUpdates(
  submissionId: string | null,
  onUpdate: (submission: Submission) => void
) {
  const handleUpdate = useCallback(onUpdate, [onUpdate])

  useEffect(() => {
    if (!submissionId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`submission:${submissionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'submissions',
          filter: `id=eq.${submissionId}`,
        },
        (payload) => {
          handleUpdate(payload.new as Submission)
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [submissionId, handleUpdate])
}

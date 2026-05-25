export function computeDueDate(
  weekStartDates: string[],
  weekNumber: number
): Date | null {
  if (weekNumber === 1) return null

  if (weekNumber < weekStartDates.length) {
    // Due the day before the next week opens (23:59:59 ET)
    const nextWeekStart = new Date(weekStartDates[weekNumber]) // 0-indexed: index = weekNumber
    nextWeekStart.setDate(nextWeekStart.getDate() - 1)
    nextWeekStart.setHours(23, 59, 59, 999)
    return nextWeekStart
  }

  // Capstone (final week): due 14 days after it opens
  const capstoneDue = new Date(weekStartDates[weekNumber - 1])
  capstoneDue.setDate(capstoneDue.getDate() + 14)
  capstoneDue.setHours(23, 59, 59, 999)
  return capstoneDue
}

export function isLate(dueDate: string | null, submittedAt: string): boolean {
  if (!dueDate) return false
  return new Date(submittedAt) > new Date(dueDate)
}

export function hoursUntil(dueDate: string): number {
  return (new Date(dueDate).getTime() - Date.now()) / 3_600_000
}

export function formatDueDate(dueDate: string): string {
  return new Date(dueDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

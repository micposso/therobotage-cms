import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { FootageViewer } from '@/components/FootageViewer/FootageViewer'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string; n: string }> }

export const metadata: Metadata = { title: 'Robot Footage' }

export default async function FootagePage({ params }: Props) {
  const { slug, n } = await params
  const weekNumber = parseInt(n, 10)
  if (isNaN(weekNumber)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_slug', slug)
    .eq('status', 'active')
    .single()

  if (!enrollment) redirect('/dashboard')

  const { data: footages } = await supabase
    .from('robot_footage')
    .select('*')
    .eq('enrollment_id', enrollment.id)
    .eq('week_number', weekNumber)

  if (!footages || footages.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Footage not yet available</h1>
        <p className={styles.note}>Your robot session footage will appear here once uploaded by the instructor.</p>
      </div>
    )
  }

  // Get signed URLs for each footage item
  const footagesWithUrls = await Promise.all(
    footages.map(async (footage) => {
      const { data } = await supabase.storage
        .from('footage')
        .createSignedUrl(footage.video_storage_path, 3600)
      return { footage, videoUrl: data?.signedUrl ?? '' }
    })
  )

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Week {weekNumber} robot footage</h1>
      <div className={styles.videos}>
        {footagesWithUrls.map(({ footage, videoUrl }) => (
          <FootageViewer
            key={footage.id}
            footage={footage}
            videoUrl={videoUrl}
          />
        ))}
      </div>
    </div>
  )
}

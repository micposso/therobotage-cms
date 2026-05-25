import type { Credential } from '@/types'
import styles from './CredentialCard.module.css'

interface CredentialCardProps {
  credential: Credential
}

export function CredentialCard({ credential }: CredentialCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.courseSlug}>{credential.course_slug.toUpperCase()}</span>
        {credential.is_founding && <span className={styles.founding}>Founding cohort</span>}
      </div>
      <p className={styles.label}>Robot Experience Professional</p>
      <p className={styles.issued}>
        Issued {new Date(credential.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
      <div className={styles.links}>
        {credential.credential_net_public_url && (
          <a href={credential.credential_net_public_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            View credential
          </a>
        )}
        {credential.credential_net_badge_url && (
          <a href={credential.credential_net_badge_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Download badge
          </a>
        )}
      </div>
    </div>
  )
}

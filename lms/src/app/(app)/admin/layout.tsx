import Link from 'next/link'
import styles from './layout.module.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <p className={styles.navLabel}>Admin</p>
        <Link href="/admin/submissions" className={styles.navLink}>Submissions</Link>
        <Link href="/admin/cohorts" className={styles.navLink}>Cohorts</Link>
        <Link href="/admin/students" className={styles.navLink}>Students</Link>
        <Link href="/admin/footage" className={styles.navLink}>Footage</Link>
        <Link href="/admin/credentials" className={styles.navLink}>Credentials</Link>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

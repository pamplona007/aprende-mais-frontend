import { Link, useParams } from 'react-router'
import { getUserById } from '../mocks'
import styles from './StudentDashboard.module.css'

// Placeholder while the student dashboard is built. Kept lightweight on purpose:
// students can see their name + a clear link back to login.
export function StudentDashboard() {
  const { studentId } = useParams<{ studentId: string }>()
  const student = studentId ? getUserById(studentId) : undefined

  if (!student) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Student not found</div>
        <Link to="/" className="btn btn--primary">
          Go home
        </Link>
      </div>
    )
  }

  return (
    <div className="stack stack--lg">
      <section className="page-header">
        <div className="page-header__crumbs">
          <Link to="/">Home</Link> · Student area
        </div>
        <h1 className={styles.hello}>
          Hi, {student.displayName.split(' ')[0]} 👋
        </h1>
        <p>This is where your lessons and teacher invites will live.</p>
      </section>

      <div className="empty-state">
        <div className="empty-state__title">Student dashboard coming soon</div>
        <p>
          The teacher area is fully wired; the student side (accepting invites, doing lessons,
          seeing progress) is on the way.
        </p>
      </div>
    </div>
  )
}

import { Link, useParams } from 'react-router'
import { getUserById } from '../mocks'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { Stack } from '../components/Stack'
import styles from './StudentDashboard.module.css'

// Placeholder while the student dashboard is built. Kept lightweight on purpose:
// students can see their name + a clear link back to login.
export function StudentDashboard() {
  const { studentId } = useParams<{ studentId: string }>()
  const student = studentId ? getUserById(studentId) : undefined

  if (!student) {
    return (
      <Stack gap="md">
        <EmptyState
          title="Student not found"
          action={
            <Button to="/" variant="ghost">
              Go home
            </Button>
          }
        />
      </Stack>
    )
  }

  return (
    <Stack gap="lg">
      <section className="page-header">
        <div className="page-header__crumbs">
          <Link to="/">Home</Link> · Student area
        </div>
        <h1 className={styles.hello}>Hi, {student.displayName.split(' ')[0]} 👋</h1>
        <p>This is where your lessons and teacher invites will live.</p>
      </section>

      <EmptyState
        title="Student dashboard coming soon"
        action={
          <Link to="/" className="muted">
            ← Back to home
          </Link>
        }
      >
        The teacher area is fully wired; the student side (accepting invites, doing lessons,
        seeing progress) is on the way.
      </EmptyState>
    </Stack>
  )
}

import { Link, useNavigate, useParams } from 'react-router'
import { getProfileByStudentId, getRelationshipsForTeacher, getUserById } from '../mocks'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Row } from '../components/Row'
import { Stack } from '../components/Stack'
import { StatusPill } from '../components/StatusPill'
import styles from './StudentProfilePage.module.css'

// Frozen at module load so age is stable across re-renders and oxlint stays happy.
// (A real app would refresh this periodically or use an animated age counter.)
const MODULE_NOW = Date.now()

export function StudentProfilePage() {
  const { teacherId, studentId } = useParams<{ teacherId: string; studentId: string }>()
  const navigate = useNavigate()

  const teacher = teacherId ? getUserById(teacherId) : undefined
  const student = studentId ? getUserById(studentId) : undefined
  const profile = studentId ? getProfileByStudentId(studentId) : undefined

  const relationship = teacherId && studentId
    ? getRelationshipsForTeacher(teacherId).find((r) => r.studentId === studentId)
    : undefined

  if (!teacher || !student) {
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

  const ageYears = student.birthDate
    ? Math.floor((MODULE_NOW - new Date(student.birthDate).getTime()) / (365.25 * 86_400_000))
    : null

  return (
    <Stack gap="lg">
      <section className="page-header">
        <div className="page-header__crumbs">
          <Link to="/">Home</Link> ·{' '}
          <Link to={`/teacher/${teacher.id}`}>{teacher.displayName}</Link> · {student.displayName}
        </div>
        <div className={styles.profileHeader}>
          <Avatar user={student} size="lg" />
          <div className={styles.profileMeta}>
            <h1 style={{ margin: 0 }}>{student.displayName}</h1>
            <p className="muted" style={{ margin: 0 }}>
              {student.email}
              {ageYears !== null && ` · ${ageYears} years old`}
            </p>
          </div>
          {relationship && (
            <div className={styles.statusWrap}>
              <StatusPill status={relationship.status} />
            </div>
          )}
        </div>
      </section>

      <Stack gap="md">
        <h2>Learning profile</h2>
        <div className={styles.cardsRow}>
          <Card title="Level">
            <div className={styles.bigNumber}>{profile?.learningLevel ?? '—'}</div>
            <p className="muted tiny" style={{ margin: 0 }}>
              Higher = more advanced
            </p>
          </Card>
          <Card title="Accessibility">
            {profile && Object.keys(profile.accessibility).length > 0 ? (
              <KeyValueList data={profile.accessibility} />
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                None set
              </p>
            )}
          </Card>
          <Card title="Preferences">
            {profile && Object.keys(profile.preferences).length > 0 ? (
              <KeyValueList data={profile.preferences} />
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                None set
              </p>
            )}
          </Card>
        </div>
      </Stack>

      {profile?.notes && (
        <Card variant="muted" title="Teacher notes">
          <p style={{ margin: 0 }}>{profile.notes}</p>
        </Card>
      )}

      {relationship && (
        <Card title="Relationship">
          <Stack gap="md">
            <div className={styles.relMeta}>
              <StatusPill status={relationship.status} />
              <span className="muted tiny">Invited {formatDate(relationship.invitedAt)}</span>
              {relationship.respondedAt && (
                <span className="muted tiny">· Responded {formatDate(relationship.respondedAt)}</span>
              )}
              {relationship.revokedAt && (
                <span className="muted tiny">· Ended {formatDate(relationship.revokedAt)}</span>
              )}
            </div>
            {relationship.message && (
              <div className={styles.relMessage}>Invite message: “{relationship.message}”</div>
            )}
            <Row>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/${teacher.id}`)}>
                ← Back to dashboard
              </Button>
            </Row>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}

function KeyValueList({ data }: { data: Record<string, unknown> }) {
  return (
    <ul className={styles.kvList}>
      {Object.entries(data).map(([k, v]) => (
        <li key={k} className={styles.kvRow}>
          <span className="muted tiny">{prettifyKey(k)}</span>
          <strong>{String(v)}</strong>
        </li>
      ))}
    </ul>
  )
}

function prettifyKey(k: string): string {
  return k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString()
}

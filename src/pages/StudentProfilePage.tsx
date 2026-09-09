import { Link, useNavigate, useParams } from 'react-router'
import { getProfileByStudentId, getRelationshipsForTeacher, getUserById } from '../mocks'
import { Avatar } from '../components/Avatar'
import { StatusPill } from '../components/StatusPill'

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
      <div className="empty-state">
        <div className="empty-state__title">Student not found</div>
        <Link to="/" className="btn btn--primary">
          Go home
        </Link>
      </div>
    )
  }

  // `Date.now()` is impure per oxlint's purity rules. We capture it at module
  // load (which is good enough for displaying a birth-year-derived age).
  const NOW = MODULE_NOW
  const ageYears = student.birthDate
    ? Math.floor((NOW - new Date(student.birthDate).getTime()) / (365.25 * 86_400_000))
    : null

  return (
    <div className="stack stack--lg">
      <section className="page-header">
        <div className="page-header__crumbs">
          <Link to="/">Home</Link> ·{' '}
          <Link to={`/teacher/${teacher.id}`}>{teacher.displayName}</Link> · {student.displayName}
        </div>
        <div className="row">
          <Avatar user={student} size="lg" />
          <div>
            <h1 style={{ margin: 0 }}>{student.displayName}</h1>
            <p className="muted" style={{ margin: 0 }}>
              {student.email}
              {ageYears !== null && ` · ${ageYears} years old`}
            </p>
          </div>
          {relationship && (
            <div style={{ marginLeft: 'auto' }}>
              <StatusPill status={relationship.status} />
            </div>
          )}
        </div>
      </section>

      <section className="stack">
        <h2>Learning profile</h2>
        <div className="grid-cards">
          <div className="card">
            <div className="card__title">Level</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {profile?.learningLevel ?? '—'}
            </div>
            <p className="muted tiny" style={{ margin: 0 }}>
              Higher = more advanced
            </p>
          </div>
          <div className="card">
            <div className="card__title">Accessibility</div>
            {profile && Object.keys(profile.accessibility).length > 0 ? (
              <KeyValueList data={profile.accessibility} />
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                None set
              </p>
            )}
          </div>
          <div className="card">
            <div className="card__title">Preferences</div>
            {profile && Object.keys(profile.preferences).length > 0 ? (
              <KeyValueList data={profile.preferences} />
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                None set
              </p>
            )}
          </div>
        </div>
      </section>

      {profile?.notes && (
        <section className="card card--muted">
          <div className="card__title">Teacher notes</div>
          <p style={{ margin: 0 }}>{profile.notes}</p>
        </section>
      )}

      {relationship && (
        <section className="card">
          <div className="card__title">Relationship</div>
          <div className="stack">
            <div className="row">
              <StatusPill status={relationship.status} />
              <span className="muted tiny">Invited {formatDate(relationship.invitedAt)}</span>
              {relationship.respondedAt && (
                <span className="muted tiny">
                  · Responded {formatDate(relationship.respondedAt)}
                </span>
              )}
              {relationship.revokedAt && (
                <span className="muted tiny">· Ended {formatDate(relationship.revokedAt)}</span>
              )}
            </div>
            {relationship.message && (
              <div className="callout">Invite message: “{relationship.message}”</div>
            )}
            <div className="row">
              <button
                className="btn btn--ghost btn--small"
                onClick={() => navigate(`/teacher/${teacher.id}`)}
              >
                ← Back to dashboard
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function KeyValueList({ data }: { data: Record<string, unknown> }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="stack">
      {Object.entries(data).map(([k, v]) => (
        <li key={k} className="row row--between">
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

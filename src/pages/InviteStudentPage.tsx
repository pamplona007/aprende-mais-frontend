import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getRelationshipsForTeacher, getUserById, searchStudents } from '../mocks'
import { Avatar } from '../components/Avatar'

export function InviteStudentPage() {
  const { teacherId } = useParams<{ teacherId: string }>()
  const navigate = useNavigate()
  const teacher = teacherId ? getUserById(teacherId) : undefined
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  // Students the teacher is NOT already in an open relationship with.
  const alreadyOpenIds = useMemo(() => {
    if (!teacherId) return new Set<string>()
    return new Set(
      getRelationshipsForTeacher(teacherId)
        .filter((r) => r.status === 'PENDING' || r.status === 'ACCEPTED')
        .map((r) => r.studentId),
    )
  }, [teacherId])

  const candidates = useMemo(() => {
    return searchStudents(query).filter((s) => !alreadyOpenIds.has(s.id))
  }, [query, alreadyOpenIds])

  const selected = selectedId ? getUserById(selectedId) : undefined

  if (!teacher) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Teacher not found</div>
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
          <Link to="/">Home</Link> ·{' '}
          <Link to={`/teacher/${teacher.id}`}>{teacher.displayName}</Link> · Invite a student
        </div>
        <h1>Invite a student</h1>
        <p>Search for a student by name or email, then send them an invite.</p>
      </section>

      <section className="stack">
        <div className="field">
          <label className="field__label" htmlFor="search">
            Find student
          </label>
          <input
            id="search"
            className="field__input"
            placeholder="Type a name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="stack">
          {candidates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__title">No matching students</div>
              <p className="muted">
                Either nobody matches your search, or every matching student already has an open
                relationship with you.
              </p>
            </div>
          ) : (
            candidates.map((s) => (
              <button
                key={s.id}
                type="button"
                className="student-card"
                onClick={() => setSelectedId(s.id)}
                style={{
                  borderColor:
                    selectedId === s.id ? 'var(--color-primary)' : 'var(--color-border)',
                  boxShadow:
                    selectedId === s.id ? '0 0 0 3px var(--color-primary-soft)' : 'var(--shadow-sm)',
                }}
              >
                <div className="row">
                  <Avatar user={s} />
                  <div>
                    <div className="student-card__name">{s.displayName}</div>
                    <div className="student-card__meta">{s.email}</div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {selected && (
        <section className="card">
          <div className="card__title">Send invite to {selected.displayName}</div>
          <div className="field">
            <label className="field__label" htmlFor="message">
              Message (optional)
            </label>
            <textarea
              id="message"
              className="field__textarea"
              placeholder="Say hi and explain how you'd like to help…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="row">
            <button
              className="btn btn--primary"
              onClick={() => {
                // Wired to the real API in a follow-up; for now this just navigates back.
                // See src/api/teaching.ts → sendInvite().
                alert(
                  `Invite sent to ${selected.displayName}${
                    message ? ` with message: “${message}”` : ''
                  } (mock)`,
                )
                navigate(`/teacher/${teacher.id}`)
              }}
            >
              Send invite
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => {
                setSelectedId(null)
                setMessage('')
              }}
            >
              Cancel
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

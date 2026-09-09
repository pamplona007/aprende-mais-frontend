import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getRelationshipsForTeacher, getUserById, searchStudents } from '../mocks'
import { StudentCard } from '../components/StudentCard'
import styles from './InviteStudentPage.module.css'

export function InviteStudentPage() {
  const { teacherId } = useParams<{ teacherId: string }>()
  const navigate = useNavigate()
  const teacher = teacherId ? getUserById(teacherId) : undefined
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

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
            className={styles.searchInput}
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
              <StudentCard
                key={s.id}
                user={s}
                selected={selectedId === s.id}
                onClick={() => setSelectedId(s.id)}
              />
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
              className={`field__textarea ${styles.textarea}`}
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

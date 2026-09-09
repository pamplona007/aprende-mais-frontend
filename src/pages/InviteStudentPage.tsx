import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getRelationshipsForTeacher, getUserById, searchStudents } from '../mocks'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Field } from '../components/Field'
import { Row } from '../components/Row'
import { Stack } from '../components/Stack'
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
      <Stack gap="md">
        <EmptyState
          title="Teacher not found"
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
          <Link to="/">Home</Link> ·{' '}
          <Link to={`/teacher/${teacher.id}`}>{teacher.displayName}</Link> · Invite a student
        </div>
        <h1>Invite a student</h1>
        <p>Search for a student by name or email, then send them an invite.</p>
      </section>

      <Stack gap="md">
        <Field
          label="Find student"
          inputProps={{
            id: 'search',
            placeholder: 'Type a name or email…',
            value: query,
            onChange: (e) => setQuery(e.target.value),
            autoFocus: true,
          }}
        />

        <Stack gap="md">
          {candidates.length === 0 ? (
            <EmptyState title="No matching students">
              Either nobody matches your search, or every matching student already has an open
              relationship with you.
            </EmptyState>
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
        </Stack>
      </Stack>

      {selected && (
        <Card title={`Send invite to ${selected.displayName}`}>
          <Field
            as="textarea"
            label="Message (optional)"
            inputProps={{
              id: 'message',
              placeholder: "Say hi and explain how you'd like to help…",
              value: message,
              onChange: (e) => setMessage(e.target.value),
              className: styles.textarea,
            }}
          />
          <Row>
            <Button
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
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedId(null)
                setMessage('')
              }}
            >
              Cancel
            </Button>
          </Row>
        </Card>
      )}
    </Stack>
  )
}

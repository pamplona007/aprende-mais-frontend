import { Link, useNavigate, useParams } from 'react-router'
import { useMemo, useState } from 'react'
import { getRelationshipsForTeacher, getUserById } from '../mocks'
import type { TeachingRelationship } from '../types'
import { StatusPill } from '../components/StatusPill'
import { Avatar } from '../components/Avatar'
import { StudentCard } from '../components/StudentCard'
import styles from './TeacherDashboard.module.css'

type TabKey = 'ACTIVE' | 'PENDING' | 'PAST'

const TAB_DEFS: { key: TabKey; label: string }[] = [
  { key: 'ACTIVE', label: 'Active' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'PAST', label: 'Past' },
]

const PAST_STATUSES = ['DECLINED', 'REVOKED_BY_TEACHER', 'REVOKED_BY_STUDENT'] as const
type PastStatus = (typeof PAST_STATUSES)[number]

const PAST_REASON: Record<PastStatus, string> = {
  DECLINED: 'student declined the invite',
  REVOKED_BY_TEACHER: 'you withdrew',
  REVOKED_BY_STUDENT: 'student revoked',
}

function classify(rel: TeachingRelationship): TabKey {
  if (rel.status === 'ACCEPTED') return 'ACTIVE'
  if (rel.status === 'PENDING') return 'PENDING'
  return 'PAST'
}

export function TeacherDashboard() {
  const { teacherId } = useParams<{ teacherId: string }>()
  const navigate = useNavigate()
  const teacher = teacherId ? getUserById(teacherId) : undefined
  const [tab, setTab] = useState<TabKey>('ACTIVE')

  const grouped = useMemo(() => {
    if (!teacherId) return { ACTIVE: [], PENDING: [], PAST: [] }
    const all = getRelationshipsForTeacher(teacherId)
    return {
      ACTIVE: all.filter((r) => classify(r) === 'ACTIVE'),
      PENDING: all.filter((r) => classify(r) === 'PENDING'),
      PAST: all.filter((r) => classify(r) === 'PAST'),
    }
  }, [teacherId])

  if (!teacher) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Teacher not found</div>
        <p>Pick a teacher from the home page.</p>
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
          <Link to="/">Home</Link> · Teacher area
        </div>
        <div className="row row--between">
          <div className="row">
            <Avatar user={teacher} size="lg" />
            <div>
              <h1 style={{ margin: 0 }}>{teacher.displayName}</h1>
              <p className="muted" style={{ margin: 0 }}>
                {teacher.email}
              </p>
            </div>
          </div>
          <button
            className="btn btn--primary"
            onClick={() => navigate(`/teacher/${teacher.id}/invite`)}
          >
            + Invite a student
          </button>
        </div>
      </section>

      <nav className={styles.tabs} role="tablist">
        {TAB_DEFS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className={styles.tabCount}>({grouped[t.key].length})</span>
          </button>
        ))}
      </nav>

      {tab === 'ACTIVE' && <ActiveGrid rows={grouped.ACTIVE} teacherId={teacher.id} />}
      {tab === 'PENDING' && <PendingGrid rows={grouped.PENDING} teacherId={teacher.id} />}
      {tab === 'PAST' && <PastList rows={grouped.PAST} teacherId={teacher.id} />}
    </div>
  )
}

function ActiveGrid({ rows, teacherId }: { rows: TeachingRelationship[]; teacherId: string }) {
  return (
    <Grid
      rows={rows}
      teacherId={teacherId}
      emptyTitle="No active students yet"
      emptyBody="Once a student accepts your invite, they will appear here."
      showMessage
    />
  )
}

function PendingGrid({ rows, teacherId }: { rows: TeachingRelationship[]; teacherId: string }) {
  return (
    <Grid
      rows={rows}
      teacherId={teacherId}
      emptyTitle="No pending invites"
      emptyBody="Send an invite to bring a student on board."
      showMessage
      pending
    />
  )
}

function Grid({
  rows,
  teacherId,
  emptyTitle,
  emptyBody,
  showMessage,
  pending,
}: {
  rows: TeachingRelationship[]
  teacherId: string
  emptyTitle: string
  emptyBody: string
  showMessage: boolean
  pending?: boolean
}) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">{emptyTitle}</div>
        <p>{emptyBody}</p>
      </div>
    )
  }
  return (
    <div className={styles.grid}>
      {rows.map((rel) => {
        const student = getUserById(rel.studentId)
        if (!student) return null
        return (
          <StudentCard
            key={rel.id}
            user={student}
            href={`/teacher/${teacherId}/students/${student.id}`}
            bottom={
              <>
                <div className={styles.statusRow}>
                  <StatusPill status={rel.status} />
                  <span className="muted tiny">
                    {pending
                      ? `Invited ${formatRelative(rel.invitedAt)}`
                      : `Active since ${formatRelative(rel.respondedAt ?? rel.invitedAt)}`}
                  </span>
                </div>
                {showMessage && rel.message && (
                  <div className={styles.relMessage}>{rel.message}</div>
                )}
              </>
            }
            footer={<span className="btn btn--ghost btn--small">View profile →</span>}
          />
        )
      })}
    </div>
  )
}

function PastList({
  rows,
  teacherId,
}: {
  rows: TeachingRelationship[]
  teacherId: string
}) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">No past relationships yet</div>
        <p>Declined or revoked relationships will appear here.</p>
      </div>
    )
  }
  return (
    <div className="stack">
      {rows.map((rel) => {
        const student = getUserById(rel.studentId)
        if (!student) return null
        if (rel.status === 'PENDING' || rel.status === 'ACCEPTED') return null
        const reason = PAST_REASON[rel.status as PastStatus]
        return (
          <div key={rel.id} className={styles.pastCard}>
            <div className={styles.pastRow}>
              <div className="row">
                <Avatar user={student} size="sm" />
                <div>
                  <Link to={`/teacher/${teacherId}/students/${student.id}`} style={{ color: 'inherit' }}>
                    <strong>{student.displayName}</strong>
                  </Link>
                  <div className="muted tiny">{student.email}</div>
                </div>
              </div>
              <div className="row">
                <StatusPill status={rel.status} />
                <span className={styles.pastReason}>{reason}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const days = Math.round(ms / 86_400_000)
  if (days < 1) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.round(months / 12)
  return `${years}y ago`
}

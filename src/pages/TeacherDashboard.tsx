import { Link, useNavigate, useParams } from 'react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRelationshipsForTeacher, getUserById } from '../mocks'
import type { TeachingRelationship } from '../types'
import { StatusPill } from '../components/StatusPill'
import { Avatar } from '../components/Avatar'
import { StudentCard } from '../components/StudentCard'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { GridCards } from '../components/GridCards'
import { Row } from '../components/Row'
import { Stack } from '../components/Stack'
import styles from './TeacherDashboard.module.css'

type TabKey = 'ACTIVE' | 'PENDING' | 'PAST'

const TAB_DEFS: { key: TabKey; labelKey: string }[] = [
  { key: 'ACTIVE', labelKey: 'active' },
  { key: 'PENDING', labelKey: 'pending' },
  { key: 'PAST', labelKey: 'past' },
]

const PAST_STATUSES = ['DECLINED', 'REVOKED_BY_TEACHER', 'REVOKED_BY_STUDENT'] as const
type PastStatus = (typeof PAST_STATUSES)[number]

function classify(rel: TeachingRelationship): TabKey {
  if (rel.status === 'ACCEPTED') return 'ACTIVE'
  if (rel.status === 'PENDING') return 'PENDING'
  return 'PAST'
}

export function TeacherDashboard() {
  const { t } = useTranslation()
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
      <Stack gap="md">
        <EmptyState
          title={t('teacherDashboard.teacherNotFound')}
          action={
            <Button to="/" variant="ghost">
              {t('teacherDashboard.goHome')}
            </Button>
          }
        >
          {t('teacherDashboard.pickAnother')}
        </EmptyState>
      </Stack>
    )
  }

  return (
    <Stack gap="lg">
      <section className="page-header">
        <div className="page-header__crumbs">
          <Link to="/">{t('teacherDashboard.crumbsHome')}</Link> ·{' '}
          {t('teacherDashboard.crumbsArea')}
        </div>
        <Row justify="between">
          <Row>
            <Avatar user={teacher} size="lg" />
            <div>
              <h1 style={{ margin: 0 }}>{teacher.displayName}</h1>
              <p className="muted" style={{ margin: 0 }}>
                {teacher.email}
              </p>
            </div>
          </Row>
          <Button onClick={() => navigate(`/teacher/${teacher.id}/invite`)}>
            {t('teacherDashboard.inviteStudent')}
          </Button>
        </Row>
      </section>

      <nav className={styles.tabs} role="tablist">
        {TAB_DEFS.map((tDef) => (
          <button
            key={tDef.key}
            role="tab"
            aria-selected={tab === tDef.key}
            className={`${styles.tab} ${tab === tDef.key ? styles.tabActive : ''}`}
            onClick={() => setTab(tDef.key)}
          >
            {t(`teacherDashboard.tabs.${tDef.labelKey}`)}
            <span className={styles.tabCount}>({grouped[tDef.key].length})</span>
          </button>
        ))}
      </nav>

      {tab === 'ACTIVE' && <RelationshipGrid rows={grouped.ACTIVE} teacherId={teacher.id} />}
      {tab === 'PENDING' && <RelationshipGrid rows={grouped.PENDING} teacherId={teacher.id} pending />}
      {tab === 'PAST' && <PastList rows={grouped.PAST} teacherId={teacher.id} />}
    </Stack>
  )
}

function RelationshipGrid({
  rows,
  teacherId,
  pending,
}: {
  rows: TeachingRelationship[]
  teacherId: string
  pending?: boolean
}) {
  const { t } = useTranslation()

  if (rows.length === 0) {
    return (
      <EmptyState
        title={
          pending
            ? t('teacherDashboard.empty.noPending')
            : t('teacherDashboard.empty.noActive')
        }
      >
        {pending
          ? t('teacherDashboard.empty.noPendingBody')
          : t('teacherDashboard.empty.noActiveBody')}
      </EmptyState>
    )
  }
  return (
    <GridCards>
      {rows.map((rel) => {
        const student = getUserById(rel.studentId)
        if (!student) return null
        const meta = pending
          ? t('teacherDashboard.statusMeta.invitedAgo', { time: formatRelative(rel.invitedAt) })
          : t('teacherDashboard.statusMeta.activeSince', {
              time: formatRelative(rel.respondedAt ?? rel.invitedAt),
            })
        return (
          <StudentCard
            key={rel.id}
            user={student}
            href={`/teacher/${teacherId}/students/${student.id}`}
            bottom={
              <>
                <div className={styles.statusRow}>
                  <StatusPill status={rel.status} />
                  <span className="muted tiny">{meta}</span>
                </div>
                {rel.message && <div className={styles.relMessage}>{rel.message}</div>}
              </>
            }
            footer={<span className={styles.viewProfile}>{t('teacherDashboard.viewProfile')}</span>}
          />
        )
      })}
    </GridCards>
  )
}

function PastList({
  rows,
  teacherId,
}: {
  rows: TeachingRelationship[]
  teacherId: string
}) {
  const { t } = useTranslation()

  if (rows.length === 0) {
    return (
      <EmptyState title={t('teacherDashboard.empty.noPast')}>
        {t('teacherDashboard.empty.noPastBody')}
      </EmptyState>
    )
  }
  return (
    <Stack gap="md">
      {rows.map((rel) => {
        const student = getUserById(rel.studentId)
        if (!student) return null
        if (rel.status === 'PENDING' || rel.status === 'ACCEPTED') return null
        const reason = t(`teacherDashboard.pastReasons.${rel.status as PastStatus}`)
        return (
          <Card key={rel.id}>
            <Row justify="between">
              <Row>
                <Avatar user={student} size="sm" />
                <div>
                  <Link to={`/teacher/${teacherId}/students/${student.id}`} style={{ color: 'inherit' }}>
                    <strong>{student.displayName}</strong>
                  </Link>
                  <div className="muted tiny">{student.email}</div>
                </div>
              </Row>
              <Row>
                <StatusPill status={rel.status} />
                <span className={styles.pastReason}>{reason}</span>
              </Row>
            </Row>
          </Card>
        )
      })}
    </Stack>
  )
}

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const days = Math.round(ms / 86_400_000)
  if (days < 1) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 30) return `${days}d`
  const months = Math.round(days / 30)
  if (months < 12) return `${months} meses`
  const years = Math.round(months / 12)
  return `${years} anos`
}

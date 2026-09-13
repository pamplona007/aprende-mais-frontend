import { Link, useNavigate, useParams } from 'react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRelationshipsForTeacher, getUserById } from '../mocks'
import type { TeachingRelationship } from '../types'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { StudentCard } from '../components/StudentCard'
import { GridCards } from '../components/GridCards'
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
            <Button to="/" variant="ghost" aria-label={t('teacherDashboard.goHome')}>
              <Icon name="arrow-left" size={18} />
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
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <Avatar user={teacher} size="lg" />
          <div className={styles.headerText}>
            <div className={styles.headerName}>{teacher.displayName}</div>
            <div className={styles.headerEmail}>{teacher.email}</div>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/teacher/${teacher.id}/invite`)}
          aria-label={t('teacherDashboard.inviteStudent')}
        >
          <Icon name="plus" size={18} />
        </Button>
      </header>

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
            <span className={styles.tabCount}>{grouped[tDef.key].length}</span>
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
                <div className={styles.statusMeta}>{meta}</div>
                {rel.message && <div className={styles.relMessage}>{rel.message}</div>}
              </>
            }
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
            <div className={styles.pastCard}>
              <div className={styles.pastHeader}>
                <Avatar user={student} size="sm" />
                <div className={styles.pastInfo}>
                  <Link
                    to={`/teacher/${teacherId}/students/${student.id}`}
                    style={{ color: 'inherit', fontWeight: 500 }}
                  >
                    {student.displayName}
                  </Link>
                  <div className={styles.pastEmail}>{student.email}</div>
                </div>
              </div>
              <div className={styles.pastReason}>{reason}</div>
            </div>
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
  if (days < 30) return `há ${days}d`
  const months = Math.round(days / 30)
  if (months < 12) return `há ${months} meses`
  const years = Math.round(months / 12)
  return `há ${years} anos`
}

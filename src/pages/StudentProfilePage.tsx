import { Link, useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  getLessonsForStudent,
  getProfileByStudentId,
  getRelationshipsForTeacher,
  getUserById,
} from '../mocks'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Row } from '../components/Row'
import { Stack } from '../components/Stack'
import { StatusPill } from '../components/StatusPill'
import styles from './StudentProfilePage.module.css'

const MODULE_NOW = Date.now()

export function StudentProfilePage() {
  const { t } = useTranslation()
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
          title={t('studentProfile.studentNotFound')}
          action={
            <Button to="/" variant="ghost">
              {t('teacherDashboard.goHome')}
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
          <Link to="/">{t('studentProfile.crumbsHome')}</Link> ·{' '}
          <Link to={`/teacher/${teacher.id}`}>{teacher.displayName}</Link> · {student.displayName}
        </div>
      </section>

      <header className={styles.header}>
        <div className={styles.headerMain}>
          <Avatar user={student} size="lg" />
          <div className={styles.headerText}>
            <div className={styles.headerName}>{student.displayName}</div>
            <div className={styles.headerEmail}>
              {student.email}
              {ageYears !== null && ` · ${ageYears} ${t('studentProfile.yearsOld')}`}
            </div>
          </div>
        </div>
        {relationship && (
          <div className={styles.statusSlot}>
            <StatusPill status={relationship.status} />
          </div>
        )}
      </header>

      <Stack gap="md">
        <h2>{t('studentProfile.sections.learningProfile')}</h2>
        <div className={styles.cardsRow}>
          <Card title={t('studentProfile.cards.level')}>
            <p className={styles.bigNumber}>{profile?.learningLevel ?? '—'}</p>
            <p className="muted tiny" style={{ margin: 0 }}>
              {t('studentProfile.cards.levelHint')}
            </p>
          </Card>
          <Card title={t('studentProfile.cards.accessibility')}>
            {profile && Object.keys(profile.accessibility).length > 0 ? (
              <KeyValueList data={profile.accessibility} />
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                {t('studentProfile.noneSet')}
              </p>
            )}
          </Card>
          <Card title={t('studentProfile.cards.preferences')}>
            {profile && Object.keys(profile.preferences).length > 0 ? (
              <KeyValueList data={profile.preferences} />
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                {t('studentProfile.noneSet')}
              </p>
            )}
          </Card>
        </div>
      </Stack>

      {profile?.notes && (
        <Card variant="muted" title={t('studentProfile.sections.teacherNotes')}>
          <p style={{ margin: 0 }}>{profile.notes}</p>
        </Card>
      )}

      {relationship && (
        <Card title={t('studentProfile.sections.relationship')}>
          <Stack gap="md">
            <div className={styles.relMeta}>
              <StatusPill status={relationship.status} />
              <span>
                {t('studentProfile.relMeta.invited', { date: formatDate(relationship.invitedAt) })}
              </span>
              {relationship.respondedAt && (
                <>
                  <span className={styles.relSep}>·</span>
                  <span>
                    {t('studentProfile.relMeta.responded', {
                      date: formatDate(relationship.respondedAt),
                    })}
                  </span>
                </>
              )}
              {relationship.revokedAt && (
                <>
                  <span className={styles.relSep}>·</span>
                  <span>
                    {t('studentProfile.relMeta.ended', {
                      date: formatDate(relationship.revokedAt),
                    })}
                  </span>
                </>
              )}
            </div>
            {relationship.message && (
              <div className={styles.relMessage}>{relationship.message}</div>
            )}
            <Row>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/${teacher.id}`)}>
                {t('studentProfile.backToDashboard')}
              </Button>
            </Row>
          </Stack>
        </Card>
      )}

      <LessonHistory studentId={student.id} />
    </Stack>
  )
}

function LessonHistory({ studentId }: { studentId: string }) {
  const { t } = useTranslation()
  const lessons = getLessonsForStudent(studentId).filter((l) => l.status === 'COMPLETED')

  return (
    <Card title={t('studentProfile.historyTitle')}>
      {lessons.length === 0 ? (
        <p className={styles.historyEmpty}>{t('studentProfile.historyEmpty')}</p>
      ) : (
        <ul className={styles.historyList}>
          {lessons.map((lesson) => {
            const stars =
              lesson.score >= 100 ? 3 : lesson.score >= 75 ? 2 : lesson.score >= 50 ? 1 : 0
            return (
              <li key={lesson.id} className={styles.historyItem}>
                <div className={styles.historySubject}>
                  <span
                    className={styles.historyDot}
                    style={{ background: lesson.subjectColor }}
                  />
                  <span>{lesson.subjectTitle}</span>
                </div>
                <div className={styles.historyMeta}>
                  {lesson.completedAt && (
                    <span>
                      {t('studentProfile.relMeta.invited', {
                        date: formatDate(lesson.completedAt),
                      }).replace('Convidado(a) em', 'Em')}
                    </span>
                  )}
                  <span>
                    {lesson.totalCount} {lesson.totalCount === 1 ? 'exercício' : 'exercícios'}
                  </span>
                  <span>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          color: i < stars ? '#ffc800' : 'var(--color-neutral-soft)',
                          marginRight: 2,
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </span>
                </div>
                <div className={styles.historyScore}>{lesson.score}%</div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

function KeyValueList({ data }: { data: Record<string, unknown> }) {
  return (
    <ul className={styles.kvList}>
      {Object.entries(data).map(([k, v]) => (
        <li key={k} className={styles.kvRow}>
          <span className={styles.kvKey}>{prettifyKey(k)}</span>
          <span className={styles.kvValue}>{String(v)}</span>
        </li>
      ))}
    </ul>
  )
}

function prettifyKey(k: string): string {
  return k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}

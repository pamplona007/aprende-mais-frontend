import { Link, useParams } from 'react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Translator = (key: string, options?: Record<string, unknown>) => string
import {
  getLessonsForStudent,
  getProfileByStudentId,
  getRelationshipsForTeacher,
  getUserById,
} from '../mocks'
import type { Lesson } from '../types'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { Stack } from '../components/Stack'
import { StatusPill } from '../components/StatusPill'
import {
  EvolutionChart,
  MistakesList,
  SubjectAccuracyChart,
} from '../components/charts'
import styles from './StudentProfilePage.module.css'

const MODULE_NOW = Date.now()

type Tab = 'progress' | 'profile'

export function StudentProfilePage() {
  const { t } = useTranslation()
  const { teacherId, studentId } = useParams<{
    teacherId: string
    studentId: string
  }>()

  const [tab, setTab] = useState<Tab>('progress')

  const teacher = teacherId ? getUserById(teacherId) : undefined
  const student = studentId ? getUserById(studentId) : undefined
  const profile = studentId ? getProfileByStudentId(studentId) : undefined

  const relationship = teacherId && studentId
    ? getRelationshipsForTeacher(teacherId).find((r) => r.studentId === studentId)
    : undefined

  const completedLessons: Lesson[] = useMemo(
    () =>
      studentId
        ? getLessonsForStudent(studentId).filter((l) => l.status === 'COMPLETED')
        : [],
    [studentId],
  )

  if (!teacher || !student) {
    return (
      <Stack gap="md">
        <EmptyState
          title={t('studentProfile.studentNotFound')}
          action={
            <Button to="/" variant="ghost" aria-label={t('teacherDashboard.goHome')}>
              <Icon name="arrow-left" size={18} />
            </Button>
          }
        />
      </Stack>
    )
  }

  return (
    <Stack gap="lg">
      <nav className={styles.crumbs} aria-label="breadcrumb">
        <Link to="/">{t('studentProfile.crumbsHome')}</Link>
        <span className={styles.crumbsSep}>·</span>
        <Link to={`/teacher/${teacher.id}`}>{teacher.displayName}</Link>
        <span className={styles.crumbsSep}>·</span>
        <span>{student.displayName}</span>
      </nav>

      <Hero
        student={student}
        profile={profile}
        relationshipStatus={relationship?.status ?? null}
        completedLessons={completedLessons}
      />

      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'progress'}
          className={`${styles.tab} ${tab === 'progress' ? styles.tabActive : ''}`}
          onClick={() => setTab('progress')}
        >
          {t('studentProfile.tabs.progress')}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'profile'}
          className={`${styles.tab} ${tab === 'profile' ? styles.tabActive : ''}`}
          onClick={() => setTab('profile')}
        >
          {t('studentProfile.tabs.profile')}
        </button>
      </div>

      {tab === 'progress' && (
        <ProgressTab
          completedLessons={completedLessons}
          teacherId={teacher.id}
        />
      )}
      {tab === 'profile' && (
        <ProfileTab profile={profile} relationship={relationship ?? null} />
      )}
    </Stack>
  )
}

interface HeroProps {
  student: NonNullable<ReturnType<typeof getUserById>>
  profile: ReturnType<typeof getProfileByStudentId>
  relationshipStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'REVOKED_BY_TEACHER' | 'REVOKED_BY_STUDENT' | null
  completedLessons: Lesson[]
}

function Hero({ student, profile, relationshipStatus, completedLessons }: HeroProps) {
  const { t } = useTranslation()

  const ageYears = student.birthDate
    ? Math.floor((MODULE_NOW - new Date(student.birthDate).getTime()) / (365.25 * 86_400_000))
    : null

  const kpis = useMemo(() => {
    const lessonCount = completedLessons.length

    const totalStars = completedLessons.reduce((sum, l) => {
      const s = l.score >= 100 ? 3 : l.score >= 75 ? 2 : l.score >= 50 ? 1 : 0
      return sum + s
    }, 0)

    const totalExercises = completedLessons.reduce((sum, l) => sum + l.totalCount, 0)
    const correctExercises = completedLessons.reduce((sum, l) => {
      const firstTryCorrect = l.exercises.filter((e) => e.status === 'CORRECT').length
      return sum + firstTryCorrect
    }, 0)
    const accuracy = totalExercises > 0 ? Math.round((correctExercises / totalExercises) * 100) : null

    const streakDays = computeStreakDays(completedLessons)

    return { lessonCount, totalStars, accuracy, streakDays }
  }, [completedLessons])

  return (
    <section className={styles.hero}>
      <div className={styles.heroAvatar}>
        <Avatar user={student} size="lg" />
      </div>
      <div className={styles.heroIdentity}>
        <div className={styles.heroName}>{student.displayName}</div>
        <div className={styles.heroMeta}>
          <span>{student.email}</span>
          {ageYears !== null && (
            <>
              <span className={styles.heroMetaDot} />
              <span>
                {ageYears} {t('studentProfile.yearsOld')}
              </span>
            </>
          )}
          {relationshipStatus && (
            <>
              <span className={styles.heroMetaDot} />
              <StatusPill status={relationshipStatus} />
            </>
          )}
          {profile && (
            <>
              <span className={styles.heroMetaDot} />
              <span>
                {t('studentProfile.profile.level')} {profile.learningLevel}
              </span>
            </>
          )}
        </div>
      </div>
      <div className={styles.heroKpis}>
        <div className={styles.kpi}>
          <div className={styles.kpiValue}>{kpis.lessonCount}</div>
          <div className={styles.kpiLabel}>{t('studentProfile.kpi.lessons')}</div>
        </div>
        <div className={styles.kpi}>
          <div className={`${styles.kpiValue} ${styles.kpiValueWarn}`}>★ {kpis.totalStars}</div>
          <div className={styles.kpiLabel}>{t('studentProfile.kpi.stars')}</div>
        </div>
        <div className={styles.kpi}>
          <div className={`${styles.kpiValue} ${kpis.accuracy !== null ? styles.kpiValueAccent : ''}`}>
            {kpis.accuracy !== null ? `${kpis.accuracy}%` : '—'}
          </div>
          <div className={styles.kpiLabel}>{t('studentProfile.kpi.accuracy')}</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiValue}>
            {kpis.streakDays > 0
              ? t('studentProfile.kpi.days', { count: kpis.streakDays })
              : t('studentProfile.kpi.noStreak')}
          </div>
          <div className={styles.kpiLabel}>{t('studentProfile.kpi.streak')}</div>
        </div>
      </div>
    </section>
  )
}

/**
 * "Streak" = number of consecutive days ending today (or yesterday) on
 * which the student completed at least one lesson. If the most recent
 * completion is older than yesterday, streak is 0.
 */
function computeStreakDays(lessons: Lesson[]): number {
  const dates = new Set(
    lessons
      .filter((l) => l.completedAt)
      .map((l) => l.completedAt!.slice(0, 10)),
  )
  if (dates.size === 0) return 0
  const oneDay = 86_400_000
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today.getTime() - oneDay)
  const lastKey = [...dates].sort().pop()!
  const lastDate = new Date(lastKey + 'T00:00:00')
  if (lastDate.getTime() < yesterday.getTime()) return 0

  let streak = 0
  let cursor = new Date(lastDate)
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor = new Date(cursor.getTime() - oneDay)
  }
  return streak
}

function ProgressTab({
  completedLessons,
  teacherId,
}: {
  completedLessons: Lesson[]
  teacherId: string
}) {
  const { t } = useTranslation()
  void teacherId

  if (completedLessons.length === 0) {
    return (
      <EmptyState title={t('studentProfile.noHistory')}>
        {t('studentProfile.historyEmpty')}
      </EmptyState>
    )
  }

  return (
    <Stack gap="md">
      <section className={styles.evolutionCard}>
        <EvolutionChart lessons={completedLessons} />
      </section>

      <section className={styles.mistakesCard}>
        <MistakesList lessons={completedLessons} />
      </section>

      <section className={styles.subjectsCard}>
        <SubjectAccuracyChart lessons={completedLessons} />
      </section>

      <section className={styles.historyCard}>
        <FullHistory lessons={completedLessons} />
      </section>
    </Stack>
  )
}

function FullHistory({ lessons }: { lessons: Lesson[] }) {
  const { t } = useTranslation()

  const sorted = useMemo(
    () =>
      [...lessons].sort((a, b) =>
        (b.completedAt ?? '') < (a.completedAt ?? '') ? -1 : 1,
      ),
    [lessons],
  )

  return (
    <>
      <div style={{ fontWeight: 600, marginBottom: 'var(--space-3)' }}>
        {t('studentProfile.historyTitle')}
      </div>
      {sorted.length === 0 ? (
        <p className={styles.historyEmpty}>{t('studentProfile.historyEmpty')}</p>
      ) : (
        <ul className={styles.historyList}>
          {sorted.map((lesson) => {
            const stars =
              lesson.score >= 100 ? 3 : lesson.score >= 75 ? 2 : lesson.score >= 50 ? 1 : 0
            return (
              <li key={lesson.id} className={styles.historyItem}>
                <span
                  className={styles.historyDot}
                  style={{ background: lesson.subjectColor }}
                />
                <div>
                  <div className={styles.historySubject}>{lesson.subjectTitle}</div>
                  <div className={styles.historyDate}>
                    {lesson.completedAt
                      ? new Date(lesson.completedAt).toLocaleDateString('pt-BR')
                      : ''}
                  </div>
                </div>
                <div className={styles.historyStars}>
                  {Array.from({ length: stars }, () => '★').join('')}
                </div>
                <div className={styles.historyScore}>{lesson.score}%</div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

function ProfileTab({
  profile,
  relationship,
}: {
  profile: ReturnType<typeof getProfileByStudentId>
  relationship: ReturnType<typeof getRelationshipsForTeacher>[number] | null
}) {
  const { t } = useTranslation()

  return (
    <Stack gap="md">
      <div className={styles.profileGrid}>
        <div className={styles.profileCard}>
          <div className={styles.profileCardTitle}>
            {t('studentProfile.profile.level')}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>
            {profile?.learningLevel ?? '—'}
          </div>
          <p className={styles.profileMuted} style={{ marginTop: 'var(--space-2)' }}>
            {t('studentProfile.cards.levelHint')}
          </p>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileCardTitle}>
            {t('studentProfile.profile.accessibility')}
          </div>
          {profile && Object.keys(profile.accessibility).length > 0 ? (
            <ul className={styles.profileKvList}>
              {Object.entries(profile.accessibility).map(([k, v]) => (
                <li key={k} className={styles.profileKvRow}>
                  <span className={styles.profileKvKey}>
                    {translateKey(t, k, 'labels')}
                  </span>
                  <span className={styles.profileKvValue}>
                    {translateValue(t, v)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.profileMuted}>{t('studentProfile.profile.noneSet')}</p>
          )}
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileCardTitle}>
            {t('studentProfile.profile.preferences')}
          </div>
          {profile && Object.keys(profile.preferences).length > 0 ? (
            <ul className={styles.profileKvList}>
              {Object.entries(profile.preferences).map(([k, v]) => (
                <li key={k} className={styles.profileKvRow}>
                  <span className={styles.profileKvKey}>
                    {translateKey(t, k, 'labels')}
                  </span>
                  <span className={styles.profileKvValue}>
                    {translateValue(t, v)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.profileMuted}>{t('studentProfile.profile.noneSet')}</p>
          )}
        </div>
      </div>

      {profile?.notes && (
        <div className={styles.profileCard}>
          <div className={styles.profileCardTitle}>
            {t('studentProfile.profile.notes')}
          </div>
          <p className={styles.profileNotes}>{profile.notes}</p>
        </div>
      )}

      {relationship && (
        <div className={styles.profileCard}>
          <div className={styles.profileCardTitle}>
            {t('studentProfile.profile.relationship')}
          </div>
          <Stack gap="sm">
            <div>
              <StatusPill status={relationship.status} />
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted-foreground)' }}>
              {t('studentProfile.profile.invited', {
                date: new Date(relationship.invitedAt).toLocaleDateString('pt-BR'),
              })}
              {relationship.respondedAt &&
                ` · ${t('studentProfile.profile.responded', {
                  date: new Date(relationship.respondedAt).toLocaleDateString('pt-BR'),
                })}`}
              {relationship.revokedAt &&
                ` · ${t('studentProfile.profile.ended', {
                  date: new Date(relationship.revokedAt).toLocaleDateString('pt-BR'),
                })}`}
            </div>
            {relationship.message && (
              <div
                style={{
                  padding: 'var(--space-3)',
                  background: 'var(--color-neutral-soft)',
                  borderRadius: 12,
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {relationship.message}
              </div>
            )}
          </Stack>
        </div>
      )}

      <div className={styles.backRow}>
        <Button
          to="../"
          variant="ghost"
          aria-label={t('studentProfile.backToDashboard')}
        >
          <Icon name="arrow-left" size={18} />
        </Button>
      </div>
    </Stack>
  )
}

function translateKey(t: Translator, key: string, group: 'labels' | 'values'): string {
  const translated = t(`studentProfile.profile.${group}.${key}`, { defaultValue: '' })
  if (translated) return translated
  // Fallback for unknown keys: pretty-print the raw key
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
}

function translateValue(t: Translator, value: unknown): string {
  if (typeof value === 'boolean') {
    return t(`studentProfile.profile.values.${value}`, {
      defaultValue: value ? 'Sim' : 'Não',
    })
  }
  const key = String(value)
  const translated = t(`studentProfile.profile.values.${key}`, { defaultValue: '' })
  return translated ? translated : key
}

import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getSubjectsForStudent, getUserById, mockStartLesson } from '../mocks'
import type { Lesson, Subject } from '../types'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { JourneyTrack } from '../components/JourneyTrack'
import { LessonPlayer } from '../components/LessonPlayer'
import { Stack } from '../components/Stack'
import styles from './StudentDashboard.module.css'

export function StudentDashboard() {
  const { t } = useTranslation()
  const { studentId } = useParams<{ studentId: string }>()
  const student = studentId ? getUserById(studentId) : undefined
  const subjects = useMemo(
    () => (studentId ? getSubjectsForStudent(studentId) : []),
    [studentId],
  )

  // Active lesson session (the one the student is currently working on).
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)

  if (!student) {
    return (
      <Stack gap="md">
        <EmptyState
          title={t('studentDashboard.notFound')}
          action={
            <Button to="/" variant="ghost">
              {t('teacherDashboard.goHome')}
            </Button>
          }
        />
      </Stack>
    )
  }

  const onIslandClick = (subject: Subject) => {
    if (subject.status === 'LOCKED') return
    const result = mockStartLesson(student.id, subject.id)
    if (!result) return
    setActiveLesson(result.lesson)
  }

  const exitLesson = () => setActiveLesson(null)
  const completeLesson = () => setActiveLesson(null)

  if (activeLesson) {
    return (
      <div className={styles.page}>
        <div className={styles.lesson}>
          <LessonPlayer
            lesson={activeLesson}
            onComplete={completeLesson}
            onExit={exitLesson}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <section className={styles.greeting}>
        <h1 className={styles.greetingTitle}>
          {t('studentDashboard.hello', { name: student.displayName.split(' ')[0] })}
        </h1>
        <span className={styles.greetingSubtitle}>{t('studentDashboard.subtitle')}</span>
      </section>

      <div className={styles.hint}>{t('studentDashboard.journey.startHint')}</div>

      <JourneyTrack subjects={subjects} onIslandClick={onIslandClick} />
    </div>
  )
}

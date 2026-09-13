import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getSubjectsForStudent, getUserById, mockStartLesson } from '../mocks'
import type { Lesson, Subject } from '../types'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
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
  const [lessonExiting, setLessonExiting] = useState(false)
  const [journeyLeaving, setJourneyLeaving] = useState(false)
  const exitTimeoutRef = useRef<number | null>(null)
  const enterTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) window.clearTimeout(exitTimeoutRef.current)
      if (enterTimeoutRef.current !== null) window.clearTimeout(enterTimeoutRef.current)
    }
  }, [])

  if (!student) {
    return (
      <Stack gap="md">
        <EmptyState
          title={t('studentDashboard.notFound')}
          action={
            <Button to="/" variant="ghost" aria-label={t('teacherDashboard.goHome')}>
              <Icon name="arrow-left" size={18} />
            </Button>
          }
        />
      </Stack>
    )
  }

  const onIslandClick = (subject: Subject) => {
    if (subject.status === 'LOCKED' || journeyLeaving) return
    const result = mockStartLesson(student.id, subject.id)
    if (!result) return
    setJourneyLeaving(true)
    enterTimeoutRef.current = window.setTimeout(() => {
      setActiveLesson(result.lesson)
      setJourneyLeaving(false)
      enterTimeoutRef.current = null
    }, 360)
  }

  const closeLesson = () => {
    if (lessonExiting) return
    setLessonExiting(true)
    exitTimeoutRef.current = window.setTimeout(() => {
      setActiveLesson(null)
      setLessonExiting(false)
      exitTimeoutRef.current = null
    }, 280)
  }

  const exitLesson = closeLesson
  const completeLesson = closeLesson

  if (activeLesson) {
    return (
      <div className={styles.page}>
        <div className={`${styles.lesson} ${lessonExiting ? styles.lessonLeaving : ''}`}>
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
      <div className={styles.bg} />

      <div className={`${styles.journeyView} ${journeyLeaving ? styles.journeyLeaving : ''}`}>
        <div className={styles.hint}>
          <span className={styles.hintIcon}>👆</span>
          {t('studentDashboard.journey.startHint')}
        </div>

        <JourneyTrack subjects={subjects} onIslandClick={onIslandClick} />
      </div>
    </div>
  )
}

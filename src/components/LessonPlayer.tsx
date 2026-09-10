import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '../types'
import { mockSubmitAnswer, getExercisesForSubject } from '../mocks'
import { multipleChoicePayloadSchema } from '../schemas/exercise'
import { Button } from './Button'
import { Row } from './Row'
import styles from './LessonPlayer.module.css'

interface LessonPlayerProps {
  lesson: Lesson
  onComplete: () => void
  onExit: () => void
}

export function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const { t } = useTranslation()
  const exercisePool = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getExercisesForSubject>[number]>()
    for (const ex of getExercisesForSubject(lesson.subjectId)) map.set(ex.id, ex)
    return map
  }, [lesson.subjectId])

  const total = lesson.exercises.length
  const firstPendingIdx = lesson.exercises.findIndex((e) => e.status === 'PENDING')
  const [currentIdx, setCurrentIdx] = useState(
    firstPendingIdx === -1 ? 0 : firstPendingIdx,
  )

  const currentEntry = lesson.exercises[currentIdx]
  const currentExercise = currentEntry ? exercisePool.get(currentEntry.exerciseId) : undefined
  const payload = currentExercise
    ? multipleChoicePayloadSchema.safeParse(currentExercise.payload)
    : undefined
  const mcp = payload?.success ? payload.data : undefined

  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<null | {
    correct: boolean
    consequence: string
    correctChoiceText: string
    status: 'CORRECT' | 'FAILED_THEN_CORRECT' | 'PENDING'
  }>(null)

  const completedCount = lesson.exercises.filter(
    (e) => e.status === 'CORRECT' || e.status === 'FAILED_THEN_CORRECT',
  ).length

  // Detect completion: all entries resolved
  if (firstPendingIdx === -1 && !feedback && completedCount === total) {
    return <CompleteScreen lesson={lesson} onComplete={onComplete} />
  }

  if (!currentEntry || !currentExercise || !mcp) {
    return (
      <div className={styles.player}>
        <p>{t('errors.generic')}</p>
      </div>
    )
  }

  const onChoose = (choiceId: string) => {
    if (feedback) return
    setSelected(choiceId)
    const result = mockSubmitAnswer(lesson.id, currentEntry.id, choiceId)
    if (!result) return
    setFeedback({
      correct: result.correct,
      consequence: result.consequence,
      correctChoiceText: result.correctChoiceText,
      status: result.status,
    })

    if (result.correct && !result.lessonComplete) {
      // auto-advance after a brief pause so the user sees the green feedback
      window.setTimeout(() => {
        advance()
      }, 1100)
    }
  }

  const advance = () => {
    setSelected(null)
    setFeedback(null)
    const nextPending = lesson.exercises.findIndex(
      (e, i) => i > currentIdx && e.status === 'PENDING',
    )
    if (nextPending !== -1) {
      setCurrentIdx(nextPending)
    } else if (lesson.exercises.every((e) => e.status !== 'PENDING')) {
      // All done — CompleteScreen will render on next render
      // Force a re-render by bumping state
      setCurrentIdx((i) => i) // no-op, just triggers re-render via state change
      setSelected(null)
    } else {
      const firstPending = lesson.exercises.findIndex((e) => e.status === 'PENDING')
      if (firstPending !== -1) setCurrentIdx(firstPending)
    }
  }

  const onTryAgain = () => {
    setSelected(null)
    setFeedback(null)
  }

  const progress = ((currentIdx + (feedback ? 1 : 0)) / total) * 100

  return (
    <div className={styles.player} style={{ ['--subject-color' as string]: lesson.subjectColor }}>
      <div className={styles.header}>
        <button type="button" className={styles.exit} onClick={onExit}>
          ← {t('lessonPlayer.exitLesson')}
        </button>
        <div className={styles.title}>
          <span className={styles.subjectDot} />
          {lesson.subjectTitle}
        </div>
      </div>

      <Row gap="md" align="stretch">
        <div className={styles.progress}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressLabel}>
          {t('lessonPlayer.progress', {
            current: Math.min(currentIdx + 1, total),
            total,
          })}
        </span>
      </Row>

      {mcp.scenario && <div className={styles.scenario}>{mcp.scenario}</div>}
      <p className={styles.question}>{mcp.question}</p>

      <div className={styles.choices}>
        {mcp.choices.map((c, i) => {
          const isSelected = selected === c.id
          const showResult = feedback !== null
          const isCorrectChoice = c.correct
          const className = [
            styles.choice,
            showResult && isCorrectChoice ? styles.choiceCorrect : null,
            showResult && isSelected && !c.correct ? styles.choiceWrong : null,
            showResult && isSelected && c.correct ? styles.choiceCorrect : null,
            showResult && !isSelected && !isCorrectChoice ? styles.choiceFaded : null,
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={c.id}
              type="button"
              className={className}
              onClick={() => onChoose(c.id)}
              disabled={feedback !== null}
            >
              <span className={styles.choiceIcon}>{String.fromCharCode(65 + i)}</span>
              <span>{c.text}</span>
            </button>
          )
        })}
      </div>

      {feedback && (
        <div
          className={`${styles.feedback} ${
            feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong
          }`}
        >
          <div className={styles.feedbackTitle}>
            <span className={styles.feedbackIcon}>{feedback.correct ? '✓' : '✗'}</span>
            {feedback.correct ? t('lessonPlayer.correctTitle') : t('lessonPlayer.wrongTitle')}
          </div>
          <div className={styles.feedbackBody}>{feedback.consequence}</div>
          {!feedback.correct && (
            <>
              <div className={styles.feedbackNote}>{t('lessonPlayer.theRightAnswer')}</div>
              <div className={styles.feedbackBody}>
                <strong>{feedback.correctChoiceText}</strong>
              </div>
            </>
          )}
          <Row gap="sm">
            {feedback.correct ? (
              <Button onClick={advance}>{t('lessonPlayer.continue')}</Button>
            ) : (
              <Button onClick={onTryAgain}>{t('lessonPlayer.tryAgain')}</Button>
            )}
          </Row>
        </div>
      )}
    </div>
  )
}

function CompleteScreen({
  lesson,
  onComplete,
}: {
  lesson: Lesson
  onComplete: () => void
}) {
  const { t } = useTranslation()
  const stars =
    lesson.score >= 100 ? 3 : lesson.score >= 75 ? 2 : lesson.score >= 50 ? 1 : 0

  return (
    <div className={styles.complete}>
      <div className={styles.completeStars}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={i < stars ? styles.completeStarOn : styles.completeStarOff}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>
      <div className={styles.completeTitle}>{t('lessonPlayer.completeTitle')}</div>
      <div className={styles.completeBody}>{t('lessonPlayer.completeBody')}</div>
      <div className={styles.completeScore}>
        {t('lessonPlayer.scoreLabel')}: {lesson.score}%
      </div>
      <div className={styles.completeBody}>{t('lessonPlayer.starsEarned', { count: stars })}</div>
      <Button onClick={onComplete}>{t('lessonPlayer.backToJourney')}</Button>
    </div>
  )
}

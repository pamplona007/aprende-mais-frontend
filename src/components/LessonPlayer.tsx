import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '../types'
import { mockSubmitAnswer, getExercisesForSubject } from '../mocks'
import { multipleChoicePayloadSchema } from '../schemas/exercise'
import { Button } from './Button'
import { Icon } from './Icon'
import { Row } from './Row'
import styles from './LessonPlayer.module.css'

function jitter(max: number): number {
  // oxlint-disable-next-line react(purity) -- visual variety only
  return Math.random() * max
}

function jitterOffset(max: number): number {
  // oxlint-disable-next-line react(purity) -- visual variety only
  return (Math.random() - 0.5) * max
}

interface LessonPlayerProps {
  lesson: Lesson
  onComplete: () => void
  onExit: () => void
}

type Feedback =
  | { kind: 'correct'; consequence: string; status: 'CORRECT' | 'FAILED_THEN_CORRECT' }
  | { kind: 'wrong'; consequence: string; correctChoiceText: string }
  | null

export function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const { t } = useTranslation()
  const exercisePool = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getExercisesForSubject>[number]>()
    for (const ex of getExercisesForSubject(lesson.subjectId)) map.set(ex.id, ex)
    return map
  }, [lesson.subjectId])

  // The "tour" is the sequence of exercise IDs the player is currently
  // walking through. We start with all exercises in their initial order.
  // When a question is answered wrong, we mark it needsRetry (visual only)
  // and continue with the rest. After the first pass, if anything still
  // needs retry, we replay those. We loop until everything is resolved.
  const [tour, setTour] = useState<string[]>(() => lesson.exercises.map((e) => e.id))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [needsRetry, setNeedsRetry] = useState<Set<string>>(new Set())
  const [confettiKey, setConfettiKey] = useState(0)
  const exitClickedRef = useRef(false)

  const currentEntryId = tour[currentIdx]
  const currentEntry = lesson.exercises.find((e) => e.id === currentEntryId)
  const currentExercise = currentEntry ? exercisePool.get(currentEntry.exerciseId) : undefined
  const parsed = currentExercise
    ? multipleChoicePayloadSchema.safeParse(currentExercise.payload)
    : undefined
  const mcp = parsed?.success ? parsed.data : undefined

  // Resolve status: a question is "done" if it's not in needsRetry set.
  // When all are done, mark the lesson complete in the mock.
  useEffect(() => {
    if (tour.length === 0) return
    if (needsRetry.size === 0) {
      // All clear — complete the lesson.
      markAllCorrect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsRetry.size, tour.length])

  const markAllCorrect = () => {
    // Walk the lesson and mark every entry as either CORRECT or FAILED_THEN_CORRECT.
    // We do this by submitting a "correct" answer (first correct choice) for each.
    // The mock already marks them correct if the entry was PENDING; if it was
    // already CORRECT or FAILED_THEN_CORRECT, the call is a no-op.
    for (const ex of lesson.exercises) {
      const firstCorrect = exercisePool.get(ex.exerciseId)?.payload.choices.find((c) => c.correct)
      if (firstCorrect) {
        mockSubmitAnswer(lesson.id, ex.id, firstCorrect.id)
      }
    }
  }

  const onChoose = (choiceId: string) => {
    if (feedback) return
    if (!currentEntry) return
    const result = mockSubmitAnswer(lesson.id, currentEntry.id, choiceId)
    if (!result) return

    if (result.correct) {
      setFeedback({
        kind: 'correct',
        consequence: result.consequence,
        status: result.status === 'PENDING' ? 'CORRECT' : result.status,
      })
      setConfettiKey((k) => k + 1)
      // No auto-advance — user clicks "Continuar"
    } else {
      setFeedback({
        kind: 'wrong',
        consequence: result.consequence,
        correctChoiceText: result.correctChoiceText,
      })
      // Mark this question for retry; advance to next question.
      setNeedsRetry((prev) => new Set(prev).add(currentEntry.id))
      // Short delay so user can see the shake animation before we move on.
      window.setTimeout(() => {
        advance(false)
      }, 1400)
    }
  }

  const advance = (_wasCorrect: boolean) => {
    setFeedback(null)
    const isLastInTour = currentIdx >= tour.length - 1

    if (!isLastInTour) {
      setCurrentIdx(currentIdx + 1)
      return
    }

    // End of tour — if anything still needs retry, replay those entries.
    if (needsRetry.size > 0) {
      const retryEntries = lesson.exercises
        .filter((e) => needsRetry.has(e.id))
        .map((e) => e.id)
      if (retryEntries.length > 0) {
        setTour(retryEntries)
        setCurrentIdx(0)
        setNeedsRetry(new Set())
        return
      }
    }

    // All done — CompleteScreen will render on next render.
  }

  const onContinue = () => {
    advance(true)
  }

  // Confetti pieces for the correct-answer burst.
  const confettiPieces = useMemo(() => {
    if (confettiKey === 0) return []
    const colors = ['#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff4b4b', '#ff9600']
    const pieces: Array<{
      id: number
      color: string
      left: number
      top: number
      dx: number
      dy: number
      rot: number
      delay: number
    }> = []
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24 + jitter(0.3)
      const distance = 120 + jitter(80)
      pieces.push({
        id: i,
        color: colors[i % colors.length] ?? '#58cc02',
        left: 50 + jitterOffset(30),
        top: 60 + jitterOffset(20),
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 50,
        rot: 360 + jitter(720),
        delay: jitter(100),
      })
    }
    return pieces
  }, [confettiKey])

  if (!currentEntry || !currentExercise || !mcp) {
    // No more tour entries to render — show complete screen.
    return <CompleteScreen lesson={lesson} onComplete={onComplete} />
  }

  return (
    <div
      className={styles.player}
      style={{ ['--subject-color' as string]: lesson.subjectColor }}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.exit}
          onClick={() => {
            if (exitClickedRef.current) return
            exitClickedRef.current = true
            onExit()
          }}
          aria-label={t('lessonPlayer.exitLesson')}
        >
          <Icon name="close" size={18} />
        </button>
        <div className={styles.title}>
          <span className={styles.subjectDot} />
          {lesson.subjectTitle}
        </div>
      </div>

      <Row gap="md" align="center">
        <div className={styles.dots}>
          {lesson.exercises.map((ex) => {
            const visited = tour.includes(ex.id) || ex.id === currentEntryId
            const isCurrent = ex.id === currentEntryId
            const isDone = ex.status === 'CORRECT' || ex.status === 'FAILED_THEN_CORRECT'
            const isRetry = needsRetry.has(ex.id)
            const className = [
              styles.dot,
              isCurrent ? styles.dotActive : null,
              !isCurrent && isDone ? styles.dotCorrect : null,
              !isCurrent && !isDone && visited && isRetry ? styles.dotNeedsRetry : null,
            ]
              .filter(Boolean)
              .join(' ')
            return <span key={ex.id} className={className} aria-hidden="true" />
          })}
        </div>
      </Row>

      {mcp.scenario && <div className={styles.scenario}>{mcp.scenario}</div>}
      <p className={styles.question}>{mcp.question}</p>

      <div className={styles.choices} style={{ position: 'relative' }}>
        {mcp.choices.map((c, i) => {
          const className = [
            styles.choice,
            feedback?.kind === 'correct' && c.correct ? styles.choiceCorrect : null,
            feedback?.kind === 'wrong' && c.correct ? styles.choiceCorrect : null,
            feedback?.kind === 'wrong' && !c.correct ? styles.choiceFaded : null,
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
              <span className={styles.choiceContent}>
                <span className={styles.choiceIcon}>{String.fromCharCode(65 + i)}</span>
                <span className={styles.choiceText}>{c.text}</span>
              </span>
            </button>
          )
        })}

        {confettiKey > 0 && feedback?.kind === 'correct' && (
          <div className={styles.confetti} key={confettiKey} aria-hidden="true">
            {confettiPieces.map((p) => (
              <span
                key={p.id}
                className={styles.confettiDot}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  background: p.color,
                  ['--dx' as string]: `${p.dx}px`,
                  ['--dy' as string]: `${p.dy}px`,
                  ['--rot' as string]: `${p.rot}deg`,
                  animationDelay: `${p.delay}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`${styles.feedback} ${
            feedback.kind === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
          }`}
        >
          <div className={styles.feedbackHeader}>
            <div className={styles.feedbackHeaderMain}>
              <div
                className={`${styles.feedbackBadge} ${
                  feedback.kind === 'correct' ? styles.feedbackBadgeCorrect : styles.feedbackBadgeWrong
                }`}
              >
                {feedback.kind === 'correct' ? '✓' : '✗'}
              </div>
              <div>
                <div className={styles.feedbackTitle}>
                  {feedback.kind === 'correct'
                    ? t('lessonPlayer.correctTitle')
                    : t('lessonPlayer.wrongTitle')}
                </div>
                <div className={styles.feedbackBody}>{feedback.consequence}</div>
                {feedback.kind === 'wrong' && (
                  <>
                    <div className={styles.feedbackNote}>{t('lessonPlayer.theRightAnswer')}</div>
                    <div className={styles.feedbackBody}>
                      <strong>{feedback.correctChoiceText}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.feedbackActionSlot}>
              <Button onClick={onContinue} aria-label={t('lessonPlayer.continue')}>
                <Icon name="arrow-right" size={18} />
              </Button>
            </div>
          </div>
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
  const stars = lesson.score >= 100 ? 3 : lesson.score >= 75 ? 2 : lesson.score >= 50 ? 1 : 0

  const confettiColors = useMemo(
    () => ['#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff4b4b', '#ff9600'],
    [],
  )
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        color: confettiColors[i % confettiColors.length] ?? '#58cc02',
        left: jitter(100),
        top: -10 - jitter(30),
        dx: jitterOffset(200),
        dy: 400 + jitter(200),
        rot: jitter(1440) - 720,
        delay: jitter(800),
      })),
    [confettiColors],
  )

  return (
    <div
      className={styles.complete}
      style={{ ['--subject-color' as string]: lesson.subjectColor }}
    >
      <div className={styles.completeConfetti} aria-hidden="true">
        {pieces.map((p) => (
          <span
            key={p.id}
            className={styles.completeConfettiDot}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: p.color,
              ['--dx' as string]: `${p.dx}px`,
              ['--dy' as string]: `${p.dy}px`,
              ['--rot' as string]: `${p.rot}deg`,
              animationDelay: `${p.delay}ms`,
            }}
          />
        ))}
      </div>

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
      <div className={styles.completeScore}>{lesson.score}%</div>
      <div className={styles.completeStarsText}>
        {t('lessonPlayer.starsEarned', { count: stars })}
      </div>
      <div className={styles.completeActions}>
        <Button onClick={onComplete} aria-label={t('lessonPlayer.backToJourney')}>
          <Icon name="arrow-left" size={18} />
        </Button>
      </div>
    </div>
  )
}

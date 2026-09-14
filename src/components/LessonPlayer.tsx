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

  // IDs of exercise entries that the student has answered correctly (at least
  // once). Once every entry is in here, the lesson is complete.
  const [resolved, setResolved] = useState<Set<string>>(new Set())
  // IDs of entries the student got wrong on their FIRST attempt — used to
  // compute the score. Unlike `retries`, this set only grows.
  const [firstAttemptWrong, setFirstAttemptWrong] = useState<Set<string>>(new Set())
  // IDs of entries the student got wrong at least once; they get re-asked
  // after the first pass over the lesson.
  const [retries, setRetries] = useState<Set<string>>(new Set())
  const [currentIdx, setCurrentIdx] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const exitClickedRef = useRef(false)
  // Refs mirror the state so timeouts can read the latest values without
  // stale closure issues.
  const resolvedRef = useRef(resolved)
  const retriesRef = useRef(retries)
  resolvedRef.current = resolved
  retriesRef.current = retries

  const currentEntry = lesson.exercises[currentIdx]
  const currentExercise = currentEntry ? exercisePool.get(currentEntry.exerciseId) : undefined
  const parsed = currentExercise
    ? multipleChoicePayloadSchema.safeParse(currentExercise.payload)
    : undefined
  const mcp = parsed?.success ? parsed.data : undefined

  // If everything's resolved, complete the lesson and show CompleteScreen.
  useEffect(() => {
    if (lesson.exercises.length > 0 && resolved.size === lesson.exercises.length) {
      markLessonComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved.size])

  const markLessonComplete = () => {
    // Submit a correct answer for any entry that's still PENDING in the mock
    // (this can happen if the student got them all right without retries).
    for (const ex of lesson.exercises) {
      if (ex.status === 'PENDING') {
        const firstCorrect = exercisePool.get(ex.exerciseId)?.payload.choices.find((c) => c.correct)
        if (firstCorrect) {
          mockSubmitAnswer(lesson.id, ex.id, firstCorrect.id)
        }
      }
    }
  }

  const onChoose = (choiceId: string) => {
    if (feedback) return
    if (!currentEntry) return
    const result = mockSubmitAnswer(lesson.id, currentEntry.id, choiceId)
    if (!result) return

    if (result.correct) {
      setResolved((prev) => {
        const next = new Set(prev)
        next.add(currentEntry.id)
        return next
      })
      setFeedback({
        kind: 'correct',
        consequence: result.consequence,
        status: result.status === 'PENDING' ? 'CORRECT' : result.status,
      })
      setConfettiKey((k) => k + 1)
    } else {
      setFeedback({
        kind: 'wrong',
        consequence: result.consequence,
        correctChoiceText: result.correctChoiceText,
      })
      // Mark this entry for replay after the first pass, and remember
      // it was wrong on first attempt so the score reflects it.
      setRetries((prev) => new Set(prev).add(currentEntry.id))
      setFirstAttemptWrong((prev) => new Set(prev).add(currentEntry.id))
      // No auto-advance — user clicks "Continuar" when ready.
    }
  }

  const advance = () => {
    setFeedback(null)
    // Move to next unresolved entry beyond current.
    for (let i = currentIdx + 1; i < lesson.exercises.length; i += 1) {
      const entry = lesson.exercises[i]
      if (entry && !resolvedRef.current.has(entry.id)) {
        setCurrentIdx(i)
        return
      }
    }
    // End of first pass. If there are retries, replay them in order.
    const pendingRetries = retriesRef.current
    if (pendingRetries.size > 0) {
      const firstRetryIdx = lesson.exercises.findIndex((e) => pendingRetries.has(e.id))
      if (firstRetryIdx >= 0) {
        setRetries(new Set())
        setCurrentIdx(firstRetryIdx)
        return
      }
    }
    // Nothing left to do — mark the lesson complete so CompleteScreen renders.
    setCompleted(true)
  }

  const onContinue = () => {
    advance()
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

  // Once advance() confirms there's nothing left to ask, it sets this to
  // true so the next render shows CompleteScreen instead of the question.
  const [completed, setCompleted] = useState(false)

  if (
    lesson.exercises.length > 0 &&
    completed
  ) {
    return (
      <CompleteScreen
        lesson={lesson}
        firstAttemptWrong={firstAttemptWrong}
        onComplete={onComplete}
      />
    )
  }

  if (!currentEntry || !currentExercise || !mcp) {
    // No more tour entries to render — show complete screen.
    return (
      <CompleteScreen
        lesson={lesson}
        firstAttemptWrong={firstAttemptWrong}
        onComplete={onComplete}
      />
    )
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
          {lesson.exercises.map((ex, idx) => {
            const isCurrent = idx === currentIdx
            const isDone = resolved.has(ex.id)
            const isRetry = retries.has(ex.id) && !isDone
            const className = [
              styles.dot,
              isCurrent ? styles.dotActive : null,
              !isCurrent && isDone ? styles.dotCorrect : null,
              !isCurrent && !isDone && isRetry ? styles.dotNeedsRetry : null,
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
  firstAttemptWrong,
  onComplete,
}: {
  lesson: Lesson
  firstAttemptWrong: Set<string>
  onComplete: () => void
}) {
  const { t } = useTranslation()

  // First-attempt correctness is what defines the score and stars.
  const total = lesson.exercises.length
  const correctFirstTry = total - firstAttemptWrong.size
  const percent = total === 0 ? 0 : Math.round((correctFirstTry / total) * 100)
  const stars = percent >= 100 ? 3 : percent >= 75 ? 2 : percent >= 50 ? 1 : 0

  // Time spent on this single lesson session. Captured once on mount so
  // oxlint's purity rule is happy (Date.now is impure).
  const [mountTime] = useState(() => Date.now())
  const startedMs = new Date(lesson.startedAt).getTime()
  const elapsedMs = Math.max(0, mountTime - startedMs)

  // Headline copy based on performance.
  const headline =
    percent >= 100
      ? t('lessonPlayer.perfect')
      : percent >= 75
        ? t('lessonPlayer.great')
        : percent >= 50
          ? t('lessonPlayer.good')
          : t('lessonPlayer.keepGoing')

  // Animated count-up for the score number.
  const [displayedScore, setDisplayedScore] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const duration = 1000
    const tick = (now: number) => {
      const t01 = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t01, 3)
      setDisplayedScore(Math.round(eased * correctFirstTry))
      if (t01 < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [correctFirstTry])

  // Continuous celebration confetti: emit a small batch every 1.4s for ~6s.
  const [confettiBurst, setConfettiBurst] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => {
      setConfettiBurst((b) => b + 1)
    }, 1400)
    const stop = window.setTimeout(() => window.clearInterval(id), 6500)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(stop)
    }
  }, [])

  const confettiColors = useMemo(
    () => ['#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff4b4b', '#ff9600'],
    [],
  )

  function buildPieces(seed: number) {
    return Array.from({ length: 22 }, (_, i) => ({
      id: `${seed}-${i}`,
      color: confettiColors[i % confettiColors.length] ?? '#58cc02',
      left: jitter(100),
      top: -8 - jitter(20),
      dx: jitterOffset(160),
      dy: 380 + jitter(160),
      rot: jitter(1440) - 720,
      delay: jitter(500),
    }))
  }

  // Confetti pieces are recomputed whenever the burst key changes (the key
  // increments each interval tick). Using a key-based remount means we don't
  // need a separate state mirror or an effect — the pieces are derived
  // directly from the burst counter.
  const confettiKeyForBurst = confettiBurst > 0 ? confettiBurst : 0

  return (
    <div
      className={styles.complete}
      style={{ ['--subject-color' as string]: lesson.subjectColor }}
    >
      <div className={styles.completeBackdropRays} aria-hidden="true" />

      <div
        className={styles.completeConfetti}
        aria-hidden="true"
        key={confettiKeyForBurst}
      >
        {buildPieces(confettiKeyForBurst).map((p) => (
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

      <div className={styles.completeTrophy} aria-hidden="true">
        {stars === 3 ? '🏆' : stars === 2 ? '🎉' : stars === 1 ? '👏' : '💪'}
      </div>
      <div className={styles.completeTitle}>{t('lessonPlayer.completeTitle')}</div>
      <div
        className={styles.completeHeadline}
        style={{ color: lesson.subjectColor }}
      >
        {headline}
      </div>

      <div className={styles.completeStars} aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={i < stars ? styles.completeStarOn : styles.completeStarOff}
          >
            ★
          </span>
        ))}
      </div>

      <div className={styles.completeScoreWrap}>
        <div className={styles.completeScoreLabel}>
          {t('lessonPlayer.scoreLabel')}
        </div>
        <div className={styles.completeScoreValue}>
          <span className={styles.completeScoreCount}>{displayedScore}</span>
          <span className={styles.completeScoreSlash}>/</span>
          <span className={styles.completeScoreTotal}>{total}</span>
        </div>
        <div className={styles.completeScorePercent}>{percent}%</div>
      </div>

      <div className={styles.completeTimeWrap}>
        <span className={styles.completeTimeIcon} aria-hidden="true">
          ⏱
        </span>
        <span>{t('lessonPlayer.timeSpent')}:</span>
        <span className={styles.completeTimeValue}>
          {formatDuration(elapsedMs)}
        </span>
      </div>

      <div className={styles.completeActions}>
        <Button
          className={styles.completeActionBtn}
          onClick={onComplete}
          aria-label={t('lessonPlayer.backToJourney')}
        >
          <Icon name="arrow-left" size={18} />
        </Button>
      </div>
    </div>
  )
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

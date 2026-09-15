import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '../../types'
import { getExerciseById } from '../../mocks'
import styles from './MistakesList.module.css'

interface MistakesListProps {
  lessons: Lesson[]
  limit?: number
}

interface MistakeRow {
  id: string
  lessonId: string
  subjectTitle: string
  subjectColor: string
  date: string
  status: 'FAILED_THEN_CORRECT'
  prompt: string
  scenario: string | undefined
  chosenText: string
  correctText: string
  chosenId: string
}

/**
 * Every exercise the student got wrong, newest first. Each row shows the
 * lesson date + subject, the exercise scenario, what the student picked
 * (the wrong choice, in coral), and the right answer (in green).
 *
 * Only exercises where the student picked a wrong answer first
 * (status === 'FAILED_THEN_CORRECT') qualify — they tell the teacher
 * "this is what tripped them up." Exercises that are still PENDING
 * (lesson in progress) are skipped.
 */
export function MistakesList({ lessons, limit = 8 }: MistakesListProps) {
  const { t } = useTranslation()

  const rows = useMemo(() => {
    const out: MistakeRow[] = []
    for (const lesson of lessons) {
      if (lesson.completedAt === null) continue
      for (const ex of lesson.exercises) {
        if (ex.status !== 'FAILED_THEN_CORRECT') continue
        if (!ex.chosenChoiceId) continue
        const exercise = getExerciseById(ex.exerciseId)
        if (!exercise) continue
        const chosen = exercise.payload.choices.find(
          (c) => c.id === ex.chosenChoiceId,
        )
        const correct = exercise.payload.choices.find((c) => c.correct)
        if (!chosen || !correct) continue
        out.push({
          id: ex.id,
          lessonId: lesson.id,
          subjectTitle: lesson.subjectTitle,
          subjectColor: lesson.subjectColor,
          date: lesson.completedAt!,
          status: 'FAILED_THEN_CORRECT',
          prompt: exercise.prompt,
          scenario: exercise.payload.scenario,
          chosenText: chosen.text,
          correctText: correct.text,
          chosenId: ex.chosenChoiceId,
        })
      }
    }
    return out.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit)
  }, [lessons, limit])

  if (rows.length === 0) {
    return <p className={styles.empty}>{t('studentProfile.charts.noMistakes')}</p>
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{t('studentProfile.charts.mistakes')}</div>
          <div className={styles.subtitle}>{t('studentProfile.charts.mistakesSub')}</div>
        </div>
        <span className={styles.count}>{rows.length}</span>
      </div>

      <ul className={styles.list}>
        {rows.map((row) => (
          <li key={row.id} className={styles.item}>
            <div className={styles.topRow}>
              <div className={styles.meta}>
                <span
                  className={styles.subjectChip}
                  style={{
                    background: `${row.subjectColor}1a`,
                    color: row.subjectColor,
                  }}
                >
                  <span
                    className={styles.swatch}
                    style={{ background: row.subjectColor }}
                  />
                  {row.subjectTitle}
                </span>
                <span className={styles.date}>
                  {new Date(row.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className={styles.prompt}>
              {row.scenario ?? row.prompt}
            </div>

            <div className={styles.choices}>
              <div className={`${styles.choice} ${styles.choiceWrong}`}>
                <span className={styles.choiceLabel}>
                  {t('studentProfile.charts.chosenLabel')}
                </span>
                <span className={styles.choiceText}>{row.chosenText}</span>
              </div>
              <div className={`${styles.choice} ${styles.choiceCorrect}`}>
                <span className={styles.choiceLabel}>
                  {t('studentProfile.charts.correctLabel')}
                </span>
                <span className={styles.choiceText}>{row.correctText}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

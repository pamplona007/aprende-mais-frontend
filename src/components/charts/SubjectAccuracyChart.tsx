import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '../../types'
import styles from './SubjectAccuracyChart.module.css'

interface SubjectAccuracyChartProps {
  lessons: Lesson[]
}

/**
 * Horizontal bars, one per subject. Bar length = average score % across
 * the student's completed lessons in that subject. Bar color = the
 * subject's own color, so the dashboard and the chart share visual cues.
 */
export function SubjectAccuracyChart({ lessons }: SubjectAccuracyChartProps) {
  const { t } = useTranslation()

  const aggregated = useMemo(() => {
    const bySubject = new Map<
      string,
      { title: string; color: string; totalScore: number; count: number }
    >()
    for (const lesson of lessons) {
      const existing = bySubject.get(lesson.subjectId)
      if (existing) {
        existing.totalScore += lesson.score
        existing.count += 1
      } else {
        bySubject.set(lesson.subjectId, {
          title: lesson.subjectTitle,
          color: lesson.subjectColor,
          totalScore: lesson.score,
          count: 1,
        })
      }
    }
    return Array.from(bySubject.entries())
      .map(([subjectId, { title, color, totalScore, count }]) => ({
        subjectId,
        title,
        color,
        averageScore: Math.round(totalScore / count),
        count,
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
  }, [lessons])

  if (aggregated.length === 0) {
    return <p className={styles.empty}>{t('studentProfile.charts.noData')}</p>
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>{t('studentProfile.charts.bySubject')}</div>
      <ul className={styles.list}>
        {aggregated.map((row) => (
          <li key={row.subjectId} className={styles.row}>
            <div className={styles.subject}>
              <span className={styles.swatch} style={{ background: row.color }} />
              <span className={styles.subjectName}>{row.title}</span>
            </div>
            <div
              className={styles.barTrack}
              role="img"
              aria-label={t('studentProfile.charts.subjectAria', {
                subject: row.title,
                score: row.averageScore,
              })}
            >
              <div
                className={styles.barFill}
                style={{
                  width: `${row.averageScore}%`,
                  background: row.color,
                }}
              />
            </div>
            <div className={styles.score}>
              {row.averageScore}%
              <span className={styles.lessonCount}>
                · {t('studentProfile.charts.lessonCount', { count: row.count })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

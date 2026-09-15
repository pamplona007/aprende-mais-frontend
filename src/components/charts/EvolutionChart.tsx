import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '../../types'
import styles from './EvolutionChart.module.css'

interface EvolutionChartProps {
  lessons: Lesson[]
}

const POINT_RADIUS = 6
const PADDING_X = 36
const PADDING_TOP = 24
const PADDING_BOTTOM = 36
const POINT_SPACING = 70
const CHART_HEIGHT = 200
const MIN_WIDTH = 320
const TREND_WINDOW = 3

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

/**
 * Score-over-time line graph for the teacher's student profile.
 *
 * - One dot per completed lesson, X = date (chronological), Y = score %.
 * - Smooth area fill underneath for visual weight.
 * - A 3-point moving-average dashed line on top to surface the trend
 *   without the noise of day-to-day variance.
 * - Each dot is ringed in the lesson's subject color so the teacher
 *   can spot which subject is winning / losing.
 * - A small trend badge in the header reports the delta between the
 *   first and last moving-average points.
 */
export function EvolutionChart({ lessons }: EvolutionChartProps) {
  const { t } = useTranslation()

  const points = useMemo(() => {
    return lessons
      .filter((l) => l.completedAt !== null)
      .sort((a, b) => (a.completedAt! < b.completedAt! ? -1 : 1))
      .map((lesson, i) => ({
        id: lesson.id,
        index: i,
        score: lesson.score,
        date: lesson.completedAt!,
        subjectTitle: lesson.subjectTitle,
        subjectColor: lesson.subjectColor,
      }))
  }, [lessons])

  const trendPoints = useMemo(() => {
    return points.map((p, i) => {
      const start = Math.max(0, i - TREND_WINDOW + 1)
      const window = points.slice(start, i + 1)
      const avg = window.reduce((sum, q) => sum + q.score, 0) / window.length
      return { ...p, trendScore: avg }
    })
  }, [points])

  if (points.length === 0) {
    return <p className={styles.empty}>{t('studentProfile.charts.noData')}</p>
  }

  const width = Math.max(
    PADDING_X * 2 + POINT_SPACING * (points.length - 1) + POINT_RADIUS * 2,
    MIN_WIDTH,
  )
  const height = CHART_HEIGHT

  const xFor = (i: number) => PADDING_X + POINT_RADIUS + i * POINT_SPACING
  const yFor = (score: number) =>
    PADDING_TOP + (1 - score / 100) * (height - PADDING_TOP - PADDING_BOTTOM)

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.index)} ${yFor(p.score)}`)
    .join(' ')

  const areaPath =
    `M ${xFor(0)} ${yFor(0)} ` +
    points.map((p) => `L ${xFor(p.index)} ${yFor(p.score)}`).join(' ') +
    ` L ${xFor(points.length - 1)} ${height - PADDING_BOTTOM} ` +
    `L ${xFor(0)} ${height - PADDING_BOTTOM} Z`

  const trendPath = trendPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.index)} ${yFor(p.trendScore)}`)
    .join(' ')

  const firstTrend = trendPoints[0].trendScore
  const lastTrend = trendPoints[trendPoints.length - 1].trendScore
  const delta = lastTrend - firstTrend
  const trendClass =
    delta > 3 ? styles.trendUp : delta < -3 ? styles.trendDown : styles.trendFlat
  const trendLabel =
    delta > 3
      ? t('studentProfile.charts.trendUp', { delta: Math.round(Math.abs(delta)) })
      : delta < -3
        ? t('studentProfile.charts.trendDown', { delta: Math.round(Math.abs(delta)) })
        : t('studentProfile.charts.trendFlat')

  const gridLines = [0, 25, 50, 75, 100]

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{t('studentProfile.charts.evolution')}</div>
          <div className={styles.subtitle}>{t('studentProfile.charts.evolutionSub')}</div>
        </div>
        <span className={`${styles.trendBadge} ${trendClass}`}>{trendLabel}</span>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: 'var(--color-primary)' }}
          />
          {t('studentProfile.charts.legendScore')}
        </div>
        <div className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{
              background: 'transparent',
              borderTop: '2.5px dashed var(--color-warning)',
              height: 0,
            }}
          />
          {t('studentProfile.charts.legendTrend')}
        </div>
      </div>

      <div className={styles.scroll}>
        <svg
          className={styles.svg}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={t('studentProfile.charts.evolutionAria', {
            count: points.length,
          })}
        >
          <defs>
            <linearGradient id="evolutionAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridLines.map((g) => (
            <g key={g}>
              <line
                className={styles.gridLine}
                x1={PADDING_X - 4}
                x2={width - PADDING_X + 4}
                y1={yFor(g)}
                y2={yFor(g)}
              />
              <text className={styles.axisLabel} x={PADDING_X - 8} y={yFor(g)}>
                {g}%
              </text>
            </g>
          ))}

          <path className={styles.areaPath} d={areaPath} />
          <path className={styles.trendLine} d={trendPath} />
          <path className={styles.line} d={linePath} />

          {points.map((p) => (
            <g key={p.id}>
              <circle
                className={styles.point}
                cx={xFor(p.index)}
                cy={yFor(p.score)}
                r={POINT_RADIUS}
                fill="white"
                stroke={p.subjectColor}
                strokeWidth={2.5}
                vectorEffect="non-scaling-stroke"
                style={{ animationDelay: `${p.index * 80}ms` }}
              >
                <title>
                  {shortDate(p.date)} · {p.subjectTitle} · {p.score}%
                </title>
              </circle>
              <text
                className={styles.xLabel}
                x={xFor(p.index)}
                y={height - 12}
                style={{ animationDelay: `${p.index * 80}ms` }}
              >
                {shortDate(p.date)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

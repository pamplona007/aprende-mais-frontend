import { IslandTile } from './IslandTile'
import type { Subject } from '../types'
import styles from './JourneyTrack.module.css'

interface JourneyTrackProps {
  subjects: Subject[]
  onIslandClick: (subject: Subject) => void
}

export function JourneyTrack({ subjects, onIslandClick }: JourneyTrackProps) {
  const trackHeight = Math.max(subjects.length, 1) * 184
  const pathPoints = subjects.map((_, index) => ({
    x: 50 + Math.sin(index * 1.35) * 15,
    y: index * 184 + 92,
  }))
  const path = createPath(pathPoints)

  return (
    <div className={styles.track} style={{ height: `${trackHeight}px` }}>
      <div className={styles.oceanBackdrop} aria-hidden="true">
        <div className={styles.sunbeam} />
        <div className={`${styles.wave} ${styles.waveBack}`} />
        <div className={`${styles.wave} ${styles.waveFront}`} />
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className={styles.bubble}
            style={{
              left: `${8 + ((index * 29) % 84)}%`,
              top: `${4 + ((index * 37) % 91)}%`,
              width: `${8 + (index % 4) * 4}px`,
              height: `${8 + (index % 4) * 4}px`,
              animationDelay: `${-(index * 1.7)}s`,
              animationDuration: `${8 + (index % 3) * 2}s`,
            }}
          />
        ))}
      </div>
      <svg
        className={styles.terrain}
        viewBox={`0 0 100 ${trackHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="journey-path-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1cb0f6" />
            <stop offset="52%" stopColor="#58cc02" />
            <stop offset="100%" stopColor="#ff9600" />
          </linearGradient>
        </defs>
        <path className={styles.terrainPathShadow} d={path} />
        <path className={styles.terrainPath} d={path} />
      </svg>
      {subjects.map((subject, idx) => (
        <IslandRow
          key={subject.id}
          subject={subject}
          index={idx}
          pathPoint={pathPoints[idx]}
          onClick={onIslandClick}
        />
      ))}
    </div>
  )
}

function IslandRow({
  subject,
  index,
  pathPoint,
  onClick,
}: {
  subject: Subject
  index: number
  pathPoint: { x: number; y: number } | undefined
  onClick: (s: Subject) => void
}) {
  const x = pathPoint?.x ?? 50
  const y = pathPoint?.y ?? index * 184 + 92
  const rowStyle = {
    left: `${x}%`,
    top: `${y - 75}px`,
    animationDelay: `${index * 80}ms`,
  }

  return (
    <div className={styles.row} style={rowStyle}>
      <IslandTile
        subject={subject}
        onClick={subject.status === 'LOCKED' ? undefined : () => onClick(subject)}
        delayMs={index * 80}
      />
    </div>
  )
}

function createPath(points: Array<{ x: number; y: number }>) {
  const first = points[0]
  if (!first) return ''

  let path = `M ${first.x} ${first.y}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const start = points[index]
    const end = points[index + 1]
    const next = points[index + 2] ?? end
    if (!previous || !start || !end || !next) continue

    const controlStart = {
      x: start.x + (end.x - previous.x) / 6,
      y: start.y + (end.y - previous.y) / 6,
    }
    const controlEnd = {
      x: end.x - (next.x - start.x) / 6,
      y: end.y - (next.y - start.y) / 6,
    }

    path += ` C ${controlStart.x} ${controlStart.y} ${controlEnd.x} ${controlEnd.y} ${end.x} ${end.y}`
  }

  return path
}

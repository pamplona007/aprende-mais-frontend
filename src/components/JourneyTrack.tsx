import type { Subject } from '../types'
import { IslandTile } from './IslandTile'
import styles from './JourneyTrack.module.css'

interface JourneyTrackProps {
  subjects: Subject[]
  onIslandClick: (subject: Subject) => void
}

// Lays out subjects in alternating left/right zig-zag (Duolingo style).
// First subject always goes left (or center if odd count), then alternates.
export function JourneyTrack({ subjects, onIslandClick }: JourneyTrackProps) {
  return (
    <div className={styles.track}>
      <Curves count={subjects.length} />
      {subjects.map((subject, idx) => (
        <IslandRow key={subject.id} subject={subject} index={idx} onClick={onIslandClick} />
      ))}
    </div>
  )
}

function IslandRow({
  subject,
  index,
  onClick,
}: {
  subject: Subject
  index: number
  onClick: (s: Subject) => void
}) {
  // Pattern: left, right, left, right, ... center for the 1st if odd
  const position =
    index === 0
      ? 'left'
      : index === 1
        ? 'right'
        : index % 2 === 1
          ? 'right'
          : 'left'

  const rowClass =
    position === 'left'
      ? `${styles.row} ${styles.rowLeft}`
      : position === 'right'
        ? `${styles.row} ${styles.rowRight}`
        : styles.rowCenter

  return (
    <div className={rowClass}>
      <IslandTile
        subject={subject}
        onClick={subject.status === 'LOCKED' ? undefined : () => onClick(subject)}
        delayMs={index * 80}
      />
    </div>
  )
}

function Curves({ count }: { count: number }) {
  // Each row is ~160px tall. Generate SVG that draws zig-zag curves
  // connecting each island's approximate position. Coarse but readable.
  const rowHeight = 160
  const totalHeight = count * rowHeight
  const svgWidth = 800

  const paths: string[] = []
  for (let i = 0; i < count - 1; i++) {
    const y1 = i * rowHeight + 70
    const y2 = (i + 1) * rowHeight + 70
    // Alternate start/end side: left, right, left, right
    const startLeft = i % 2 === 0
    const endLeft = !startLeft
    const x1 = startLeft ? 160 : svgWidth - 160
    const x2 = endLeft ? 160 : svgWidth - 160
    const midX = svgWidth / 2
    const midY = (y1 + y2) / 2
    paths.push(`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`)
  }

  return (
    <svg className={styles.curves} viewBox={`0 0 ${svgWidth} ${totalHeight}`} preserveAspectRatio="none">
      {paths.map((d, i) => (
        <path key={i} d={d} className={styles.curvePath} />
      ))}
    </svg>
  )
}

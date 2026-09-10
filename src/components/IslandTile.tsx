import type { Subject } from '../types'
import { SubjectIcon } from './SubjectIcon'
import styles from './IslandTile.module.css'

interface IslandTileProps {
  subject: Subject
  onClick?: () => void
  /** Animation delay in ms — used by JourneyTrack to stagger entries. */
  delayMs?: number
}

export function IslandTile({ subject, onClick, delayMs = 0 }: IslandTileProps) {
  const isLocked = subject.status === 'LOCKED'
  const className = [
    styles.tile,
    isLocked ? styles.locked : null,
    onClick === undefined && !isLocked ? styles.disabled : null,
  ]
    .filter(Boolean)
    .join(' ')

  const style = {
    animationDelay: `${delayMs}ms`,
    ['--tile-color' as string]: isLocked ? undefined : subject.color,
    ['--tile-color-shadow' as string]: isLocked ? undefined : shade(subject.color, -0.15),
  } as React.CSSProperties

  const stars = [0, 1, 2].map((i) => (
    <span
      key={i}
      className={`${styles.star} ${i < subject.stars ? styles.starOn : styles.starOff}`}
      aria-hidden="true"
    >
      ★
    </span>
  ))

  const content = (
    <>
      <div className={styles.card}>
        <div className={styles.deck} />
        <div className={styles.iconBox}>
          <SubjectIcon iconKey={subject.iconKey} />
        </div>
        {isLocked && (
          <div className={styles.lockIcon} aria-hidden="true">
            🔒
          </div>
        )}
      </div>
      <div className={styles.stars} aria-label={`${subject.stars} estrelas`}>
        {stars}
      </div>
    </>
  )

  if (isLocked || !onClick) {
    return (
      <div className={className} style={style} aria-disabled={isLocked}>
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      aria-label={`Começar lição de ${subject.title}`}
    >
      {content}
    </button>
  )
}

// Darken a hex color by mixing toward black by the given amount (0–1).
function shade(hex: string, amount: number): string {
  const m = hex.replace('#', '').match(/.{1,2}/g)
  if (!m) return hex
  const [r, g, b] = m.map((h) => parseInt(h, 16))
  const mix = (c: number) => Math.max(0, Math.min(255, Math.round(c * (1 + amount))))
  return `rgb(${mix(r ?? 0)}, ${mix(g ?? 0)}, ${mix(b ?? 0)})`
}

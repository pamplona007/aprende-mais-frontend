import type { Subject } from '../types'
import { SubjectIcon } from './SubjectIcon'
import styles from './IslandTile.module.css'

interface IslandTileProps {
  subject: Subject
  onClick?: () => void
  delayMs?: number
}

export function IslandTile({ subject, onClick, delayMs = 0 }: IslandTileProps) {
  const isLocked = subject.status === 'LOCKED'
  const isCompleted = subject.status === 'COMPLETED'
  const className = [
    styles.tile,
    isLocked ? styles.locked : null,
    isCompleted ? styles.completed : null,
  ].filter(Boolean).join(' ')

  const baseColor = isLocked ? '#8a96a8' : subject.color
  const lighterColor = isLocked ? '#d4dbe6' : shade(subject.color, 0.2)
  const shadowColor = isLocked ? '#a4afc0' : shade(subject.color, -0.25)
  const rotation = tileRotation(subject.id)

  const style = {
    animationDelay: `${delayMs}ms`,
    ['--tile-delay' as string]: `${delayMs}ms`,
    ['--tile-rotation' as string]: `${rotation}deg`,
    ['--tile-color' as string]: baseColor,
    ['--tile-color-light' as string]: lighterColor,
    ['--tile-color-shadow' as string]: shadowColor,
  } as React.CSSProperties

  const stars = [0, 1, 2].map((i) => (
    <span
      key={i}
      className={`${styles.star} ${i < subject.stars ? styles.starOn : styles.starOff}`}
      aria-hidden="true"
    />
  ))

  const cardContent = (
    <>
      <div className={styles.bob}>
        <div className={styles.card}>
          <div className={styles.topFace} />
          <div className={styles.bottomFace} />
          <div className={styles.iconBox}>
            <SubjectIcon iconKey={subject.iconKey} />
          </div>
        </div>
      </div>
      {isCompleted && (
        <>
          <div className={styles.stars} aria-label={`${subject.stars} estrelas`}>
            {stars}
          </div>
        </>
      )}
    </>
  )

  if (isLocked || !onClick) {
    return (
      <div className={className} style={style} aria-disabled={isLocked}>
        {cardContent}
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
      {cardContent}
    </button>
  )
}

function shade(hex: string, amount: number): string {
  const m = hex.replace('#', '').match(/.{1,2}/g)
  if (!m) return hex
  const [r, g, b] = m.map((h) => parseInt(h, 16))
  const mix = (c: number) => Math.max(0, Math.min(255, Math.round(c * (1 + amount))))
  return `rgb(${mix(r ?? 0)}, ${mix(g ?? 0)}, ${mix(b ?? 0)})`
}

function tileRotation(id: string): number {
  const hash = Array.from(id).reduce((total, character) => total + character.charCodeAt(0), 0)
  return (hash % 7) - 3
}

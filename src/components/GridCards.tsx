import type { CSSProperties, HTMLAttributes } from 'react'
import styles from './GridCards.module.css'

interface GridCardsProps extends HTMLAttributes<HTMLDivElement> {
  /** Min width of each card. Default 260px. */
  minCardWidth?: number
  /** Gap between cards. Default var(--space-4) (16px). */
  gap?: string
}

/** Auto-fill grid of cards. */
export function GridCards({ minCardWidth = 260, gap, className, style, children, ...rest }: GridCardsProps) {
  const composedStyle: CSSProperties = {
    ...style,
    gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
    ...(gap ? { gap } : null),
  }
  return (
    <div {...rest} className={[styles.grid, className].filter(Boolean).join(' ')} style={composedStyle}>
      {children}
    </div>
  )
}

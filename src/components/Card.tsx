import type { ReactNode } from 'react'
import styles from './Card.module.css'

type Variant = 'default' | 'muted'

interface CardProps {
  variant?: Variant
  /** Optional uppercase title rendered at the top. */
  title?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ variant = 'default', title, children, className }: CardProps) {
  const classes = [styles.card, variant === 'muted' && styles.muted, className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={classes}>
      {title && <div className={styles.title}>{title}</div>}
      {children}
    </div>
  )
}

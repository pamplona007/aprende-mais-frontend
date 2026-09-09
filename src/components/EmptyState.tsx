import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  title: ReactNode
  children?: ReactNode
  /** Optional action area below the body (e.g. a Button). */
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, children, action, className }: EmptyStateProps) {
  return (
    <div className={[styles.empty, className].filter(Boolean).join(' ')}>
      <div className={styles.title}>{title}</div>
      {children && <p className={styles.body}>{children}</p>}
      {action && <div className={styles.actions}>{action}</div>}
    </div>
  )
}

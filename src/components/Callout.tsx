import type { ReactNode } from 'react'
import styles from './Callout.module.css'

type Tone = 'info' | 'warning' | 'danger'

interface CalloutProps {
  tone?: Tone
  children: ReactNode
  role?: string
  className?: string
}

export function Callout({ tone = 'info', children, role, className }: CalloutProps) {
  return (
    <div
      role={role}
      className={[styles.callout, styles[tone], className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}

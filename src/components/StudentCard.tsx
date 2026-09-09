import { Link } from 'react-router'
import type { ReactNode } from 'react'
import type { UserSummary } from '../types'
import { Avatar } from './Avatar'
import styles from './StudentCard.module.css'

interface BaseProps {
  user: UserSummary
  meta?: ReactNode
  bottom?: ReactNode
  /** When set, the card is rendered as a Link to this href. */
  href?: string
  /** Renders a non-interactive card (no link, no onClick). */
  static?: boolean
  selected?: boolean
  onClick?: () => void
  /** Override the default "View profile →" footer action. */
  footer?: ReactNode
}

export function StudentCard({
  user,
  meta,
  bottom,
  href,
  static: isStatic,
  selected,
  onClick,
  footer,
}: BaseProps) {
  const className = [
    styles.card,
    selected ? styles.cardSelected : null,
    isStatic ? styles.cardStatic : null,
  ]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      <div className={styles.cardRow}>
        <Avatar user={user} />
        <div>
          <div className={styles.name}>{user.displayName}</div>
          <div className={styles.meta}>{user.email}</div>
        </div>
      </div>
      {bottom}
      {meta && <div className={styles.meta}>{meta}</div>}
      {footer && <div className={styles.actions}>{footer}</div>}
    </>
  )

  if (isStatic) {
    return <div className={className}>{body}</div>
  }
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {body}
      </button>
    )
  }
  if (href) {
    return (
      <Link to={href} className={className}>
        {body}
      </Link>
    )
  }
  return <div className={className}>{body}</div>
}

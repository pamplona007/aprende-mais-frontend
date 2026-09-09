import { Link } from 'react-router'
import type { ReactNode } from 'react'
import type { UserSummary } from '../types'
import { Avatar } from './Avatar'
import styles from './StudentCard.module.css'

interface BaseProps {
  user: UserSummary
  meta?: ReactNode
  bottom?: ReactNode
  href?: string
  static?: boolean
  selected?: boolean
  onClick?: () => void
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
        <div className={styles.cardMain}>
          <div className={styles.name}>{user.displayName}</div>
          <div className={styles.meta}>{user.email}</div>
        </div>
        {meta && <div className={styles.statusCorner}>{meta}</div>}
      </div>
      {bottom}
      {footer && <div className={styles.footer}>{footer}</div>}
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

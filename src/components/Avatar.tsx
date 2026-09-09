import type { UserSummary } from '../types'
import styles from './Avatar.module.css'

interface AvatarProps {
  user: Pick<UserSummary, 'displayName'>
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ user, size = 'md' }: AvatarProps) {
  const initials = user.displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const sizeClass =
    size === 'sm' ? styles.avatarSm : size === 'lg' ? styles.avatarLg : styles.avatarMd

  return (
    <div className={`${styles.avatar} ${sizeClass}`} aria-hidden="true">
      {initials}
    </div>
  )
}

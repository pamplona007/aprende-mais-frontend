import type { UserSummary } from '../types'

interface AvatarProps {
  user: Pick<UserSummary, 'displayName'>
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: { box: 32, fontSize: '0.85rem' },
  md: { box: 48, fontSize: '1.1rem' },
  lg: { box: 72, fontSize: '1.6rem' },
}

export function Avatar({ user, size = 'md' }: AvatarProps) {
  const initials = user.displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const { box, fontSize } = SIZES[size]
  return (
    <div
      className="student-card__avatar"
      style={{ width: box, height: box, fontSize }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

import type { UserSummary } from '../types'

export function postLoginPath(user: UserSummary): string {
  return user.role === 'TEACHER' ? `/teacher/${user.id}` : `/student/${user.id}`
}

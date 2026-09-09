// Tiny derivation: where to send the user after they sign in.
// Kept in its own file (not AuthProvider.tsx) so Fast Refresh doesn't choke on
// the module mixing components and non-component exports.
import type { UserSummary } from '../types'

export function postLoginPath(user: UserSummary): string {
  return user.role === 'TEACHER' ? `/teacher/${user.id}` : `/student/${user.id}`
}

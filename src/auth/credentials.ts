// Hardcoded credentials used by the demo login flow.
// In production this would be replaced with a real auth backend (sessions,
// bcrypt-hashed passwords, rate limiting, etc.). Keeping the array in its own
// file lets Fast Refresh stay happy in AuthProvider.tsx (component-only).

export interface Credential {
  email: string
  password: string
  userId: string
}

export const CREDENTIALS: Credential[] = [
  { email: 'paula@aprende.mais', password: 'teacher123', userId: 't_paula' },
  { email: 'ana@aprende.mais', password: 'student123', userId: 's_ana' },
]

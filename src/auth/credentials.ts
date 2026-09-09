export interface Credential {
  email: string
  password: string
  userId: string
}

export const CREDENTIALS: Credential[] = [
  { email: 'paula@aprende.mais', password: 'teacher123', userId: 't_paula' },
  { email: 'ana@aprende.mais', password: 'student123', userId: 's_ana' },
]

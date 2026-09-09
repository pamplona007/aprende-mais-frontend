import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserSummary } from '../types'
import { getUserById } from '../mocks'
import { CREDENTIALS } from './credentials'

const STORAGE_KEY = 'aprende-mais:auth'

function loadFromStorage(): UserSummary | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { userId: string }
    return getUserById(parsed.userId) ?? null
  } catch {
    return null
  }
}

function saveToStorage(userId: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId }))
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export type LoginError = 'invalid_credentials' | 'unknown'

export interface AuthContextValue {
  currentUser: UserSummary | null
  login: (email: string, password: string) => { ok: true } | { ok: false; error: LoginError }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(loadFromStorage)

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCurrentUser(loadFromStorage())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = useCallback<AuthContextValue['login']>((email, password) => {
    const trimmed = email.trim().toLowerCase()
    const match = CREDENTIALS.find(
      (c) => c.email.toLowerCase() === trimmed && c.password === password,
    )
    if (!match) return { ok: false, error: 'invalid_credentials' }
    const user = getUserById(match.userId)
    if (!user) return { ok: false, error: 'unknown' }
    saveToStorage(user.id)
    setCurrentUser(user)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    clearStorage()
    setCurrentUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ currentUser, login, logout }),
    [currentUser, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

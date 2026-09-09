import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { postLoginPath } from '../auth/postLoginPath'
import { useAuth, type LoginError } from '../auth/AuthProvider'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { Callout } from '../components/Callout'
import { Row } from '../components/Row'
import styles from './auth.module.css'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// Hardcoded credentials shown as a hint in the demo. Hidden in production.
const DEMO_HINTS: { role: 'Teacher' | 'Student'; email: string; password: string }[] = [
  { role: 'Teacher', email: 'paula@aprende.mais', password: 'teacher123' },
  { role: 'Student', email: 'ana@aprende.mais', password: 'student123' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, login } = useAuth()
  const [authError, setAuthError] = useState<LoginError | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const emailValue = watch('email')

  // If the user is already signed in, bounce them out of the login page.
  useEffect(() => {
    if (currentUser) navigate(postLoginPath(currentUser), { replace: true })
  }, [currentUser, navigate])

  const onSubmit = handleSubmit((values) => {
    setAuthError(null)
    const result = login(values.email, values.password)
    if (!result.ok) {
      setAuthError(result.error)
      return
    }
    const destination = (location.state as { from?: string } | null)?.from ?? null
    navigate(destination ?? postLoginPath(currentUser!), { replace: true })
  })

  const fillDemoCredentials = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true })
    setValue('password', password, { shouldValidate: true })
  }

  // react-hook-form's register() returns { onChange, onBlur, ref, name }.
  // Field.inputProps forwards those onto the underlying <input>.
  const emailReg = register('email')
  const passwordReg = register('password')

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 style={{ marginBottom: 4 }}>
            Aprende<span style={{ color: 'var(--color-primary)' }}>+</span>
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            Sign in to your account
          </p>
        </header>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Field
            label="Email"
            error={errors.email?.message}
            inputProps={{
              type: 'email',
              autoComplete: 'email',
              name: emailReg.name,
              ref: emailReg.ref,
              onChange: emailReg.onChange,
              onBlur: emailReg.onBlur,
            }}
          />
          <Field
            label="Password"
            error={errors.password?.message}
            inputProps={{
              type: 'password',
              autoComplete: 'current-password',
              name: passwordReg.name,
              ref: passwordReg.ref,
              onChange: passwordReg.onChange,
              onBlur: passwordReg.onBlur,
            }}
          />

          {authError === 'invalid_credentials' && (
            <Callout tone="warning" role="alert">
              Wrong email or password. Try the demo credentials below.
            </Callout>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Sign in
          </Button>
        </form>

        <footer className={styles.footer}>
          <p className="muted tiny" style={{ marginBottom: 'var(--space-2)' }}>
            Demo credentials (click to autofill):
          </p>
          <Row gap="sm" className={styles.demoList} align="stretch">
            {DEMO_HINTS.map((hint) => (
              <button
                key={hint.email}
                type="button"
                className={styles.demoChip}
                onClick={() => fillDemoCredentials(hint.email, hint.password)}
              >
                <strong>{hint.role}</strong>
                <span className="muted tiny">{hint.email}</span>
              </button>
            ))}
          </Row>
          <p className="muted tiny" style={{ marginTop: 'var(--space-4)', marginBottom: 0 }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary-strong)' }}>
              Create an account
            </Link>
          </p>
          {emailValue && (
            <p className={styles.typingHint}>
              Currently typing: <code>{emailValue}</code>
            </p>
          )}
        </footer>
      </div>
    </div>
  )
}

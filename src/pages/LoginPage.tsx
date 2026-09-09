import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { postLoginPath } from '../auth/postLoginPath'
import { useAuth, type LoginError } from '../auth/AuthProvider'
import { CREDENTIALS } from '../auth/credentials'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { Callout } from '../components/Callout'
import { Row } from '../components/Row'
import styles from './auth.module.css'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, login } = useAuth()
  const [authError, setAuthError] = useState<LoginError | null>(null)

  const loginSchema = z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: z.string().min(1, t('validation.passwordRequired')),
  })
  type LoginFormValues = z.infer<typeof loginSchema>

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

  const emailReg = register('email')
  const passwordReg = register('password')

  const demoHints = CREDENTIALS.map((c) => ({
    role: c.userId.startsWith('t_') ? t('auth.teacher') : t('auth.student'),
    email: c.email,
    password: c.password,
  }))

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 style={{ marginBottom: 4 }}>
            Aprende<span style={{ color: 'var(--color-primary)' }}>+</span>
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            {t('auth.loginTitle')}
          </p>
        </header>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Field
            label={t('auth.emailLabel')}
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
            label={t('auth.passwordLabel')}
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
              {t('auth.invalidCredentials')}
            </Callout>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {t('auth.submitLogin')}
          </Button>
        </form>

        <footer className={styles.footer}>
          <p className="muted tiny" style={{ marginBottom: 'var(--space-2)' }}>
            {t('auth.demoHint')}
          </p>
          <Row gap="sm" className={styles.demoList} align="stretch">
            {demoHints.map((hint) => (
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
            {t('auth.newHere')}{' '}
            <Link to="/register" style={{ color: 'var(--color-primary-strong)' }}>
              {t('auth.createAccount')}
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}

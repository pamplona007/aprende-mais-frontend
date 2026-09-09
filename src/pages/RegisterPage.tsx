import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '../components/EmptyState'
import styles from './auth.module.css'

export function RegisterPage() {
  const { t } = useTranslation()
  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 style={{ marginBottom: 4 }}>
            Aprende<span style={{ color: 'var(--color-primary)' }}>+</span>
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            {t('auth.registerTitle')}
          </p>
        </header>

        <div className={styles.form}>
          <EmptyState
            title={t('auth.registerComingSoon')}
            action={
              <Link to="/login" className="muted">
                {t('auth.goToLogin')}
              </Link>
            }
          >
            {t('auth.registerComingSoonBody')}
          </EmptyState>
        </div>

        <footer className={styles.footer}>
          <p className="muted tiny" style={{ margin: 0 }}>
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" style={{ color: 'var(--color-primary-strong)' }}>
              {t('auth.signIn')}
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}

import { Link } from 'react-router'
import styles from './auth.module.css'

export function RegisterPage() {
  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 style={{ marginBottom: 4 }}>
            Aprende<span style={{ color: 'var(--color-primary)' }}>+</span>
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            Create your account
          </p>
        </header>

        <div className={styles.form}>
          <div className="empty-state" style={{ marginBottom: 0 }}>
            <div className="empty-state__title">Registration coming soon</div>
            <p>For this demo, please use one of the demo accounts on the login page.</p>
          </div>
        </div>

        <footer className={styles.footer}>
          <p className="muted tiny" style={{ margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary-strong)' }}>
              Sign in
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}

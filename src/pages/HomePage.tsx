import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthProvider'
import { postLoginPath } from '../auth/postLoginPath'
import { Button } from '../components/Button'
import styles from './HomePage.module.css'

export function HomePage() {
  const { t } = useTranslation()
  const { currentUser } = useAuth()

  if (currentUser) return <Navigate to={postLoginPath(currentUser)} replace />

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <h1 className={styles.brand}>
          Aprende<span style={{ color: 'var(--color-primary)' }}>+</span>
        </h1>
        <p className={styles.tagline}>{t('home.hero')}</p>
        <div className={styles.cta}>
          <Button to="/login">{t('home.ctaLogin')}</Button>
          <Button to="/register" variant="ghost">
            {t('home.ctaRegister')}
          </Button>
        </div>
      </section>
    </div>
  )
}

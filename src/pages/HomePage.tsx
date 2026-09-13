import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthProvider'
import { postLoginPath } from '../auth/postLoginPath'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import styles from './HomePage.module.css'

export function HomePage() {
  const { t } = useTranslation()
  const { currentUser } = useAuth()

  if (currentUser) return <Navigate to={postLoginPath(currentUser)} replace />

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <img src="/logo.svg" alt="AVIBI" className={styles.brandLogo} />
        <p className={styles.tagline}>{t('home.hero')}</p>
        <div className={styles.cta}>
          <Button to="/login" aria-label={t('home.ctaLogin')}>
            <Icon name="arrow-right" size={22} />
          </Button>
          <Button to="/register" variant="ghost" aria-label={t('home.ctaRegister')}>
            <Icon name="plus" size={22} />
          </Button>
        </div>
      </section>
    </div>
  )
}

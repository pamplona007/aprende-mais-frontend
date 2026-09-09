import { Navigate } from 'react-router'
import { useAuth } from '../auth/AuthProvider'
import { postLoginPath } from '../auth/postLoginPath'
import { Button } from '../components/Button'
import styles from './HomePage.module.css'

export function HomePage() {
  const { currentUser } = useAuth()

  // If already signed in, skip the landing and go straight to the user's area.
  if (currentUser) return <Navigate to={postLoginPath(currentUser)} replace />

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <h1>
          Aprende<span style={{ color: 'var(--color-primary)' }}>+</span>
        </h1>
        <p className={styles.tagline}>
          A learning platform for children with learning difficulties.
        </p>
        <div className={styles.cta}>
          <Button to="/login">Login</Button>
          <Button to="/register" variant="ghost">
            Register
          </Button>
        </div>
      </section>
    </div>
  )
}

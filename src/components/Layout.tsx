import { Link, NavLink, useNavigate, Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthProvider'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Icon } from './Icon'
import styles from './Layout.module.css'

export function Layout() {
  const { t } = useTranslation()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand} aria-label="AVIBI">
          <img src="/logo.svg" alt="AVIBI" className={styles.logo} />
        </Link>

        <nav className={styles.nav}>
          {currentUser ? (
            <>
              {currentUser.role === 'TEACHER' && (
                <NavLink
                  to={`/teacher/${currentUser.id}`}
                  className={({ isActive }) =>
                    `${styles.navIconLink} ${isActive ? styles.navIconLinkActive : ''}`
                  }
                  aria-label={t('nav.teacherArea')}
                >
                  <Icon name="sparkles" size={20} />
                </NavLink>
              )}
              {currentUser.role === 'STUDENT' && (
                <NavLink
                  to={`/student/${currentUser.id}`}
                  className={({ isActive }) =>
                    `${styles.navIconLink} ${isActive ? styles.navIconLinkActive : ''}`
                  }
                  aria-label={t('nav.studentArea')}
                >
                  <Icon name="sparkles" size={20} />
                </NavLink>
              )}
              <div className={styles.userBlock}>
                <Avatar user={currentUser} size="sm" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                aria-label={t('nav.logout')}
              >
                <Icon name="logout" size={18} />
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={styles.navIconLink}
                aria-label={t('nav.login')}
              >
                <Icon name="arrow-right" size={20} />
              </NavLink>
              <NavLink
                to="/register"
                className={styles.navIconLink}
                aria-label={t('nav.register')}
              >
                <Icon name="plus" size={20} />
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

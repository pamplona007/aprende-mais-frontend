import { Link, NavLink, useNavigate, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthProvider'
import { Avatar } from './Avatar'
import { Button } from './Button'
import styles from './Layout.module.css'

export function Layout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>A+</span>
          Aprende+
        </Link>

        <nav className={styles.nav}>
          {currentUser ? (
            <>
              {currentUser.role === 'TEACHER' && (
                <NavLink
                  to={`/teacher/${currentUser.id}`}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  Teacher area
                </NavLink>
              )}
              {currentUser.role === 'STUDENT' && (
                <NavLink
                  to={`/student/${currentUser.id}`}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  Student area
                </NavLink>
              )}
              <div className={styles.userBlock}>
                <Avatar user={currentUser} size="sm" />
                <div className={styles.userMeta}>
                  <span className={styles.userName}>{currentUser.displayName}</span>
                  <span className={styles.userRole}>{currentUser.role}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={styles.navLink}>
                Login
              </NavLink>
              <NavLink to="/register" className={styles.navLink}>
                Register
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

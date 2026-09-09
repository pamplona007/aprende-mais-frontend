import { Link, NavLink, Outlet } from 'react-router'
import { getUserById } from '../mocks'

export function Layout() {
  // For now we hard-code the "current user" as Paula. Later this will come from auth.
  const me = getUserById('t_paula')

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <Link to="/" className="app-shell__brand" style={{ textDecoration: 'none' }}>
          <span className="app-shell__brand-mark">A+</span>
          Aprende+
        </Link>
        <nav className="app-shell__nav">
          {me?.role === 'TEACHER' && (
            <NavLink to={`/teacher/${me.id}`} className="btn btn--ghost btn--small">
              Teacher area
            </NavLink>
          )}
          {me && (
            <span className="muted tiny">
              Logged in as <strong>{me.displayName}</strong>
            </span>
          )}
        </nav>
      </header>
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  )
}

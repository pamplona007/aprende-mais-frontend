import { Link } from 'react-router'
import { mockUsers } from '../mocks'

export function HomePage() {
  const teachers = mockUsers.filter((u) => u.role === 'TEACHER')
  const students = mockUsers.filter((u) => u.role === 'STUDENT')

  return (
    <div className="stack stack--lg">
      <section className="page-header">
        <h1>Aprende+</h1>
        <p>
          A learning platform for children with learning difficulties. Pick a teacher to enter
          the teacher area and manage students.
        </p>
      </section>

      <section className="stack">
        <h2>Teachers</h2>
        <div className="grid-cards">
          {teachers.map((t) => (
            <Link key={t.id} to={`/teacher/${t.id}`} className="student-card">
              <div className="row">
                <div className="student-card__avatar">
                  {t.displayName
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="student-card__name">{t.displayName}</div>
                  <div className="student-card__meta">{t.email}</div>
                </div>
              </div>
              <div className="student-card__meta">
                Joined {new Date(t.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="stack">
        <h2>Students in the system</h2>
        <div className="grid-cards">
          {students.map((s) => (
            <div key={s.id} className="student-card" style={{ cursor: 'default' }}>
              <div className="row">
                <div className="student-card__avatar">
                  {s.displayName
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="student-card__name">{s.displayName}</div>
                  <div className="student-card__meta">{s.email}</div>
                </div>
              </div>
              {s.birthDate && (
                <div className="student-card__meta">
                  Born {new Date(s.birthDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

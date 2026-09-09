import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getUserById } from '../mocks'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { Stack } from '../components/Stack'
import styles from './StudentDashboard.module.css'

export function StudentDashboard() {
  const { t } = useTranslation()
  const { studentId } = useParams<{ studentId: string }>()
  const student = studentId ? getUserById(studentId) : undefined

  if (!student) {
    return (
      <Stack gap="md">
        <EmptyState
          title={t('studentDashboard.notFound')}
          action={
            <Button to="/" variant="ghost">
              {t('teacherDashboard.goHome')}
            </Button>
          }
        />
      </Stack>
    )
  }

  return (
    <Stack gap="lg">
      <section className="page-header">
        <div className="page-header__crumbs">
          <Link to="/">{t('studentDashboard.crumbsHome')}</Link> ·{' '}
          {t('studentDashboard.crumbsArea')}
        </div>
        <h1 className={styles.hello}>
          {t('studentDashboard.hello', { name: student.displayName.split(' ')[0] })}
        </h1>
        <p>{t('studentDashboard.subtitle')}</p>
      </section>

      <EmptyState
        title={t('studentDashboard.comingSoon')}
        action={
          <Link to="/" className="muted">
            {t('studentDashboard.backHome')}
          </Link>
        }
      >
        {t('studentDashboard.comingSoonBody')}
      </EmptyState>
    </Stack>
  )
}

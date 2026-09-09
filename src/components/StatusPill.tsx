import { useTranslation } from 'react-i18next'
import type { TeachingRelationshipStatus } from '../types'
import styles from './StatusPill.module.css'

const STATUS_KEY: Record<TeachingRelationshipStatus, string> = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  REVOKED_BY_TEACHER: 'REVOKED_BY_TEACHER',
  REVOKED_BY_STUDENT: 'REVOKED_BY_STUDENT',
}

const CLASS_FOR: Record<TeachingRelationshipStatus, string> = {
  PENDING: styles.pending,
  ACCEPTED: styles.accepted,
  DECLINED: styles.declined,
  REVOKED_BY_TEACHER: styles.revoked,
  REVOKED_BY_STUDENT: styles.revoked,
}

export function StatusPill({ status }: { status: TeachingRelationshipStatus }) {
  const { t } = useTranslation()
  return (
    <span className={`${styles.pill} ${CLASS_FOR[status]}`}>
      {t(`status.${STATUS_KEY[status]}`)}
    </span>
  )
}

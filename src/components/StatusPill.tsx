import type { TeachingRelationshipStatus } from '../types'
import styles from './StatusPill.module.css'

const LABELS: Record<TeachingRelationshipStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Active',
  DECLINED: 'Declined',
  REVOKED_BY_TEACHER: 'Withdrawn',
  REVOKED_BY_STUDENT: 'Revoked',
}

const CLASS_FOR: Record<TeachingRelationshipStatus, string> = {
  PENDING: styles.pending,
  ACCEPTED: styles.accepted,
  DECLINED: styles.declined,
  REVOKED_BY_TEACHER: styles.revoked,
  REVOKED_BY_STUDENT: styles.revoked,
}

export function StatusPill({ status }: { status: TeachingRelationshipStatus }) {
  return <span className={`${styles.pill} ${CLASS_FOR[status]}`}>{LABELS[status]}</span>
}

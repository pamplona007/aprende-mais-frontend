import type { TeachingRelationshipStatus } from '../types'

const LABELS: Record<TeachingRelationshipStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Active',
  DECLINED: 'Declined',
  REVOKED_BY_TEACHER: 'Withdrawn',
  REVOKED_BY_STUDENT: 'Revoked',
}

const CLASSES: Record<TeachingRelationshipStatus, string> = {
  PENDING: 'pill pill--pending',
  ACCEPTED: 'pill pill--accepted',
  DECLINED: 'pill pill--declined',
  REVOKED_BY_TEACHER: 'pill pill--revoked',
  REVOKED_BY_STUDENT: 'pill pill--revoked',
}

export function StatusPill({ status }: { status: TeachingRelationshipStatus }) {
  return <span className={CLASSES[status]}>{LABELS[status]}</span>
}

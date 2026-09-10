import type { IconKey } from '../types'
import styles from './SubjectIcon.module.css'

interface SubjectIconProps {
  iconKey: IconKey
  color?: string
}

// Minimal, friendly line icons — drawn at 48×48, currentColor + optional accent.
function Icon({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color ?? 'currentColor'}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}

export function SubjectIcon({ iconKey, color }: SubjectIconProps) {
  switch (iconKey) {
    case 'chef-hat':
      return (
        <Icon color={color}>
          <path d="M14 20c-3 0-5-2.5-5-5.5S11 9 14 9c.5-3 3.5-5 7-5s6.5 2 7 5c3 0 5 2.5 5 5.5S31 20 28 20" />
          <path d="M14 20h20v6a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" />
          <path d="M19 30v3M29 30v3" />
        </Icon>
      )
    case 'road':
      return (
        <Icon color={color}>
          <path d="M10 8h28" />
          <path d="M14 14h20M16 22h16M14 30h20M10 40h28" />
          <path d="M24 8v4M24 22v4M24 36v4" />
        </Icon>
      )
    case 'school':
      return (
        <Icon color={color}>
          <path d="M6 20l18-10 18 10-18 9z" />
          <path d="M12 23v11l12 6 12-6V23" />
          <path d="M30 27v11" />
        </Icon>
      )
    case 'home':
      return (
        <Icon color={color}>
          <path d="M8 22l16-14 16 14" />
          <path d="M12 20v18h24V20" />
          <path d="M21 38v-10h6v10" />
        </Icon>
      )
    case 'coin':
      return (
        <Icon color={color}>
          <circle cx="24" cy="24" r="16" />
          <path d="M24 14v20M28 18h-6a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-6" />
        </Icon>
      )
    case 'food':
      return (
        <Icon color={color}>
          <path d="M16 8c0 4 2 6 4 6v26" />
          <path d="M24 14c0-3 2-6 4-6v32" />
          <path d="M32 8c0 4-2 6-4 6" />
        </Icon>
      )
    case 'body':
      return (
        <Icon color={color}>
          <circle cx="24" cy="11" r="5" />
          <path d="M24 16v8M14 20l10 4 10-4" />
          <path d="M14 38l10-14 10 14" />
        </Icon>
      )
    case 'bus':
      return (
        <Icon color={color}>
          <rect x="8" y="10" width="32" height="22" rx="3" />
          <circle cx="14" cy="36" r="3" />
          <circle cx="34" cy="36" r="3" />
          <path d="M8 22h32" />
          <path d="M14 16h6M28 16h6" />
        </Icon>
      )
    case 'weather':
      return (
        <Icon color={color}>
          <circle cx="20" cy="22" r="7" />
          <path d="M28 16a8 8 0 1 1 8 8h-2" />
          <path d="M14 32l-2 6M22 32v6M30 32l2 6" />
        </Icon>
      )
    case 'paw':
      return (
        <Icon color={color}>
          <ellipse cx="24" cy="32" rx="10" ry="7" />
          <circle cx="14" cy="20" r="4" />
          <circle cx="34" cy="20" r="4" />
          <circle cx="20" cy="12" r="3.5" />
          <circle cx="28" cy="12" r="3.5" />
        </Icon>
      )
    default:
      return <Icon color={color}><circle cx="24" cy="24" r="14" /></Icon>
  }
}

export default SubjectIcon

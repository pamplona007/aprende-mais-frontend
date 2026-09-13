import styles from './Icon.module.css'

export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'refresh'
  | 'send'
  | 'logout'
  | 'plus'
  | 'close'
  | 'check'
  | 'cross'
  | 'mail'
  | 'sparkles'

interface IconProps {
  name: IconName
  size?: number
}

export function Icon({ name, size = 18 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: styles.icon,
    'aria-hidden': true,
  }

  switch (name) {
    case 'arrow-right':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      )
    case 'arrow-left':
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="M11 18l-6-6 6-6" />
        </svg>
      )
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 0 1 15.5-6.36L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15.5 6.36L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      )
    case 'send':
      return (
        <svg {...common}>
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common}>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )
    case 'cross':
      return (
        <svg {...common}>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 7 9-7" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg {...common}>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
          <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z" />
          <path d="M5 16l.7 2.1L8 19l-2.3.9L5 22l-.7-2.1L2 19l2.3-.9z" />
        </svg>
      )
  }
}

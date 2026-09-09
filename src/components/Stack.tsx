import type { CSSProperties, HTMLAttributes } from 'react'
import styles from './Stack.module.css'

type Gap = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Align = 'start' | 'center' | 'end' | 'stretch'

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap
  align?: Align
}

const GAP_VALUE: Record<Gap, string> = {
  xs: 'var(--space-1)',
  sm: 'var(--space-2)',
  md: 'var(--space-3)',
  lg: 'var(--space-5)',
  xl: 'var(--space-6)',
}

/** Vertical flex container with a configurable gap. */
export function Stack({ gap = 'md', align, className, style, children, ...rest }: StackProps) {
  const composedStyle: CSSProperties = {
    ...style,
    gap: GAP_VALUE[gap],
    ...(align ? { alignItems: alignMap[align] } : null),
  }
  return (
    <div {...rest} className={[styles.stack, className].filter(Boolean).join(' ')} style={composedStyle}>
      {children}
    </div>
  )
}

const alignMap: Record<Align, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
}

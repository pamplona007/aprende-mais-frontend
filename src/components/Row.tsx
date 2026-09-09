import type { CSSProperties, HTMLAttributes } from 'react'
import styles from './Row.module.css'

type Gap = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch'
type Justify = 'start' | 'center' | 'end' | 'between' | 'around'

interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap
  align?: Align
  justify?: Justify
  /** Disable wrapping. Default: true. */
  wrap?: boolean
}

const GAP_VALUE: Record<Gap, string> = {
  xs: 'var(--space-1)',
  sm: 'var(--space-2)',
  md: 'var(--space-3)',
  lg: 'var(--space-5)',
  xl: 'var(--space-6)',
}

const ALIGN_MAP: Record<Align, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',
}

const JUSTIFY_MAP: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
}

/** Horizontal flex container with configurable gap/align/justify/wrap. */
export function Row({
  gap = 'md',
  align = 'center',
  justify,
  wrap = true,
  className,
  style,
  children,
  ...rest
}: RowProps) {
  const composedStyle: CSSProperties = {
    ...style,
    gap: GAP_VALUE[gap],
    alignItems: ALIGN_MAP[align],
    justifyContent: justify ? JUSTIFY_MAP[justify] : undefined,
    flexWrap: wrap ? 'wrap' : 'nowrap',
  }
  return (
    <div {...rest} className={[styles.row, className].filter(Boolean).join(' ')} style={composedStyle}>
      {children}
    </div>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import styles from './Button.module.css'

type Variant = 'primary' | 'ghost' | 'danger'
type Size = 'md' | 'sm'

interface BaseProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

/** A Link that looks like a button. Use for navigation actions. */
interface LinkProps extends BaseProps {
  to: string
  type?: never
  onClick?: never
  disabled?: never
}

/** A native <button>. */
interface NativeProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {}

export type ButtonProps = LinkProps | NativeProps

/**
 * Polymorphic Button — renders as a react-router <Link> when `to` is provided,
 * otherwise a real <button>. Variants: primary (default) | ghost | danger.
 * Sizes: md (default) | sm.
 */
export function Button(props: ButtonProps) {
  const variant: Variant = props.variant ?? 'primary'
  const size: Size = props.size ?? 'md'
  const className = joinClasses(styles.btn, styles[variant], size === 'sm' && styles.small)

  if ('to' in props && props.to !== undefined) {
    return (
      <Link to={props.to} className={className}>
        {props.children}
      </Link>
    )
  }

  const { variant: _v, size: _s, to: _t, children, className: extra, ...rest } =
    props as NativeProps & { to?: undefined; variant?: Variant; size?: Size }
  return (
    <button {...rest} className={joinClasses(className, extra)}>
      {children}
    </button>
  )
}

function joinClasses(...parts: (string | false | undefined | null)[]): string {
  return parts.filter(Boolean).join(' ')
}

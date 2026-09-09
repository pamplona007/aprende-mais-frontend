import type {
  InputHTMLAttributes,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
} from 'react'
import { forwardRef, useId } from 'react'
import styles from './Field.module.css'

interface BaseProps {
  label: ReactNode
  error?: string
  hint?: ReactNode
  className?: string
}

// InputProps is `InputHTMLAttributes` minus `ref`, then we add `ref?: Ref<HTMLInputElement>`
// back as a real prop so callers can pass register's ref directly. Same for textarea.
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'ref'> & {
  ref?: Ref<HTMLInputElement>
}
export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'ref'> & {
  ref?: Ref<HTMLTextAreaElement>
}

interface InputFieldProps extends BaseProps {
  as?: 'input'
  inputProps?: InputProps
}

interface TextareaFieldProps extends BaseProps {
  as: 'textarea'
  inputProps?: TextareaProps
}

/**
 * A labelled form field. Renders the wrapper (label + input + error/hint).
 * Pass the actual input props via `inputProps` — keeps the field dumb while
 * still letting react-hook-form's `register()` drive the input via a ref.
 */
export function Field(props: InputFieldProps | TextareaFieldProps) {
  const generatedId = useId()
  const id = props.inputProps?.id ?? generatedId
  const invalid = Boolean(props.error)
  const inputClass = [
    props.as === 'textarea' ? styles.textarea : styles.input,
    invalid && styles.invalid,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={[styles.field, props.className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={id}>
        {props.label}
      </label>
      {props.as === 'textarea' ? (
        <textarea
          {...(props.inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          id={id}
          aria-invalid={invalid}
          className={inputClass}
        />
      ) : (
        <InputForwarded
          {...(props.inputProps as InputHTMLAttributes<HTMLInputElement>)}
          id={id}
          aria-invalid={invalid}
          className={inputClass}
        />
      )}
      {props.error ? (
        <span className={styles.error} role="alert">
          {props.error}
        </span>
      ) : props.hint ? (
        <span className={styles.hint}>{props.hint}</span>
      ) : null}
    </div>
  )
}

// react-hook-form's register() returns a ref we need to forward to the <input>.
// The ForwardedInput wrapper lets us do that without making the parent component
// pass a ref through props manually.
const InputForwarded = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function InputForwarded(props, ref) {
    return <input ref={ref} {...props} />
  },
)

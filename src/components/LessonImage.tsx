import { useState } from 'react'
import styles from './LessonImage.module.css'

interface LessonImageProps {
  src?: string
  variant: 'scenario' | 'choice' | 'consequence'
  alt: string
}

/**
 * Renders an illustration from the lesson asset library, or nothing if the
 * asset is missing (404 / not-yet-generated). Avoids broken-image icons by
 * tracking load failure.
 */
export function LessonImage({ src, variant, alt }: LessonImageProps) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return null
  const className =
    variant === 'scenario'
      ? `${styles.img} ${styles.scenarioImg}`
      : variant === 'choice'
        ? `${styles.img} ${styles.choiceImg}`
        : `${styles.img} ${styles.consequenceImg}`
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}

import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthProvider'
import { postLoginPath } from '../auth/postLoginPath'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import styles from './HomePage.module.css'

export function HomePage() {
  const { t } = useTranslation()
  const { currentUser } = useAuth()

  if (currentUser) return <Navigate to={postLoginPath(currentUser)} replace />

  const capabilities = [
    {
      icon: 'sparkles' as const,
      title: t('home.capabilities.items.0.title'),
      body: t('home.capabilities.items.0.body'),
    },
    {
      icon: 'arrow-right' as const,
      title: t('home.capabilities.items.1.title'),
      body: t('home.capabilities.items.1.body'),
    },
    {
      icon: 'check' as const,
      title: t('home.capabilities.items.2.title'),
      body: t('home.capabilities.items.2.body'),
    },
  ]

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <div className={styles.oceanDecor} aria-hidden="true">
          <span className={`${styles.bubble} ${styles.bubbleOne}`} />
          <span className={`${styles.bubble} ${styles.bubbleTwo}`} />
          <span className={`${styles.bubble} ${styles.bubbleThree}`} />
          <span className={`${styles.bubble} ${styles.bubbleFour}`} />
          <span className={`${styles.bubble} ${styles.bubbleFive}`} />
          <span className={`${styles.fish} ${styles.fishHero}`} />
        </div>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            <Icon name="sparkles" size={16} />
            {t('home.eyebrow')}
          </div>
          <h1>{t('home.title')}</h1>
          <p className={styles.tagline}>{t('home.hero')}</p>
          <div className={styles.cta}>
            <Button to="/register">
              {t('home.ctaPrimary')}
              <Icon name="arrow-right" size={19} />
            </Button>
            <Button to="/login" variant="ghost">
              {t('home.ctaLogin')}
            </Button>
          </div>
          <p className={styles.trustNote}>{t('home.trustedBy')}</p>
        </div>

        <div className={styles.previewWrap} aria-label={t('home.preview.label')}>
          <div className={styles.previewGlow} />
          <div className={styles.preview}>
            <span className={styles.seaLabel}>{t('home.preview.seaLabel')}</span>
            <div className={styles.previewTop}>
              <span className={styles.previewLabel}>{t('home.preview.label')}</span>
              <span className={styles.stars}>{t('home.preview.stars')}</span>
            </div>
            <div className={styles.previewGreeting}>
              <span>{t('home.preview.student')}</span>
              <span className={styles.avatar}>S</span>
            </div>
            <div className={styles.progressTrack}>
              <span className={styles.progressBar} />
            </div>
            <p className={styles.progressText}>{t('home.preview.progress')}</p>
            <div className={styles.lessonCard}>
              <span className={styles.lessonIcon}><Icon name="sparkles" size={22} /></span>
              <span className={styles.lessonCopy}>
                <strong>{t('home.preview.lesson')}</strong>
                <small>{t('home.preview.lessonMeta')}</small>
              </span>
              <Icon name="arrow-right" size={18} />
            </div>
            <Button to="/login" size="sm">{t('home.preview.continue')}</Button>
          </div>
        </div>
      </section>

      <section className={styles.capabilities} aria-labelledby="capabilities-title">
        <div className={styles.sectionSeaLife} aria-hidden="true">
          <span className={`${styles.fish} ${styles.fishBlue} ${styles.fishSmall}`} />
          <span className={`${styles.fish} ${styles.fishYellow} ${styles.fishTiny}`} />
          <span className={`${styles.bubble} ${styles.sectionBubbleOne}`} />
          <span className={`${styles.bubble} ${styles.sectionBubbleTwo}`} />
          <span className={`${styles.bubble} ${styles.sectionBubbleThree}`} />
        </div>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionKicker}>{t('home.eyebrow')}</p>
          <h2 id="capabilities-title">{t('home.capabilities.title')}</h2>
          <p>{t('home.capabilities.subtitle')}</p>
        </div>
        <div className={styles.capabilityGrid}>
          {capabilities.map((capability) => (
            <article className={styles.capability} key={capability.title}>
              <span className={styles.capabilityIcon}><Icon name={capability.icon} size={21} /></span>
              <h3>{capability.title}</h3>
              <p>{capability.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <span className={`${styles.fish} ${styles.fishMint} ${styles.fishSmall}`} aria-hidden="true" />
        <span className={`${styles.bubble} ${styles.closingBubbleOne}`} aria-hidden="true" />
        <span className={`${styles.bubble} ${styles.closingBubbleTwo}`} aria-hidden="true" />
        <div>
          <h2>{t('home.closing.title')}</h2>
          <p>{t('home.closing.body')}</p>
        </div>
        <Button to="/register">
          {t('home.closing.cta')}
          <Icon name="arrow-right" size={19} />
        </Button>
      </section>
    </div>
  )
}

import { CSSProperties, ReactNode } from 'react'
import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  children?: ReactNode
  style?: CSSProperties
}

const LoadingSpinner = ({ children, style }: LoadingSpinnerProps) => {
  return (
    <div className={styles.loaderContainer} data-testid="loading-spinner" style={style}>
      <svg className={styles.spinner} viewBox="0 0 50 50">
        <defs>
          <linearGradient id="spinner-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="spinner-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="2"></circle>
      </svg>
      {children}
    </div>
  )
}

export default LoadingSpinner

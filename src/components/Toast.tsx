import styles from './Toast.module.css'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
        {type === 'warning' && '⚠'}
        <span>{message}</span>
      </div>
      <button className={styles.close} onClick={onClose}>×</button>
    </div>
  )
}

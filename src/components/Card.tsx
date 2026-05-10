import styles from './Card.module.css'

interface CardProps {
  className?: string
  children: React.ReactNode
  hoverable?: boolean
}

export default function Card({ className = '', children, hoverable = false }: CardProps) {
  return (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}>
      {children}
    </div>
  )
}

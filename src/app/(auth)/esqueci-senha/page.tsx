'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setError(data.error || 'Não foi possível enviar. Tente novamente.')
      else setSent(data.message)
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authRoot}>
      <div className={styles.authRight}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h2 className={styles.authTitle}>Esqueci minha senha</h2>
            <p className={styles.authSubtitle}>
              Informe o email da sua conta e enviaremos um link para criar uma nova senha.
            </p>
          </div>

          {sent ? (
            <div className={styles.authForm}>
              <div className={styles.authAlert} style={{ background: 'var(--success-bg)', color: '#047857' }}>
                {sent}
              </div>
              <p className={styles.authSubtitle}>Não chegou? Confira a caixa de spam. O link vale por 1 hora.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.authForm}>
              {error && <div className={styles.authAlert}>{error}</div>}
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? <><span className={styles.spinner} /> Enviando...</> : 'Enviar link'}
              </button>
            </form>
          )}

          <div className={styles.authFooter}>
            <p>Lembrou a senha? <Link href="/login" className={styles.authLink}>Voltar para o login</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

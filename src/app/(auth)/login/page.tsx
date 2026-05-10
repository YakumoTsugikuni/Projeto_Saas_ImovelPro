'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou senha inválidos. Verifique seus dados.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authRoot}>
      <div className={styles.authLeft}>
        <Link href="/" className={styles.authBrand} title="Voltar para a página principal">
          <div className={styles.authLogoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <span className={styles.authBrandName}>ImóvelPro</span>
            <span className={styles.authBrandHint}>Clique para voltar à home</span>
          </div>
        </Link>
        <div className={styles.authLeftContent}>
          <h1 className={styles.authLeftTitle}>
            Seu negócio imobiliário, organizado.
          </h1>
          <p className={styles.authLeftSubtitle}>
            Acesse sua conta e gerencie imóveis, clientes e visitas com eficiência.
          </p>
          <div className={styles.authFeatureList}>
            {['Portfólio completo de imóveis', 'CRM de clientes integrado', 'Agendamento de visitas', 'Dashboard com métricas'].map(f => (
              <div key={f} className={styles.authFeatureItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authTopNav}>
          <Link href="/" className={styles.authBrandDesktop} title="Voltar para a página principal">
            <div className={styles.authLogoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className={styles.authBrandName}>ImóvelPro</span>
          </Link>
        </div>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h2 className={styles.authTitle}>Entrar na sua conta</h2>
            <p className={styles.authSubtitle}>Bem-vindo de volta! 👋</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            {error && (
              <div className={styles.authAlert}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="form-input-icon">
                <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Senha</label>
              <div className="form-input-icon">
                <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Entrando...
                </>
              ) : 'Entrar'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>Não tem uma conta? <Link href="/register" className={styles.authLink}>Cadastre-se grátis</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

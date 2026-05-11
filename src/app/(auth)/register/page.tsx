'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validatePasswordStrengthClient, validateEmailClient } from '@/lib/clientValidation'
import styles from '../auth.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', empresa: '', creci: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // ✅ SEGURANÇA: Validação no cliente
    if (!form.name || form.name.trim().length === 0) {
      setError('Nome é obrigatório.')
      return
    }

    if (!form.email || !validateEmailClient(form.email)) {
      setError('Email inválido.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    // ✅ SEGURANÇA: Validação forte de senha
    const passwordValidation = validatePasswordStrengthClient(form.password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Senha fraca.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          empresa: form.empresa || undefined,
          creci: form.creci || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta.')
      } else {
        router.push('/login?registered=1')
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

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
            Comece hoje, sem custos.
          </h1>
          <p className={styles.authLeftSubtitle}>
            Crie sua conta em menos de 2 minutos e comece a gerenciar seu negócio imobiliário agora.
          </p>
          <div className={styles.authFeatureList}>
            {['Grátis para sempre no plano Starter', 'Sem necessidade de cartão de crédito', 'Setup em menos de 5 minutos', 'Suporte via email incluído'].map(f => (
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
            <h2 className={styles.authTitle}>Criar sua conta</h2>
            <p className={styles.authSubtitle}>Preencha os dados abaixo para começar</p>
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

            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nome completo *</label>
                <input id="name" type="text" className="form-input" placeholder="João Silva" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Telefone</label>
                <input id="phone" type="tel" className="form-input" placeholder="(11) 99999-9999" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email *</label>
              <input id="reg-email" type="email" className="form-input" placeholder="seu@email.com" value={form.email} onChange={set('email')} required autoComplete="email" />
            </div>

            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label" htmlFor="empresa">Imobiliária / Empresa</label>
                <input id="empresa" type="text" className="form-input" placeholder="Imóveis & Cia" value={form.empresa} onChange={set('empresa')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="creci">CRECI</label>
                <input id="creci" type="text" className="form-input" placeholder="12345-SP" value={form.creci} onChange={set('creci')} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Senha * {form.password && <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                    (Obrigatório: maiúsculas, minúsculas, números, símbolos)
                  </span>}
                </label>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="Mín. 8 caracteres com maiúsculas, números e símbolos"
                  value={form.password}
                  onChange={set('password')}
                  required
                  autoComplete="new-password"
                />
                {form.password && (
                  <div style={{ marginTop: 8, fontSize: '0.85em' }}>
                    {validatePasswordStrengthClient(form.password).valid ? (
                      <span style={{ color: 'var(--color-success, #10b981)' }}>✓ Senha forte</span>
                    ) : (
                      <span style={{ color: 'var(--color-error, #ef4444)' }}>✗ {validatePasswordStrengthClient(form.password).error}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password">Confirmar Senha *</label>
                <input
                  id="confirm-password"
                  type="password"
                  className="form-input"
                  placeholder="Repita a senha"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Criando conta...
                </>
              ) : 'Criar conta grátis'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>Já tem uma conta? <Link href="/login" className={styles.authLink}>Entrar</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

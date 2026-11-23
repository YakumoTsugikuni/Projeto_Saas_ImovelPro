'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { validatePasswordStrengthClient } from '@/lib/clientValidation'
import styles from '../auth.module.css'

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token') || '')
  }, [])

  const strength = form.password ? validatePasswordStrengthClient(form.password) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('As senhas não coincidem.')
    if (!strength?.valid) return setError(strength?.error || 'Senha fraca.')

    setLoading(true)
    try {
      const res = await fetch('/api/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setError(data.error || 'Não foi possível alterar a senha.')
      else {
        setDone(true)
        setTimeout(() => router.push('/login'), 2500)
      }
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
            <h2 className={styles.authTitle}>Criar nova senha</h2>
            <p className={styles.authSubtitle}>Escolha uma senha que você ainda não usou aqui.</p>
          </div>

          {token === '' ? (
            <div className={styles.authAlert}>
              Link incompleto. Abra o link exatamente como veio no email, ou peça um novo.
            </div>
          ) : done ? (
            <div className={styles.authAlert} style={{ background: 'var(--success-bg)', color: '#047857' }}>
              Senha alterada! Levando você para o login...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.authForm}>
              {error && <div className={styles.authAlert}>{error}</div>}
              <div className="form-group">
                <label className="form-label" htmlFor="password">Nova senha</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Mín. 8 caracteres, com maiúscula, número e símbolo"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="new-password"
                  autoFocus
                />
                {strength && (
                  <div style={{ marginTop: 8, fontSize: '0.85em', color: strength.valid ? 'var(--success)' : 'var(--danger)' }}>
                    {strength.valid ? '✓ Senha forte' : `✗ ${strength.error}`}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirm">Confirmar nova senha</label>
                <input
                  id="confirm"
                  type="password"
                  className="form-input"
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  required
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading || token === null}>
                {loading ? <><span className={styles.spinner} /> Salvando...</> : 'Salvar nova senha'}
              </button>
            </form>
          )}

          <div className={styles.authFooter}>
            <p><Link href="/esqueci-senha" className={styles.authLink}>Pedir um novo link</Link> · <Link href="/login" className={styles.authLink}>Voltar para o login</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

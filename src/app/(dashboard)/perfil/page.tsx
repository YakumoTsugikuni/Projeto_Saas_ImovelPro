'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import styles from './page.module.css'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  creci: string | null
  empresa: string | null
  role: string
  createdAt: string
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({})
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetch('/api/perfil')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setForm({ name: data.name, phone: data.phone || '', avatar: data.avatar || '', creci: data.creci || '', empresa: data.empresa || '' })
        setLoading(false)
      })
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(prev => prev ? { ...prev, ...data } : data)
        showToast('Perfil atualizado com sucesso!')
      } else {
        const d = await res.json()
        showToast(d.error || 'Erro ao salvar', 'error')
      }
    } catch { showToast('Erro ao salvar perfil', 'error') }
    finally { setSaving(false) }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) {
      showToast('As senhas não coincidem', 'error')
      return
    }
    if (passForm.newPassword.length < 6) {
      showToast('A nova senha deve ter pelo menos 6 caracteres', 'error')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...passForm }),
      })
      if (res.ok) {
        showToast('Senha alterada com sucesso!')
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const d = await res.json()
        showToast(d.error || 'Erro ao alterar senha', 'error')
      }
    } catch { showToast('Erro ao alterar senha', 'error') }
    finally { setSaving(false) }
  }

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f: any) => ({ ...f, [k]: e.target.value }))
  const setP = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setPassForm(f => ({ ...f, [k]: e.target.value }))

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ width: 200, height: 32, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Meu Perfil</h1>
          <p className="page-subtitle">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className={styles.profileGrid}>
        {/* Profile Summary Card */}
        <div className={`card ${styles.summaryCard}`}>
          <div className={styles.avatarSection}>
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className={styles.profileName}>{profile?.name}</h2>
              <p className={styles.profileEmail}>{profile?.email}</p>
              <span className={`badge ${profile?.role === 'ADMIN' ? 'badge-midnight' : 'badge-blue'}`}>
                {profile?.role === 'ADMIN' ? 'Administrador' : 'Corretor'}
              </span>
            </div>
          </div>
          <div className={styles.profileMeta}>
            {[
              { label: 'CRECI', value: profile?.creci || '—' },
              { label: 'Empresa', value: profile?.empresa || '—' },
              { label: 'Telefone', value: profile?.phone || '—' },
              { label: 'Membro desde', value: profile?.createdAt ? formatDate(profile.createdAt) : '—' },
            ].map(item => (
              <div key={item.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{item.label}</span>
                <span className={styles.metaValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Forms */}
        <div className={styles.formsColumn}>
          {/* Personal Info */}
          <div className="card">
            <h3 className={styles.cardTitle}>Informações Pessoais</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nome completo</label>
                  <input id="profile-name" type="text" className="form-input" value={form.name || ''} onChange={setF('name')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input type="tel" className="form-input" value={form.phone || ''} onChange={setF('phone')} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Empresa / Imobiliária</label>
                  <input type="text" className="form-input" value={form.empresa || ''} onChange={setF('empresa')} />
                </div>
                <div className="form-group">
                  <label className="form-label">CRECI</label>
                  <input type="text" className="form-input" value={form.creci || ''} onChange={setF('creci')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URL do Avatar</label>
                <input type="url" className="form-input" placeholder="https://exemplo.com/foto.jpg" value={form.avatar || ''} onChange={setF('avatar')} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button id="save-profile" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="card">
            <h3 className={styles.cardTitle}>Alterar Senha</h3>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Senha Atual</label>
                <input id="current-password" type="password" className="form-input" value={passForm.currentPassword} onChange={setP('currentPassword')} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nova Senha</label>
                  <input type="password" className="form-input" value={passForm.newPassword} onChange={setP('newPassword')} required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar Nova Senha</label>
                  <input type="password" className="form-input" value={passForm.confirmPassword} onChange={setP('confirmPassword')} required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button id="save-password" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

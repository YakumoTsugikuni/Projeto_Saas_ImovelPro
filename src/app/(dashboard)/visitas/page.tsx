'use client'

import { useEffect, useState, useCallback } from 'react'
import { formatDatetime, statusVisitaLabel } from '@/lib/utils'
import styles from './page.module.css'

interface Visita {
  id: string
  dataVisita: string
  status: string
  observacoes: string | null
  imovel: { id: string; titulo: string; endereco: string; cidade: string }
  cliente: { id: string; nome: string; telefone: string }
}

interface Imovel { id: string; titulo: string; cidade: string }
interface Cliente { id: string; nome: string; telefone: string }

const statusColors: Record<string, string> = {
  AGENDADA: 'badge-blue',
  REALIZADA: 'badge-green',
  CANCELADA: 'badge-red',
}

const emptyForm = { dataVisita: '', imovelId: '', clienteId: '', observacoes: '' }

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<any>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchAll = useCallback(async () => {
    const [v, i, c] = await Promise.all([
      fetch('/api/visitas').then(r => r.json()),
      fetch('/api/imoveis').then(r => r.json()),
      fetch('/api/clientes').then(r => r.json()),
    ])
    setVisitas(Array.isArray(v) ? v : [])
    setImoveis(Array.isArray(i) ? i : [])
    setClientes(Array.isArray(c) ? c : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/visitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        showToast('Visita agendada!')
        setShowModal(false)
        setForm(emptyForm)
        fetchAll()
      } else {
        const d = await res.json()
        showToast(d.error || 'Erro ao agendar', 'error')
      }
    } catch { showToast('Erro ao agendar visita', 'error') }
    finally { setSaving(false) }
  }

  const handleStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/visitas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) { showToast('Status atualizado!'); fetchAll() }
    else showToast('Erro ao atualizar', 'error')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta visita?')) return
    const res = await fetch(`/api/visitas/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Visita excluída'); fetchAll() }
    else showToast('Erro ao excluir', 'error')
  }

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f: any) => ({ ...f, [k]: e.target.value }))

  const agendadas = visitas.filter(v => v.status === 'AGENDADA')
  const outras = visitas.filter(v => v.status !== 'AGENDADA')

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visitas</h1>
          <p className="page-subtitle">{agendadas.length} visitas agendadas · {outras.length} realizadas/canceladas</p>
        </div>
        <button id="add-visita" className="btn btn-primary" onClick={() => { setForm(emptyForm); setShowModal(true) }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Agendar Visita
        </button>
      </div>

      {loading ? (
        <div>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12, marginBottom: 12 }} />)}
        </div>
      ) : visitas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Nenhuma visita agendada</h3>
            <p>Agende visitas vinculando clientes aos imóveis</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Agendar Visita</button>
          </div>
        </div>
      ) : (
        <div className={styles.visitasContainer}>
          {agendadas.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>Próximas Visitas</h2>
              <div className={styles.visitasList}>
                {agendadas.map(v => <VisitaCard key={v.id} visita={v} onStatus={handleStatus} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
          {outras.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>Histórico</h2>
              <div className={styles.visitasList}>
                {outras.map(v => <VisitaCard key={v.id} visita={v} onStatus={handleStatus} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Agendar Visita</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Data e Hora *</label>
                <input type="datetime-local" className="form-input" value={form.dataVisita} onChange={setF('dataVisita')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Imóvel *</label>
                <select className="form-select" value={form.imovelId} onChange={setF('imovelId')} required>
                  <option value="">Selecione o imóvel</option>
                  {imoveis.map(i => <option key={i.id} value={i.id}>{i.titulo} — {i.cidade}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cliente *</label>
                <select className="form-select" value={form.clienteId} onChange={setF('clienteId')} required>
                  <option value="">Selecione o cliente</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.telefone}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea className="form-textarea" value={form.observacoes} onChange={setF('observacoes')} rows={3} placeholder="Instruções para a visita..." />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button id="save-visita" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Agendando...' : 'Agendar Visita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

function VisitaCard({ visita, onStatus, onDelete }: { visita: Visita; onStatus: (id: string, status: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className={`card ${styles.visitaCard}`}>
      <div className={styles.visitaDateBlock}>
        <span className={styles.visitaDay}>
          {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(visita.dataVisita))}
        </span>
        <span className={styles.visitaTime}>
          {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
        </span>
      </div>
      <div className={styles.visitaInfo}>
        <div className={styles.visitaProp}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          {visita.imovel.titulo}
          <span className={styles.visitaCity}>{visita.imovel.cidade}</span>
        </div>
        <div className={styles.visitaClient}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          {visita.cliente.nome} · {visita.cliente.telefone}
        </div>
        {visita.observacoes && <div className={styles.visitaObs}>{visita.observacoes}</div>}
      </div>
      <div className={styles.visitaActions}>
        <span className={`badge ${statusColors[visita.status] || 'badge-gray'}`}>
          {statusVisitaLabel[visita.status]}
        </span>
        {visita.status === 'AGENDADA' && (
          <>
            <button className="btn btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.75rem' }} onClick={() => onStatus(visita.id, 'REALIZADA')}>Realizada</button>
            <button className="btn btn-sm btn-danger" onClick={() => onStatus(visita.id, 'CANCELADA')}>Cancelar</button>
          </>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => onDelete(visita.id)} style={{ color: 'var(--danger)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

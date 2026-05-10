'use client'

import { useEffect, useState, useCallback } from 'react'
import { formatCurrency, tipoClienteLabel } from '@/lib/utils'
import styles from './page.module.css'

interface Cliente {
  id: string
  nome: string
  email: string | null
  telefone: string
  tipo: string
  interesse: string | null
  orcamento: number | null
  observacoes: string | null
  _count: { visitas: number }
}

const tipoBadge: Record<string, string> = {
  COMPRADOR: 'badge-blue',
  VENDEDOR: 'badge-green',
  LOCATARIO: 'badge-yellow',
  PROPRIETARIO: 'badge-midnight',
}

const emptyForm = {
  nome: '', email: '', telefone: '', tipo: 'COMPRADOR',
  interesse: '', orcamento: '', observacoes: '',
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create')
  const [form, setForm] = useState<any>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchClientes = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterTipo) params.set('tipo', filterTipo)
    const res = await fetch(`/api/clientes?${params}`)
    const data = await res.json()
    setClientes(data)
    setLoading(false)
  }, [search, filterTipo])

  useEffect(() => { fetchClientes() }, [fetchClientes])

  const openCreate = () => { setSelectedClient(null); setModalMode('create'); setForm(emptyForm); setShowModal(true) }
  const openView = (c: Cliente) => { setSelectedClient(c); setModalMode('view'); setShowModal(true) }
  const openEdit = (c: Cliente) => {
    setSelectedClient(c)
    setModalMode('edit')
    setForm({ nome: c.nome, email: c.email || '', telefone: c.telefone, tipo: c.tipo, interesse: c.interesse || '', orcamento: String(c.orcamento ?? ''), observacoes: c.observacoes || '' })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const isEdit = modalMode === 'edit' && selectedClient
      const url = isEdit ? `/api/clientes/${selectedClient?.id}` : '/api/clientes'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) {
        showToast(isEdit ? 'Cliente atualizado!' : 'Cliente cadastrado!')
        setShowModal(false)
        setSelectedClient(null)
        fetchClientes()
      } else {
        const d = await res.json()
        showToast(d.error || 'Erro ao salvar', 'error')
      }
    } catch {
      showToast('Erro ao salvar cliente', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este cliente?')) return
    const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Cliente excluído'); fetchClientes() }
    else showToast('Erro ao excluir', 'error')
  }

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f: any) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">{clientes.length} clientes cadastrados</p>
        </div>
        <button id="add-cliente" className="btn btn-primary" onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Cliente
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          {Object.entries(tipoClienteLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="card">
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12, borderRadius: 8 }} />)}
        </div>
      ) : clientes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <h3>Nenhum cliente encontrado</h3>
            <p>Cadastre seu primeiro cliente clicando em "Novo Cliente"</p>
            <button className="btn btn-primary" onClick={openCreate}>Cadastrar Cliente</button>
          </div>
        </div>
      ) : (
        <div className={styles.clientesGrid}>
          {clientes.map(c => (
            <button key={c.id} type="button" className={`card ${styles.clienteCard}`} onClick={() => openView(c)}>
              <div className={styles.clienteCardHeader}>
                <div className={styles.clienteAvatar}>{c.nome.charAt(0).toUpperCase()}</div>
                <div className={styles.clienteCardInfo}>
                  <div className={styles.clienteName}>{c.nome}</div>
                  <div className={styles.clienteEmail}>{c.email || 'Sem email'}</div>
                </div>
              </div>
              <div className={styles.clienteCardMeta}>
                <span className={`badge ${tipoBadge[c.tipo]}`}>{tipoClienteLabel[c.tipo]}</span>
                <span>{c.telefone}</span>
                <span>{c.interesse || 'Sem interesse'}</span>
                <span className="badge badge-gray">{c._count.visitas} visitas</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'view' ? 'Detalhes do Cliente' : modalMode === 'edit' ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <button className="modal-close" onClick={() => { setShowModal(false); setSelectedClient(null) }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {modalMode === 'view' && selectedClient ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div className={styles.clienteName}>{selectedClient.nome}</div>
                  <div className={styles.clienteEmail}>{selectedClient.email || 'Sem email'}</div>
                </div>
                <div className={styles.clienteCardMeta} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                  <span className={`badge ${tipoBadge[selectedClient.tipo]}`}>{tipoClienteLabel[selectedClient.tipo]}</span>
                  <span>Telefone: {selectedClient.telefone}</span>
                  <span>Interesse: {selectedClient.interesse || '—'}</span>
                  <span>Orçamento: {selectedClient.orcamento ? formatCurrency(selectedClient.orcamento) : '—'}</span>
                  <span>Visitas: {selectedClient._count.visitas}</span>
                  <div style={{ maxWidth: '100%' }}>
                    <div className={styles.clienteName} style={{ marginBottom: 8 }}>Observações</div>
                    <div style={{ color: 'var(--gray-600)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{selectedClient.observacoes || 'Nenhuma observação'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setSelectedClient(null) }}>Fechar</button>
                  <button type="button" className="btn btn-primary" onClick={() => openEdit(selectedClient)}>Editar</button>
                  <button type="button" className="btn btn-danger" onClick={() => { handleDelete(selectedClient.id); setShowModal(false); setSelectedClient(null) }}>Excluir</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome *</label>
                    <input type="text" className="form-input" value={form.nome} onChange={setF('nome')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone *</label>
                    <input type="tel" className="form-input" value={form.telefone} onChange={setF('telefone')} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email} onChange={setF('email')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tipo</label>
                    <select className="form-select" value={form.tipo} onChange={setF('tipo')}>
                      {Object.entries(tipoClienteLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Interesse</label>
                    <input type="text" className="form-input" placeholder="Ex: 2 quartos, zona sul" value={form.interesse} onChange={setF('interesse')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Orçamento (R$)</label>
                    <input type="number" className="form-input" placeholder="500000" value={form.orcamento} onChange={setF('orcamento')} min="0" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea className="form-textarea" value={form.observacoes} onChange={setF('observacoes')} rows={3} />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setSelectedClient(null) }}>Cancelar</button>
                  <button id="save-cliente" type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Salvando...' : modalMode === 'edit' ? 'Salvar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            )}
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

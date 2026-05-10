'use client'

import { useEffect, useState, useCallback } from 'react'
import { formatCurrency, tipoImovelLabel, statusImovelLabel } from '@/lib/utils'
import styles from './page.module.css'

interface Imovel {
  id: string
  titulo: string
  tipo: string
  status: string
  preco: number
  area: number | null
  quartos: number | null
  banheiros: number | null
  vagas: number | null
  endereco: string
  cidade: string
  estado: string
  imagens: string
  destaque: boolean
  _count: { visitas: number }
}

const statusBadge: Record<string, string> = {
  VENDA: 'badge-blue',
  ALUGUEL: 'badge-green',
  VENDIDO: 'badge-yellow',
  ALUGADO: 'badge-gray',
}

const emptyForm = {
  titulo: '', descricao: '', tipo: 'APARTAMENTO', status: 'VENDA',
  preco: '', area: '', quartos: '', banheiros: '', vagas: '',
  endereco: '', cidade: '', estado: '', cep: '', imagens: '', destaque: false,
}

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [viewingImovel, setViewingImovel] = useState<Imovel | null>(null)
  const [editing, setEditing] = useState<Imovel | null>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchImoveis = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterTipo) params.set('tipo', filterTipo)
    if (filterStatus) params.set('status', filterStatus)
    const res = await fetch(`/api/imoveis?${params}`)
    const data = await res.json()
    setImoveis(data)
    setLoading(false)
  }, [search, filterTipo, filterStatus])

  useEffect(() => {
    fetchImoveis()
  }, [fetchImoveis])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (imovel: Imovel) => {
    setEditing(imovel)
    const imgs = JSON.parse(imovel.imagens || '[]')
    setForm({
      titulo: imovel.titulo,
      descricao: '',
      tipo: imovel.tipo,
      status: imovel.status,
      preco: String(imovel.preco),
      area: String(imovel.area ?? ''),
      quartos: String(imovel.quartos ?? ''),
      banheiros: String(imovel.banheiros ?? ''),
      vagas: String(imovel.vagas ?? ''),
      endereco: imovel.endereco,
      cidade: imovel.cidade,
      estado: imovel.estado,
      cep: '',
      imagens: imgs.join('\n'),
      destaque: imovel.destaque,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const imagens = form.imagens ? form.imagens.split('\n').map((s: string) => s.trim()).filter(Boolean) : []
    const payload = { ...form, imagens }

    try {
      const url = editing ? `/api/imoveis/${editing.id}` : '/api/imoveis'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        showToast(editing ? 'Imóvel atualizado!' : 'Imóvel cadastrado!')
        setShowModal(false)
        fetchImoveis()
      } else {
        const d = await res.json()
        showToast(d.error || 'Erro ao salvar', 'error')
      }
    } catch {
      showToast('Erro ao salvar imóvel', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return
    const res = await fetch(`/api/imoveis/${id}`, { method: 'DELETE' })
    if (res.ok) {
      showToast('Imóvel excluído')
      fetchImoveis()
    } else {
      showToast('Erro ao excluir', 'error')
    }
  }

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f: any) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Imóveis</h1>
          <p className="page-subtitle">{imoveis.length} imóveis cadastrados</p>
        </div>
        <button id="add-imovel" className="btn btn-primary" onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Imóvel
        </button>
      </div>

      {/* FILTERS */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text" placeholder="Buscar imóveis..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          {Object.entries(tipoImovelLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {Object.entries(statusImovelLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* GRID */}
      {loading ? (
        <div className={styles.grid}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }} />)}
        </div>
      ) : imoveis.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3>Nenhum imóvel encontrado</h3>
            <p>Cadastre seu primeiro imóvel clicando em "Novo Imóvel"</p>
            <button className="btn btn-primary" onClick={openCreate}>Cadastrar Imóvel</button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {imoveis.map(imovel => {
            const imgs = JSON.parse(imovel.imagens || '[]')
            return (
              <div key={imovel.id} className={`card card-hover ${styles.imovelCard}`} onClick={() => setViewingImovel(imovel)} style={{ cursor: 'pointer' }}>
                <div className={styles.imovelImg} style={{ backgroundImage: imgs[0] ? `url(${imgs[0]})` : 'none' }}>
                  {!imgs[0] && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  )}
                  <div className={styles.imovelBadges}>
                    <span className={`badge ${statusBadge[imovel.status]}`}>{statusImovelLabel[imovel.status]}</span>
                    <span className="badge badge-midnight">{tipoImovelLabel[imovel.tipo]}</span>
                  </div>
                </div>
                <div className={styles.imovelBody}>
                  <h3 className={styles.imovelTitle}>{imovel.titulo}</h3>
                  <p className={styles.imovelAddress}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {imovel.cidade}, {imovel.estado}
                  </p>
                  <div className={styles.imovelSpecs}>
                    {imovel.quartos && <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M22 4v16M2 12h20M6 4v8M18 4v8"/></svg>{imovel.quartos} qts</span>}
                    {imovel.banheiros && <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>{imovel.banheiros} ban</span>}
                    {imovel.area && <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>{imovel.area}m²</span>}
                    {imovel.vagas && <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/></svg>{imovel.vagas} vg</span>}
                  </div>
                  <div className={styles.imovelFooter}>
                    <span className={styles.imovelPrice}>{formatCurrency(imovel.preco)}</span>
                    <div className={styles.imovelActions} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(imovel)} title="Editar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(imovel.id)} title="Excluir" style={{ color: 'var(--danger)' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Editar Imóvel' : 'Novo Imóvel'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input type="text" className="form-input" placeholder="Ex: Apartamento 3 quartos no centro" value={form.titulo} onChange={setF('titulo')} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select className="form-select" value={form.tipo} onChange={setF('tipo')}>
                    {Object.entries(tipoImovelLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={setF('status')}>
                    {Object.entries(statusImovelLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Preço (R$) *</label>
                <input type="number" className="form-input" placeholder="350000" value={form.preco} onChange={setF('preco')} required min="0" />
              </div>
              <div className="form-row-4">
                {[['quartos','Quartos'],['banheiros','Banheiros'],['vagas','Vagas'],['area','Área m²']].map(([k, l]) => (
                  <div key={k} className="form-group">
                    <label className="form-label">{l}</label>
                    <input type="number" className="form-input" placeholder="0" value={form[k]} onChange={setF(k)} min="0" />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Endereço *</label>
                <input type="text" className="form-input" placeholder="Rua das Flores, 123" value={form.endereco} onChange={setF('endereco')} required />
              </div>
              <div className="form-row-compact">
                <div className="form-group">
                  <label className="form-label">Cidade *</label>
                  <input type="text" className="form-input" value={form.cidade} onChange={setF('cidade')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado *</label>
                  <input type="text" className="form-input" placeholder="SP" value={form.estado} onChange={setF('estado')} required maxLength={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">CEP</label>
                  <input type="text" className="form-input" placeholder="00000-000" value={form.cep} onChange={setF('cep')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URLs de Imagens (uma por linha)</label>
                <textarea className="form-textarea" placeholder="https://exemplo.com/foto1.jpg" value={form.imagens} onChange={setF('imagens')} rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="form-textarea" placeholder="Descreva o imóvel..." value={form.descricao} onChange={setF('descricao')} rows={3} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button id="save-imovel" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : editing ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VISUALIZAR DETALHES */}
      {viewingImovel && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewingImovel(null)}>
          <div className="modal" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 className="modal-title">{viewingImovel.titulo}</h3>
              <button className="modal-close" onClick={() => setViewingImovel(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 20px 20px' }}>
              {/* IMAGEM */}
              {(() => {
                const imgs = JSON.parse(viewingImovel.imagens || '[]')
                return imgs.length > 0 ? (
                  <div style={{ 
                    width: '100%', 
                    height: 250, 
                    backgroundImage: `url(${imgs[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 'var(--radius-md)'
                  }} />
                ) : null
              })()}
              
              {/* BADGES */}
              <div style={{ display: 'flex', gap: 8 }}>
                <span className={`badge ${statusBadge[viewingImovel.status]}`}>{statusImovelLabel[viewingImovel.status]}</span>
                <span className="badge badge-midnight">{tipoImovelLabel[viewingImovel.tipo]}</span>
                {viewingImovel.destaque && <span className="badge badge-gold">Destaque</span>}
              </div>

              {/* PREÇO */}
              <div style={{ padding: 16, background: 'var(--info-bg)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Preço</div>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--blue-mid)' }}>
                  {formatCurrency(viewingImovel.preco)}
                </div>
              </div>

              {/* INFORMAÇÕES */}
              <div className="info-grid">
                {viewingImovel.area && (
                  <div style={{ padding: 12, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Área</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{viewingImovel.area}m²</div>
                  </div>
                )}
                {viewingImovel.quartos && (
                  <div style={{ padding: 12, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Quartos</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{viewingImovel.quartos}</div>
                  </div>
                )}
                {viewingImovel.banheiros && (
                  <div style={{ padding: 12, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Banheiros</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{viewingImovel.banheiros}</div>
                  </div>
                )}
                {viewingImovel.vagas && (
                  <div style={{ padding: 12, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Vagas</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{viewingImovel.vagas}</div>
                  </div>
                )}
              </div>

              {/* ENDEREÇO */}
              <div style={{ padding: 12, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Localização</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                  {viewingImovel.endereco}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {viewingImovel.cidade}, {viewingImovel.estado}
                </div>
              </div>

              {/* BOTÃO FECHAR */}
              <button className="btn btn-secondary" onClick={() => setViewingImovel(null)} style={{ width: '100%' }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {toast.type === 'error'
              ? <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
              : <><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></>
            }
          </svg>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

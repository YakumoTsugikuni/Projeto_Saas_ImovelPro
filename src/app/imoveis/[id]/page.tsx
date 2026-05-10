'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, tipoImovelLabel, statusImovelLabel } from '@/lib/utils'
import styles from './page.module.css'

interface Imovel {
  id: string
  titulo: string
  descricao: string
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
  cep: string
  imagens: string
  destaque: boolean
  _count: { visitas: number }
}

export default function ImovelDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [imovel, setImovel] = useState<Imovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (!params.id) return

    fetch(`/api/imoveis/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Imóvel não encontrado')
        return r.json()
      })
      .then(setImovel)
      .catch(() => router.push('/imoveis'))
      .finally(() => setLoading(false))
  }, [params.id, router])

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: 400, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 100 }} />
      </div>
    )
  }

  if (!imovel) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="empty-state">
            <p>Imóvel não encontrado</p>
            <Link href="/imoveis" className="btn btn-primary">
              Voltar para Imóveis
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const imgs = JSON.parse(imovel.imagens || '[]')

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <Link href="/imoveis" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Voltar
        </Link>
        <div>
          <h1 className="page-title">{imovel.titulo}</h1>
          <p className="page-subtitle">{imovel.endereco} • {imovel.cidade}, {imovel.estado}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {/* GALLERY */}
        <div className={styles.gallery}>
          {imgs.length > 0 ? (
            <>
              <div className={styles.mainImage} style={{ backgroundImage: `url(${imgs[currentImageIndex]})` }} />
              {imgs.length > 1 && (
                <div className={styles.thumbnails}>
                  {imgs.map((img, idx) => (
                    <div
                      key={idx}
                      className={styles.thumbnail}
                      style={{
                        backgroundImage: `url(${img})`,
                        opacity: idx === currentImageIndex ? 1 : 0.6,
                        cursor: 'pointer',
                      }}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noImage}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <p>Sem imagens</p>
            </div>
          )}
        </div>

        {/* INFO GRID */}
        <div className={styles.infoGrid}>
          {/* BADGES */}
          <div className={styles.badges}>
            <span className={`badge badge-${imovel.status === 'VENDA' ? 'blue' : imovel.status === 'ALUGUEL' ? 'green' : 'yellow'}`}>
              {statusImovelLabel[imovel.status]}
            </span>
            <span className="badge badge-midnight">{tipoImovelLabel[imovel.tipo]}</span>
            {imovel.destaque && <span className="badge badge-gold">Destaque</span>}
          </div>

          {/* PRICE */}
          <div className={styles.priceSection}>
            <span className={styles.priceLabel}>Preço</span>
            <span className={styles.priceValue}>{formatCurrency(imovel.preco)}</span>
          </div>

          {/* SPECS */}
          <div className={styles.specsGrid}>
            {imovel.area && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Área</span>
                <span className={styles.specValue}>{imovel.area}m²</span>
              </div>
            )}
            {imovel.quartos && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Quartos</span>
                <span className={styles.specValue}>{imovel.quartos}</span>
              </div>
            )}
            {imovel.banheiros && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Banheiros</span>
                <span className={styles.specValue}>{imovel.banheiros}</span>
              </div>
            )}
            {imovel.vagas && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Vagas</span>
                <span className={styles.specValue}>{imovel.vagas}</span>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          {imovel.descricao && (
            <div className={styles.descriptionSection}>
              <h2 style={{ marginTop: 24, marginBottom: 12 }}>Descrição</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{imovel.descricao}</p>
            </div>
          )}

          {/* VISITS */}
          <div className={styles.visitsSection}>
            <h2 style={{ marginTop: 24, marginBottom: 12 }}>Visitas Agendadas</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {imovel._count.visitas} {imovel._count.visitas === 1 ? 'visita' : 'visitas'} agendada(s)
            </p>
          </div>

          {/* ACTIONS */}
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <Link href="/imoveis" className="btn btn-ghost">
              Voltar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

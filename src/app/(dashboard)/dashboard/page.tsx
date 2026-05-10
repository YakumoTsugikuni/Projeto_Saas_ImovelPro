'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatCurrency, formatDatetime, statusVisitaLabel } from '@/lib/utils'
import styles from './page.module.css'

interface Stats {
  totalImoveis: number
  totalClientes: number
  totalVisitas: number
  portfolioTotal: number
  imoveisPorStatus: Array<{ status: string; _count: number }>
  visitasProximas: Array<{
    id: string
    dataVisita: string
    status: string
    imovel: { titulo: string; cidade: string }
    cliente: { nome: string; telefone: string }
  }>
}

const statusColors: Record<string, string> = {
  VENDA: 'var(--blue-mid)',
  ALUGUEL: 'var(--success)',
  VENDIDO: 'var(--warning)',
  ALUGADO: 'var(--gray-400)',
}

const statusLabels: Record<string, string> = {
  VENDA: 'À Venda',
  ALUGUEL: 'Aluguel',
  VENDIDO: 'Vendidos',
  ALUGADO: 'Alugados',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <div className="skeleton" style={{ width: 200, height: 32, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 300, height: 20 }} />
          </div>
        </div>
        <div className={styles.kpiGrid}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />)}
        </div>
      </div>
    )
  }

  const totalStatus = stats?.imoveisPorStatus.reduce((acc, s) => acc + s._count, 0) || 1

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visão geral do seu negócio imobiliário</p>
        </div>
        <div className={styles.headerDate}>
          {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className={styles.kpiGrid}>
        {[
          {
            label: 'Total de Imóveis',
            value: stats?.totalImoveis ?? 0,
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            ),
            color: 'var(--blue-mid)',
            bg: 'var(--info-bg)',
            suffix: 'imóveis',
            href: '/imoveis',
          },
          {
            label: 'Clientes Cadastrados',
            value: stats?.totalClientes ?? 0,
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            ),
            color: 'var(--success)',
            bg: 'var(--success-bg)',
            suffix: 'clientes',
            href: '/clientes',
          },
          {
            label: 'Visitas Agendadas',
            value: stats?.totalVisitas ?? 0,
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            ),
            color: 'var(--warning)',
            bg: 'var(--warning-bg)',
            suffix: 'visitas',
            href: '/visitas',
          },
          {
            label: 'Portfólio Total',
            value: formatCurrency(stats?.portfolioTotal ?? 0),
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            ),
            color: 'var(--midnight)',
            bg: 'var(--gray-100)',
            suffix: 'em portfólio',
            isString: true,
          },
        ].map(kpi => {
          const CardContent = (
            <div className={`card ${styles.kpiCard}`}>
              <div className={styles.kpiIcon} style={{ background: kpi.bg, color: kpi.color }}>
                {kpi.icon}
              </div>
              <div className={styles.kpiValue} style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className={styles.kpiLabel}>{kpi.label}</div>
              {!kpi.isString && <div className={styles.kpiSuffix}>{kpi.suffix}</div>}
            </div>
          )
          
          if (kpi.href) {
            return (
              <Link key={kpi.label} href={kpi.href}>
                {CardContent}
              </Link>
            )
          }
          
          return (
            <div key={kpi.label}>
              {CardContent}
            </div>
          )
        })}
      </div>

      <div className={styles.bottomGrid}>
        {/* CHART: Imóveis por Status */}
        <div className={`card ${styles.chartCard}`}>
          <h2 className={styles.cardTitle}>Imóveis por Status</h2>
          <div className={styles.statusChart}>
            {(stats?.imoveisPorStatus ?? []).map(s => (
              <div key={s.status} className={styles.statusRow}>
                <div className={styles.statusLabelRow}>
                  <span className={styles.statusDot} style={{ background: statusColors[s.status] || 'var(--gray-400)' }} />
                  <span className={styles.statusName}>{statusLabels[s.status] || s.status}</span>
                  <span className={styles.statusCount}>{s._count}</span>
                </div>
                <div className={styles.statusBar}>
                  <div
                    className={styles.statusBarFill}
                    style={{
                      width: `${(s._count / totalStatus) * 100}%`,
                      background: statusColors[s.status] || 'var(--gray-400)',
                    }}
                  />
                </div>
              </div>
            ))}
            {(!stats?.imoveisPorStatus || stats.imoveisPorStatus.length === 0) && (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <p>Nenhum imóvel cadastrado ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* UPCOMING VISITS */}
        <div className={`card ${styles.visitsCard}`}>
          <h2 className={styles.cardTitle}>Próximas Visitas</h2>
          {stats?.visitasProximas && stats.visitasProximas.length > 0 ? (
            <div className={styles.visitList}>
              {stats.visitasProximas.map(v => (
                <div key={v.id} className={styles.visitItem}>
                  <div className={styles.visitDate}>
                    <span className={styles.visitDay}>
                      {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(v.dataVisita))}
                    </span>
                    <span className={styles.visitTime}>
                      {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(v.dataVisita))}
                    </span>
                  </div>
                  <div className={styles.visitInfo}>
                    <span className={styles.visitProp}>{v.imovel.titulo}</span>
                    <span className={styles.visitClient}>{v.cliente.nome}</span>
                  </div>
                  <span className="badge badge-blue">{statusVisitaLabel[v.status]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <p>Nenhuma visita agendada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

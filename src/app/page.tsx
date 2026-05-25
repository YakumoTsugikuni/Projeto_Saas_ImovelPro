import React from 'react'

export default function Page() {
  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --midnight: #0D1B40; --midnight-light: #1A2E6C;
          --blue-mid: #2563EB; --blue-light: #5DADE2; --blue-pale: #AED6F1; --blue-ghost: #EBF5FB;
          --white: #FFFFFF; --off-white: #F8FAFF;
          --gray-50: #F0F4FF; --gray-100: #E1E9FF; --gray-200: #C5D2F0;
          --gray-400: #8898C0; --gray-600: #4A5978; --gray-800: #1E2B4A;
          --success: #10B981; --success-bg: #D1FAE5; --warning: #F59E0B; --danger: #EF4444; --info: #3B82F6;
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 24px;
          --shadow-sm: 0 1px 3px rgba(13,27,64,0.08),0 1px 2px rgba(13,27,64,0.06);
          --shadow-md: 0 4px 16px rgba(13,27,64,0.10),0 2px 8px rgba(13,27,64,0.06);
          --shadow-lg: 0 8px 32px rgba(13,27,64,0.14),0 4px 16px rgba(13,27,64,0.08);
          --shadow-xl: 0 20px 60px rgba(13,27,64,0.20);
          --transition: all 0.2s ease;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: var(--font-sans); background: var(--off-white); color: var(--gray-800); -webkit-font-smoothing: antialiased; }
        .hero { background: linear-gradient(135deg, var(--midnight) 0%, var(--midnight-light) 50%, #0F2460 100%); padding: 80px 32px 60px; text-align: center; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -30%; right: -10%; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(93, 173, 226, 0.08) 0%, transparent 70%); }
        .hero-content { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .hero-logo { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .hero-logo-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.10); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.08); color: var(--white); }
        .hero-logo span { font-size: 1.6rem; font-weight: 800; color: var(--white); letter-spacing: -0.03em; }
        .hero h1 { font-size: 2.2rem; font-weight: 800; color: var(--white); line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 16px; }
        .hero p { font-size: 1.05rem; color: rgba(255,255,255,0.70); line-height: 1.7; max-width: 480px; margin: 0 auto 32px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.10); border-radius: 999px; color: rgba(255,255,255,0.60); font-size: 0.8rem; font-weight: 500; }
        .hero-badge svg { width: 14px; height: 14px; color: var(--success); }
        .section { padding: 56px 32px; }
        .section-title { text-align: center; margin-bottom: 40px; }
        .section-title h2 { font-size: 1.5rem; font-weight: 800; color: var(--midnight); letter-spacing: -0.02em; }
        .section-title p { font-size: 0.9rem; color: var(--gray-600); margin-top: 6px; }
        .screens-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; max-width: 960px; margin: 0 auto; }
        .screen-card { background: var(--white); border-radius: var(--radius-lg); border: 1px solid rgba(13,27,64,0.06); box-shadow: var(--shadow-sm); overflow: hidden; transition: var(--transition); text-decoration: none; color: inherit; display: flex; flex-direction: column; }
        .screen-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .screen-card-preview { height: 140px; display: flex; align-items: center; justify-content: center; position: relative; }
        .screen-card-preview.login { background: linear-gradient(135deg, var(--midnight), var(--midnight-light)); }
        .screen-card-preview.dashboard { background: linear-gradient(135deg, var(--blue-light), var(--blue-mid)); }
        .screen-card-preview.imoveis { background: linear-gradient(135deg, var(--blue-mid), var(--midnight-light)); }
        .screen-card-preview.clientes { background: linear-gradient(135deg, var(--success), #059669); }
        .screen-card-preview.visitas { background: linear-gradient(135deg, var(--warning), #D97706); }
        .screen-card-preview svg { width: 48px; height: 48px; color: rgba(255,255,255,0.30); }
        .screen-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .screen-card-body h3 { font-size: 1rem; font-weight: 700; color: var(--midnight); margin-bottom: 4px; }
        .screen-card-body p { font-size: 0.82rem; color: var(--gray-600); line-height: 1.5; flex: 1; }
        .screen-card-footer { padding: 12px 20px; border-top: 1px solid var(--gray-50); display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; color: var(--gray-400); }
        .screen-card-footer .tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; background: var(--blue-ghost); color: var(--blue-mid); font-size: 0.7rem; font-weight: 600; }
        .features-section { background: var(--white); padding: 56px 32px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; max-width: 960px; margin: 0 auto; }
        .feature-item { text-align: center; padding: 24px 16px; }
        .feature-item-icon { width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--blue-ghost); color: var(--blue-mid); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .feature-item h4 { font-size: 0.95rem; font-weight: 700; color: var(--midnight); margin-bottom: 6px; }
        .feature-item p { font-size: 0.82rem; color: var(--gray-600); line-height: 1.6; }
        .footer { text-align: center; padding: 32px; font-size: 0.8rem; color: var(--gray-400); border-top: 1px solid var(--gray-100); }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: var(--radius-md); font-size: 0.95rem; font-weight: 600; font-family: var(--font-sans); transition: var(--transition); cursor: pointer; white-space: nowrap; border: none; text-decoration: none; }
        .btn-primary { background: linear-gradient(135deg, var(--blue-mid), var(--midnight-light)); color: var(--white); box-shadow: 0 4px 14px rgba(37,99,235,0.30); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.40); }
        .btn-outline { background: transparent; color: var(--white); border: 1.5px solid rgba(255,255,255,0.25); }
        .btn-outline:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.40); }
        .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        @media (max-width: 640px) { .hero { padding: 48px 20px 40px; } .hero h1 { font-size: 1.6rem; } .section { padding: 40px 20px; } .screens-grid { grid-template-columns: 1fr; } .features-grid { grid-template-columns: 1fr 1fr; } }
      ` }} />

      <div className="hero">
        <div className="hero-content">
          <div className="hero-logo">
            <div className="hero-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span>ImóvelPro</span>
          </div>
          <h1>Plataforma inteligente para imobiliárias</h1>
          <p>Gerencie imóveis, clientes e visitas em um só lugar. SaaS completo para corretores e imobiliárias.</p>
          <div className="hero-actions">
            <a href="/dashboard" className="btn btn-primary">Acessar Plataforma</a>
            <a href="#screens" className="btn btn-outline">Ver Telas</a>
          </div>
          <div style={{ marginTop: 24 }}>
            <span className="hero-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Versão de demonstração — dados ilustrativos
            </span>
          </div>
        </div>
      </div>

      <div className="section" id="screens">
        <div className="section-title">
          <h2>Telas do Sistema</h2>
          <p>Navegue pelo protótipo funcional do ImóvelPro</p>
        </div>

        <div className="screens-grid">
          <a className="screen-card" href="/login">
            <div className="screen-card-preview login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="screen-card-body">
              <h3>Login</h3>
              <p>Tela de autenticação com validação de formulário, toggle de senha e design responsivo.</p>
            </div>
            <div className="screen-card-footer">
              <span>Login</span>
              <span className="tag">Auth</span>
            </div>
          </a>

          <a className="screen-card" href="/dashboard">
            <div className="screen-card-preview dashboard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div className="screen-card-body">
              <h3>Dashboard</h3>
              <p>Painel principal com stats animados, gráfico de imóveis por tipo, visitas próximas e atividade recente.</p>
            </div>
            <div className="screen-card-footer">
              <span>Dashboard</span>
              <span className="tag">Data</span>
            </div>
          </a>

          <a className="screen-card" href="/imoveis">
            <div className="screen-card-preview imoveis">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className="screen-card-body">
              <h3>Imóveis</h3>
              <p>CRUD completo com tabela, busca, filtros por tipo e status, modal de cadastro/edição e exclusão.</p>
            </div>
            <div className="screen-card-footer">
              <span>Imóveis</span>
              <span className="tag">CRUD</span>
            </div>
          </a>

          <a className="screen-card" href="/clientes">
            <div className="screen-card-preview clientes">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="screen-card-body">
              <h3>Clientes</h3>
              <p>Visualização em cards com avatar, interesse, status e contagem de visitas. Busca em tempo real.</p>
            </div>
            <div className="screen-card-footer">
              <span>Clientes</span>
              <span className="tag">Cards</span>
            </div>
          </a>

          <a className="screen-card" href="/visitas">
            <div className="screen-card-preview visitas">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="screen-card-body">
              <h3>Visitas</h3>
              <p>Agendamento com status em tempo real, ações de confirmar/cancelar, filtro por status e estátisticas.</p>
            </div>
            <div className="screen-card-footer">
              <span>Visitas</span>
              <span className="tag">Agenda</span>
            </div>
          </a>
        </div>
      </div>

      <div className="features-section">
        <div className="section-title">
          <h2>Funcionalidades</h2>
          <p>Tudo que você precisa para gerenciar seu negócio imobiliário</p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h4>Gestão de Imóveis</h4>
            <p>Cadastro completo com fotos, valores, status, endereço e busca avançada por tipo e status.</p>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h4>Base de Clientes</h4>
            <p>Cadastro e segmentação de clientes com status, interesse e histórico de visitas.</p>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h4>Agenda de Visitas</h4>
            <p>Agende, confirme ou cancele visitas com status em tempo real e histórico completo.</p>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <h4>Dashboard Analítico</h4>
            <p>Visão geral do negócio com estatísticas, gráficos por tipo de imóvel e atividade recente.</p>
          </div>
        </div>
      </div>

      <div className="footer">
        ImóvelPro — Protótipo funcional · Baseado no projeto <a href="https://github.com/YakumoTsugikuni/Projeto_Saas_ImovelPro" style={{ color: 'var(--blue-mid)', textDecoration: 'none', fontWeight: 600 }}>github.com/YakumoTsugikuni/Projeto_Saas_ImovelPro</a>
      </div>
    </div>
  )
}

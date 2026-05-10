import Link from 'next/link'
import styles from './page.module.css'

export default function LandingPage() {
  return (
    <div className={styles.root}>
      {/* NAVBAR */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span>ImóvelPro</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features">Funcionalidades</a>
            <a href="#pricing">Planos</a>
            <a href="#about">Sobre</a>
          </div>
          <div className={styles.navActions}>
            <Link href="/login" className="btn btn-secondary btn-sm">Entrar</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Começar Grátis</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>✨</span> Plataforma #1 para corretores
          </div>
          <h1 className={styles.heroTitle}>
            Gerencie seu negócio<br />
            <span className={styles.heroTitleAccent}>imobiliário</span> com poder
          </h1>
          <p className={styles.heroSubtitle}>
            Controle seus imóveis, clientes e visitas em um só lugar. Aumente suas vendas com ferramentas profissionais desenvolvidas especialmente para corretores e imobiliárias.
          </p>
          <div className={styles.heroActions}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Começar Gratuitamente
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/login" className={`btn btn-secondary btn-lg ${styles.heroSecondaryBtn}`}>
              Ver Demonstração
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>+2.500</strong>
              <span>Corretores ativos</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>+45.000</strong>
              <span>Imóveis gerenciados</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>R$ 4,2Bi</strong>
              <span>Em negócios fechados</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className={styles.heroPreview}>
          <div className={styles.dashPreview}>
            <div className={styles.dashPreviewHeader}>
              <div className={styles.dashPreviewDots}>
                <span /><span /><span />
              </div>
              <span className={styles.dashPreviewTitle}>Dashboard — ImóvelPro</span>
            </div>
            <div className={styles.dashPreviewBody}>
              <div className={styles.dashPreviewStats}>
                {[
                  { label: 'Imóveis', value: '48', color: '#2563EB' },
                  { label: 'Clientes', value: '124', color: '#10B981' },
                  { label: 'Visitas', value: '23', color: '#F59E0B' },
                ].map((stat) => (
                  <div key={stat.label} className={styles.dashPreviewStat} style={{ borderTop: `3px solid ${stat.color}` }}>
                    <span className={styles.dashPreviewStatValue} style={{ color: stat.color }}>{stat.value}</span>
                    <span className={styles.dashPreviewStatLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.dashPreviewChart}>
                {[70, 45, 90, 55, 80, 65, 95].map((h, i) => (
                  <div key={i} className={styles.dashPreviewBar} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features} id="features">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tudo que você precisa para crescer</h2>
            <p className={styles.sectionSubtitle}>Ferramentas completas para gerenciar seu negócio imobiliário com eficiência</p>
          </div>
          <div className={styles.featuresGrid}>
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                ),
                title: 'Gestão de Imóveis',
                desc: 'Cadastre, organize e filtre seu portfólio completo. Casa, apartamento, terreno, comercial — tudo em um só lugar.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
                title: 'CRM de Clientes',
                desc: 'Gerencie compradores, vendedores e locatários. Acompanhe o interesse e orçamento de cada cliente.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
                title: 'Agendamento de Visitas',
                desc: 'Agende e controle todas as visitas aos imóveis. Nunca perca um compromisso importante.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                ),
                title: 'Dashboard com KPIs',
                desc: 'Acompanhe métricas de performance em tempo real. Visualize seu portfólio e oportunidades de negócio.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                title: 'Seguro e Privado',
                desc: 'Seus dados protegidos com autenticação segura. Cada corretor acessa apenas suas próprias informações.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                ),
                title: 'Responsivo',
                desc: 'Acesse de qualquer dispositivo. Desktop, tablet ou celular — a experiência é sempre perfeita.'
              },
            ].map((feature) => (
              <div key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.pricing} id="pricing">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Planos para cada necessidade</h2>
            <p className={styles.sectionSubtitle}>Comece grátis e escale conforme seu negócio cresce</p>
          </div>
          <div className={styles.pricingGrid}>
            {[
              {
                name: 'Starter',
                price: 'Grátis',
                period: 'para sempre',
                color: 'var(--gray-600)',
                features: ['Até 10 imóveis', '20 clientes', '5 visitas/mês', 'Dashboard básico'],
                cta: 'Começar Grátis',
                href: '/register',
                featured: false,
              },
              {
                name: 'Profissional',
                price: 'R$ 97',
                period: 'por mês',
                color: 'var(--blue-mid)',
                features: ['Imóveis ilimitados', 'Clientes ilimitados', 'Visitas ilimitadas', 'Dashboard completo', 'Relatórios avançados', 'Suporte prioritário'],
                cta: 'Assinar Agora',
                href: '/register',
                featured: true,
              },
              {
                name: 'Imobiliária',
                price: 'R$ 297',
                period: 'por mês',
                color: 'var(--midnight)',
                features: ['Tudo do Profissional', 'Multi-corretor', 'Gestão de equipe', 'API de integração', 'Onboarding dedicado', 'SLA garantido'],
                cta: 'Falar com Vendas',
                href: '/register',
                featured: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}>
                {plan.featured && <div className={styles.pricingBadge}>Mais Popular</div>}
                <div className={styles.pricingHeader}>
                  <h3 className={styles.pricingName}>{plan.name}</h3>
                  <div className={styles.pricingPrice}>
                    <span className={styles.pricingAmount} style={{ color: plan.color }}>{plan.price}</span>
                    <span className={styles.pricingPeriod}>/{plan.period}</span>
                  </div>
                </div>
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--success)' }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} btn-block`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.about} id="about">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sobre o ImóvelPro</h2>
            <p className={styles.sectionSubtitle}>Conheça a plataforma que está revolucionando o mercado imobiliário</p>
          </div>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <div className={styles.aboutBlock}>
                <h3>Quem Somos</h3>
                <p>O ImóvelPro é uma plataforma desenvolvida por profissionais do mercado imobiliário que entendem os desafios do dia a dia de corretores e imobiliárias. Nossa missão é simplificar a gestão, aumentar a produtividade e impulsionar as vendas.</p>
              </div>
              <div className={styles.aboutBlock}>
                <h3>Nossa Missão</h3>
                <p>Capacitar corretores e imobiliárias com ferramentas tecnológicas de ponta, permitindo que eles foquem no que realmente importa: fechar negócios e satisfazer seus clientes.</p>
              </div>
              <div className={styles.aboutBlock}>
                <h3>Por Que Escolher ImóvelPro?</h3>
                <ul className={styles.aboutList}>
                  <li>✓ Plataforma intuitiva e fácil de usar</li>
                  <li>✓ Sem necessidade de conhecimento técnico</li>
                  <li>✓ Suporte ativo e dedicado ao seu sucesso</li>
                  <li>✓ Atualizações contínuas com base em feedback dos usuários</li>
                  <li>✓ Segurança de nível enterprise para seus dados</li>
                  <li>✓ Comunidade ativa de corretores para trocar experiências</li>
                </ul>
              </div>
            </div>
            <div className={styles.aboutStats}>
              <div className={styles.aboutStatCard}>
                <div className={styles.aboutStatNumber}>2.500+</div>
                <div className={styles.aboutStatLabel}>Corretores Ativos</div>
                <p>Profissionais confiando em nossa plataforma</p>
              </div>
              <div className={styles.aboutStatCard}>
                <div className={styles.aboutStatNumber}>45.000+</div>
                <div className={styles.aboutStatLabel}>Imóveis Gerenciados</div>
                <p>Propriedades cadastradas e acompanhadas</p>
              </div>
              <div className={styles.aboutStatCard}>
                <div className={styles.aboutStatNumber}>R$ 4,2Bi</div>
                <div className={styles.aboutStatLabel}>Em Negócios</div>
                <p>Volume total de transações facilitadas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Pronto para transformar seu negócio?</h2>
            <p>Junte-se a milhares de corretores que já usam o ImóvelPro</p>
            <Link href="/register" className="btn btn-primary btn-lg">
              Criar conta grátis agora
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span>ImóvelPro</span>
            </div>
            <p className={styles.footerCopy}>© 2025 ImóvelPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

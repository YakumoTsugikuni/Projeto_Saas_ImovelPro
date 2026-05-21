import Link from 'next/link'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span>ImóvelPro</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="#sobre">Sobre</Link>
            <Link href="#planos">Planos</Link>
            <Link href="#funcionalidades">Funcionalidades</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Plataforma imobiliária</span>
          <h1 className={styles.heroTitle}>
            Gerencie seus <span className={styles.heroTitleAccent}>imóveis</span> com mais rapidez.
          </h1>
          <p className={styles.heroSubtitle}>
            A solução completa para corretores e imobiliárias com integração ao Supabase, CRM e agendamento de visitas.
          </p>
          <div className={styles.heroActions}>
            <Link href="/dashboard" className="btn btn-primary">
              Abrir dashboard
            </Link>
            <Link href="/supabase-demo" className="btn btn-secondary">
              Ver demo Supabase
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>+120</strong>
              <span>Imóveis gerenciados</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>24/7</strong>
              <span>Disponível online</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>Integrado</strong>
              <span>Supabase + Prisma</span>
            </div>
          </div>
        </div>

        <div className={styles.heroPreview}>
          <div className={styles.dashPreview}>
            <div className={styles.dashPreviewHeader}>
              <div className={styles.dashPreviewDots}>
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className={styles.dashPreviewBody}>
              <div className={styles.dashPreviewTitle}>Painel ImóvelPro</div>
              <div className={styles.dashPreviewStats}>
                <div className={styles.dashPreviewStat}>
                  <span className={styles.dashPreviewStatValue}>18</span>
                  <span className={styles.dashPreviewStatLabel}>Imóveis ativos</span>
                </div>
                <div className={styles.dashPreviewStat}>
                  <span className={styles.dashPreviewStatValue}>7</span>
                  <span className={styles.dashPreviewStatLabel}>Clientes</span>
                </div>
                <div className={styles.dashPreviewStat}>
                  <span className={styles.dashPreviewStatValue}>4</span>
                  <span className={styles.dashPreviewStatLabel}>Visitas hoje</span>
                </div>
              </div>
              <div className={styles.dashPreviewChart}>
                <div className={styles.dashPreviewBar} style={{ height: '38%' }} />
                <div className={styles.dashPreviewBar} style={{ height: '60%' }} />
                <div className={styles.dashPreviewBar} style={{ height: '84%' }} />
                <div className={styles.dashPreviewBar} style={{ height: '72%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className={styles.about}>
        <div className={`${styles.container} ${styles.aboutContent}`}>
          <div className={styles.aboutText}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Sobre o ImóvelPro</h2>
                <p className={styles.sectionSubtitle}>
                  Gerencie seus imóveis com mais rapidez. A solução completa para corretores e imobiliárias com integração ao Supabase, CRM e agendamento de visitas.
              </p>
            </div>

            <div className={styles.aboutBlock}>
              <h3>Quem Somos</h3>
              <p>
                O ImóvelPro é uma plataforma desenvolvida por profissionais do mercado imobiliário que entendem os desafios do dia a dia de corretores e imobiliárias. Nossa missão é simplificar a gestão, aumentar a produtividade e impulsionar as vendas.
              </p>
            </div>

            <div className={styles.aboutBlock}>
              <h3>Nossa Missão</h3>
              <p>
                Capacitar corretores e imobiliárias com ferramentas tecnológicas de ponta, permitindo que eles foquem no que realmente importa: fechar negócios e satisfazer seus clientes.
              </p>
            </div>

            <div className={styles.aboutBlock}>
              <h3>Por Que Escolher ImóvelPro?</h3>
              <ul className={styles.aboutList}>
                <li>✓ Plataforma intuitiva e fácil de usar</li>
                <li>✓ Sem necessidade de conhecimento técnico</li>
                <li>✓ Suporte ativo e dedicado ao seu sucesso</li>
                <li>✓ Atualizações contínuas com base no feedback dos usuários</li>
                <li>✓ Segurança de nível enterprise para seus dados</li>
                <li>✓ Comunidade ativa de corretores para trocar experiências</li>
              </ul>
            </div>
          </div>

          <div className={styles.aboutStats}>
            <div className={styles.aboutStatCard}>
              <div className={styles.aboutStatNumber}>+120</div>
              <div className={styles.aboutStatLabel}>Imóveis gerenciados</div>
              <p>Acompanhe seus imóveis em uma plataforma unificada</p>
            </div>
            <div className={styles.aboutStatCard}>
              <div className={styles.aboutStatNumber}>24/7</div>
              <div className={styles.aboutStatLabel}>Disponível online</div>
              <p>Conteúdo e dados acessíveis a qualquer hora</p>
            </div>
            <div className={styles.aboutStatCard}>
              <div className={styles.aboutStatNumber}>Integrado</div>
              <div className={styles.aboutStatLabel}>Supabase + Prisma</div>
              <p>Dados e autenticação sincronizados com infraestrutura moderna</p>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Planos para cada necessidade</h2>
            <p className={styles.sectionSubtitle}>Comece grátis e escale conforme seu negócio cresce.</p>
          </div>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <div className={styles.pricingName}>Starter</div>
                <div className={styles.pricingAmount}>Grátis</div>
                <div className={styles.pricingPeriod}>/para sempre</div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Até 10 imóveis</li>
                <li>20 clientes</li>
                <li>5 visitas/mês</li>
                <li>Dashboard básico</li>
              </ul>
              <button className="btn btn-primary btn-block">Começar Grátis</button>
            </div>

            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.pricingHeader}>
                <div className={styles.pricingName}>Mais Popular</div>
                <div className={styles.pricingAmount}>R$ 97</div>
                <div className={styles.pricingPeriod}>/por mês</div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Imóveis ilimitados</li>
                <li>Clientes ilimitados</li>
                <li>Visitas ilimitadas</li>
                <li>Dashboard completo</li>
                <li>Relatórios avançados</li>
                <li>Suporte prioritário</li>
              </ul>
              <button className="btn btn-primary btn-block">Assinar Agora</button>
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <div className={styles.pricingName}>Imobiliária</div>
                <div className={styles.pricingAmount}>R$ 297</div>
                <div className={styles.pricingPeriod}>/por mês</div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Tudo do Profissional</li>
                <li>Multi-corretor</li>
                <li>Gestão de equipe</li>
                <li>API de integração</li>
                <li>Onboarding dedicado</li>
                <li>SLA garantido</li>
              </ul>
              <button className="btn btn-primary btn-block">Falar com Vendas</button>
            </div>
          </div>
        </div>
      </section>

      <section id="funcionalidades" className={`${styles.container} ${styles.features}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tudo que você precisa para crescer</h2>
          <p className={styles.sectionSubtitle}>
            Ferramentas completas para gerenciar seu negócio imobiliário com eficiência.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏠</div>
            <h3 className={styles.featureTitle}>Gestão de Imóveis</h3>
            <p className={styles.featureDesc}>Cadastre, organize e filtre seu portfólio completo. Casa, apartamento, terreno, comercial — tudo em um só lugar.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3 className={styles.featureTitle}>CRM de Clientes</h3>
            <p className={styles.featureDesc}>Gerencie compradores, vendedores e locatários. Acompanhe o interesse e orçamento de cada cliente.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📅</div>
            <h3 className={styles.featureTitle}>Agendamento de Visitas</h3>
            <p className={styles.featureDesc}>Agende e controle todas as visitas aos imóveis. Nunca perca um compromisso importante.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3 className={styles.featureTitle}>Dashboard com KPIs</h3>
            <p className={styles.featureDesc}>Acompanhe métricas de performance em tempo real. Visualize seu portfólio e oportunidades de negócio.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>Seguro e Privado</h3>
            <p className={styles.featureDesc}>Seus dados protegidos com autenticação segura. Cada corretor acessa apenas suas próprias informações.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3 className={styles.featureTitle}>Responsivo</h3>
            <p className={styles.featureDesc}>Acesse de qualquer dispositivo. Desktop, tablet ou celular — a experiência é sempre perfeita.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link href="/" className={styles.footerLogo}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span>ImóvelPro</span>
          </Link>
          <p className={styles.footerCopy}>© 2025 ImóvelPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'ImóvelPro — CRM para corretores e imobiliárias',
  description:
    'Organize imóveis, clientes e visitas em um só lugar. O ImóvelPro é o CRM simples para corretores autônomos e pequenas imobiliárias.',
}

// ✏️ Edite aqui os planos quando os preços estiverem definidos
const PLANS = [
  {
    name: 'Starter',
    price: 'Grátis',
    period: 'para sempre',
    description: 'Para quem está começando a se organizar.',
    features: ['Cadastro de imóveis com fotos', 'CRM de clientes', 'Agenda de visitas', 'Dashboard com métricas'],
    cta: 'Criar conta grátis',
    highlight: false,
  },
  {
    name: 'Profissional',
    price: 'Em breve',
    period: '',
    description: 'Para corretores com carteira grande e imobiliárias.',
    features: ['Tudo do Starter', 'Imóveis e fotos ilimitados', 'Página pública dos imóveis', 'Suporte prioritário'],
    cta: 'Começar no Starter',
    highlight: true,
  },
]

const FEATURES = [
  {
    icon: '🏠',
    title: 'Carteira de imóveis',
    text: 'Cadastre casas, apartamentos e terrenos com fotos, preço, área e endereço. Filtre por tipo e status em segundos.',
  },
  {
    icon: '👥',
    title: 'CRM de clientes',
    text: 'Compradores, vendedores e locatários com orçamento, interesse e histórico. Nada de planilha perdida.',
  },
  {
    icon: '📅',
    title: 'Agenda de visitas',
    text: 'Marque visitas ligando cliente e imóvel. Acompanhe o que está agendado, concluído ou cancelado.',
  },
  {
    icon: '📊',
    title: 'Dashboard',
    text: 'Veja de relance quantos imóveis, clientes e visitas você tem e o valor da sua carteira.',
  },
  {
    icon: '📸',
    title: 'Fotos direto do celular',
    text: 'Arraste ou tire as fotos do imóvel. O ImóvelPro reduz o tamanho sozinho para carregar rápido.',
  },
  {
    icon: '🔒',
    title: 'Seus dados protegidos',
    text: 'Cada corretor vê apenas a própria carteira. Senhas criptografadas e acesso só com login.',
  },
]

const STEPS = [
  { n: '1', title: 'Crie sua conta', text: 'Leva menos de 2 minutos e não pede cartão de crédito.' },
  { n: '2', title: 'Cadastre sua carteira', text: 'Adicione seus imóveis com fotos e os clientes que você atende.' },
  { n: '3', title: 'Agende e acompanhe', text: 'Marque visitas e acompanhe tudo pelo dashboard, no computador ou no celular.' },
]

const FAQ = [
  {
    q: 'Preciso instalar alguma coisa?',
    a: 'Não. O ImóvelPro funciona no navegador do computador ou do celular. É só entrar com seu email e senha.',
  },
  {
    q: 'O plano Starter é grátis mesmo?',
    a: 'Sim. Você cria a conta e usa sem cadastrar cartão. Quando o plano Profissional for lançado, você escolhe se quer mudar.',
  },
  {
    q: 'Outros corretores conseguem ver meus clientes?',
    a: 'Não. Cada conta enxerga somente os próprios imóveis, clientes e visitas.',
  },
  {
    q: 'Funciona para imobiliária com vários corretores?',
    a: 'Hoje cada corretor tem sua própria conta. Contas de equipe, com um administrador, estão nos nossos planos.',
  },
  {
    q: 'E se eu esquecer a senha?',
    a: 'Na tela de login, clique em "Esqueci minha senha" e enviamos um link para você criar uma nova.',
  },
]

function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.logoIcon} aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </span>
      ImóvelPro
    </span>
  )
}

export default async function LandingPage() {
  const session = await auth()
  const loggedIn = !!session?.user

  return (
    <div className={styles.page}>
      {/* NAV */}
      <header className={styles.nav}>
        <div className={styles.container + ' ' + styles.navInner}>
          <Link href="/" aria-label="ImóvelPro — início"><Logo /></Link>
          <nav className={styles.navLinks}>
            <a href="#recursos">Recursos</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#planos">Planos</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <div className={styles.navActions}>
            {loggedIn ? (
              <Link href="/dashboard" className="btn btn-primary">Ir para o painel</Link>
            ) : (
              <>
                <Link href="/login" className={styles.navLogin}>Entrar</Link>
                <Link href="/register" className="btn btn-primary">Criar conta grátis</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.container + ' ' + styles.heroInner}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>CRM imobiliário simples</span>
              <h1>Seus imóveis, clientes e visitas. Num lugar só.</h1>
              <p>
                Pare de procurar contato no WhatsApp e foto em pasta do celular. O ImóvelPro organiza a carteira
                do corretor para você vender mais e se perder menos.
              </p>
              <div className={styles.heroCtas}>
                <Link href={loggedIn ? '/dashboard' : '/register'} className={styles.ctaPrimary}>
                  {loggedIn ? 'Abrir meu painel' : 'Começar grátis'}
                </Link>
                <a href="#como-funciona" className={styles.ctaGhost}>Ver como funciona</a>
              </div>
              <p className={styles.heroNote}>Sem cartão de crédito · Pronto em 2 minutos</p>
            </div>

            {/* Prévia ilustrativa do painel */}
            <div className={styles.mock} aria-hidden>
              <div className={styles.mockBar}><span /><span /><span /></div>
              <div className={styles.mockBody}>
                <div className={styles.mockStats}>
                  <div><small>Imóveis</small><strong>24</strong></div>
                  <div><small>Clientes</small><strong>61</strong></div>
                  <div><small>Visitas</small><strong>9</strong></div>
                </div>
                <div className={styles.mockList}>
                  {[
                    ['Apartamento 3 quartos', 'Jardins · R$ 750 mil', 'Venda'],
                    ['Casa com quintal', 'Vila Mariana · R$ 4.200/mês', 'Aluguel'],
                    ['Terreno 360 m²', 'Alphaville · R$ 480 mil', 'Venda'],
                  ].map(([t, s, tag]) => (
                    <div key={t} className={styles.mockRow}>
                      <div className={styles.mockThumb} />
                      <div className={styles.mockRowText}><b>{t}</b><small>{s}</small></div>
                      <span className={styles.mockTag}>{tag}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.mockVisit}>
                  <span>📅</span>
                  <div><b>Visita hoje, 15h</b><small>Ana Souza · Apartamento 3 quartos</small></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowDark}>Recursos</span>
              <h2>Tudo que o corretor usa no dia a dia</h2>
              <p>Sem curva de aprendizado: se você usa WhatsApp, sabe usar o ImóvelPro.</p>
            </div>
            <div className={styles.features}>
              {FEATURES.map(f => (
                <article key={f.title} className={styles.feature}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowDark}>Como funciona</span>
              <h2>Do cadastro à primeira visita em minutos</h2>
            </div>
            <ol className={styles.steps}>
              {STEPS.map(s => (
                <li key={s.n} className={styles.step}>
                  <span className={styles.stepNum}>{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowDark}>Planos</span>
              <h2>Comece grátis. Cresça quando precisar.</h2>
            </div>
            <div className={styles.plans}>
              {PLANS.map(p => (
                <article key={p.name} className={p.highlight ? styles.planHighlight : styles.plan}>
                  {p.highlight && <span className={styles.planBadge}>Em breve</span>}
                  <h3>{p.name}</h3>
                  <p className={styles.planDesc}>{p.description}</p>
                  <p className={styles.planPrice}>
                    {p.price} {p.period && <small>{p.period}</small>}
                  </p>
                  <ul>
                    {p.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <Link href={loggedIn ? '/dashboard' : '/register'} className={p.highlight ? styles.ctaPrimary : styles.planCta}>
                    {loggedIn ? 'Ir para o painel' : p.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DÚVIDAS */}
        <section id="duvidas" className={styles.sectionAlt}>
          <div className={styles.container + ' ' + styles.faqWrap}>
            <div className={styles.sectionHead}>
              <span className={styles.eyebrowDark}>Dúvidas</span>
              <h2>Perguntas frequentes</h2>
            </div>
            <div className={styles.faq}>
              {FAQ.map(item => (
                <details key={item.q} className={styles.faqItem}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2>Sua carteira organizada a partir de hoje</h2>
            <p>Crie sua conta grátis e cadastre seu primeiro imóvel em minutos.</p>
            <Link href={loggedIn ? '/dashboard' : '/register'} className={styles.ctaPrimary}>
              {loggedIn ? 'Abrir meu painel' : 'Criar conta grátis'}
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container + ' ' + styles.footerInner}>
          <Logo />
          <p>© {new Date().getFullYear()} ImóvelPro. Feito para corretores brasileiros.</p>
          <nav>
            <Link href="/login">Entrar</Link>
            <Link href="/register">Criar conta</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

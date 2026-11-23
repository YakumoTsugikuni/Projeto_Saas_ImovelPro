#  ImóvelPro - SaaS para Imobiliárias

Uma plataforma SaaS moderna, inteligente e de alta performance desenvolvida especialmente para corretores e imobiliárias gerenciarem seus imóveis, clientes e agendamento de visitas com máxima eficiência.

---

##  Novo Visual Premium & Design System

O **ImóvelPro** conta com uma interface de usuário rica, extremamente polida e moderna, projetada para impressionar desde o primeiro contato.

-  **Paleta de Cores Curada**:
  - **Azul da Meia Noite** (`#0D1B40`): Cor principal para textos e headlines, transmitindo solidez e elegância.
  - **Azul Médio** (`#2563EB`): Utilizado para botões primários e interações principais.
  - **Azul Claro** (`#5DADE2`): Para acentos, badges e links importantes.
  - **Off-White** (`#F8FAFF`): Fundo limpo e suave para minimizar a fadiga visual.
-  **Tipografia Moderna**: Uso da fonte **Inter** (Google Fonts) com pesos estrategicamente definidos para excelente legibilidade.
-  **Micro-animações**: Efeitos sutis de *fade-in*, *slide-up* e transições suaves nos botões, cards e overlays de modais, trazendo dinamismo e fluidez para a experiência do usuário.
-  **Responsividade Total (Mobile-First)**: Otimização completa para qualquer tamanho de tela (desktops, tablets e smartphones).

---

##  Stack Tecnológica

O projeto utiliza o que há de mais moderno no ecossistema de desenvolvimento web:

- **Framework**: [Next.js 14/15/16](https://nextjs.org/) (App Router & API Routes)
- **Biblioteca de Interface**: [React 19](https://react.dev/)
- **ORM & Banco**: [Prisma ORM 7](https://www.prisma.io/) com suporte a banco de dados PostgreSQL
- **Integração Cloud / Realtime**: [Supabase](https://supabase.com/) (`@supabase/ssr` e `@supabase/supabase-js`)
- **Conectividade**: `@prisma/adapter-pg` e `pg` pool para conexões robustas em ambientes serverless
- **Autenticação**: [NextAuth.js](https://next-auth.js.org/) & `bcryptjs`
- **Ícones**: [Lucide React](https://lucide.dev/)

---

##  Principais Funcionalidades

-  **Autenticação Segura**: Login completo com NextAuth, hash de senhas com bcrypt, sessões seguras em JWT e proteção automática de rotas do sistema.
-  **Gestão de Imóveis**: CRUD completo com filtros dinâmicos por tipo (Casa, Apartamento, Terreno) e status (Venda, Aluguel, Vendido, Alugado).
-  **Gestão de Clientes**: Cadastro detalhado de prospects e clientes, rastreamento de orçamento de interesse e observações gerais.
-  **Controle de Visitas**: Agendamento integrado de visitas associando corretores, clientes e imóveis com status em tempo real (Agendada, Concluída, Cancelada).
-  **Dashboard Analytics**: Gráficos analíticos, contagem de portfólio total em valores, visitas agendadas próximas e acompanhamento de metas.
-  **Integração com Supabase**: Conectividade direta ao Supabase para leitura e gravação assíncrona, além de uma página de demonstração dedicada (`/supabase-demo`) para verificar a sincronização de dados em tempo real.

---

##  Como Começar Localmente

### Pré-requisitos
- Node.js 18+
- Provedor PostgreSQL (local ou na nuvem via Supabase)

### 1. Clonar o Projeto e Instalar Dependências
```bash
git clone https://github.com/YakumoTsugikuni/Projeto_Saas_ImovelPro.git
cd imovel-pro
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` ou `.env.local` na raiz do projeto (use o `.env.example` como referência):

```env
# Banco de Dados (Supabase Pooler PostgreSQL)
DATABASE_URL="postgresql://postgres.USER:PASSWORD@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true"

# Supabase Public Keys (Para o cliente SSR)
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sua-chave-publica-anonima"

# NextAuth
NEXTAUTH_SECRET="uma-chave-secreta-altamente-segura"
NEXTAUTH_URL="http://localhost:3000"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Sincronizar o Schema e Popular o Banco
Execute os comandos do Prisma para aplicar o schema ao banco de dados PostgreSQL/Supabase e popular a tabela com dados fictícios para teste:

```bash
# Sincroniza o schema com o banco de dados
npm run db:push

# Popula o banco com os dados iniciais do corretor de exemplo
npm run db:seed
```

### 4. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

---

##  Dados de Acesso (Teste)

Se você executou o seed do banco de dados (`npm run db:seed`), pode utilizar as seguintes credenciais para acessar o painel administrativo:

- **E-mail**: `corretor@example.com`
- **Senha**: `123456`

---

##  Estrutura de Diretórios Relevantes

```
imovel-pro/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados PostgreSQL
│   └── seed.ts                # Script para popular o banco de dados
├── src/
│   ├── app/
│   │   ├── (auth)/            # Rotas de Autenticação (Login e Registro)
│   │   ├── (dashboard)/       # Área logada (Dashboard, Imóveis, Clientes, Visitas, Perfil)
│   │   ├── api/               # API Routes do Next.js
│   │   ├── supabase-demo/     # Página demonstrativa de conexão direta com Supabase
│   │   ├── globals.css        # Variáveis CSS e estilos globais
│   │   └── page.tsx           # Landing Page premium com o protótipo funcional
│   ├── components/            # Componentes reutilizáveis polidos
│   ├── lib/                   # Configurações do NextAuth e cliente Prisma
│   └── utils/
│       └── supabase/          # Clientes server/client/middleware do Supabase SSR
└── package.json
```

---

##  Scripts Disponíveis

No arquivo `package.json` você encontrará os seguintes comandos prontos para uso:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento local |
| `npm run build` | Compila o projeto Next.js para produção |
| `npm run start` | Inicia o servidor de produção compilado localmente |
| `npm run lint` | Executa a verificação estática do código (ESLint) |
| `npm run db:push` | Sincroniza o schema do Prisma com o banco de dados conectado |
| `npm run db:studio` | Abre o Prisma Studio (interface web para gerenciar tabelas) |
| `npm run db:seed` | Popula o banco com dados iniciais e corretor de testes |

---

##  Deploy na Vercel

O projeto está totalmente configurado para deploy imediato na **Vercel**:

1. Crie um novo projeto na Vercel e importe o seu repositório do GitHub.
2. Defina o **Root Directory** como `imovel-pro` caso esteja usando em subpasta.
3. Insira as variáveis de ambiente necessárias (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
4. Clique em **Deploy**! A Vercel executará o build automaticamente e entregará seu app com certificados SSL ativos.
5. Após o deploy, certifique-se de executar as migrations e o seed utilizando o terminal CLI do projeto ou conectando suas variáveis localmente para popular o banco de produção.

---

##  Checklist de Funcionalidades

- [x] Landing Page Premium & Responsiva
- [x] Autenticação Segura (Login & Registro)
- [x] CRUD de Imóveis (Filtros & Busca)
- [x] CRUD de Clientes (Segmentação & Orçamentos)
- [x] CRUD de Visitas (Status & Agendamento Integrado)
- [x] Dashboard Analítico com Estatísticas
- [x] Perfil do Corretor (Edição de CRECI, Empresa e Senha)
- [x] Conectividade com Supabase (Direct SQL & SSR Middleware)
- [ ] Upload de Fotos de Imóveis (Integração com Supabase Storage)
- [ ] Relatórios em PDF de Vendas/Visitas
- [ ] Envio de Confirmação de Visita por E-mail

---

##  Documentação

Toda a documentação fica em [`docs/`](docs/) — comece pelo [índice](docs/INDEX.md).

- [Desenvolvimento](docs/DEVELOPMENT.md) · [Deploy](docs/DEPLOYMENT.md) · [Testes](docs/TESTING.md) · [FAQ](docs/FAQ.md)
- [Padrões](docs/PATTERNS.md) · [Visual](docs/VISUAL.md) · [Arquivos](docs/FILES.md) · [Resumo](docs/SUMMARY.md)
- Segurança: [auditoria](docs/seguranca/SECURITY_AUDIT_REPORT.md) · [melhorias](docs/seguranca/SECURITY_IMPROVEMENTS.md)
- Estudo e apresentação: [`docs/pdf/`](docs/pdf/) (gerados por `python scripts/gerar_pdf_estudo.py` e `scripts/gerar_pdf_apresentacao.py`)

##  Licença

Este projeto é licenciado sob a licença MIT. Sinta-se livre para utilizar, modificar e distribuir o código conforme necessário.

---

Desenvolvido com ❤️ para imobiliárias e corretores de alta performance.

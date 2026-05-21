# 📚 DOCUMENTAÇÃO DE ESTUDOS - IMÓVELPRO

**Última atualização:** Maio de 2026

---

## 📋 SUMÁRIO

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Stack Tecnológico Completo](#stack-tecnológico-completo)
3. [Arquitetura do Projeto](#arquitetura-do-projeto)
4. [Banco de Dados](#banco-de-dados)
5. [APIs e Endpoints](#apis-e-endpoints)
6. [Componentes React](#componentes-react)
7. [Hooks Customizados](#hooks-customizados)
8. [Autenticação e Segurança](#autenticação-e-segurança)
9. [Padrões de Código](#padrões-de-código)
10. [Fluxos de Trabalho](#fluxos-de-trabalho)
11. [Deployment e Produção](#deployment-e-produção)
12. [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## 🎯 VISÃO GERAL DO PROJETO

### O que é ImóvelPro?

ImóvelPro é uma **plataforma SaaS (Software as a Service)** completa e moderna para gerenciamento imobiliário. É especialmente desenvolvida para:

- **Corretores independentes** - Gerenciar seu portfólio de imóveis
- **Imobiliárias** - Centralizar operações de múltiplos corretores
- **Investidores** - Controlar propriedades e locações

### Funcionalidades Principais

✅ **Autenticação Segura** - Sistema de login com JWT  
✅ **Gestão de Imóveis** - CRUD com filtros avançados  
✅ **Gestão de Clientes** - Controle de prospects e vendedores  
✅ **Agendamento de Visitas** - Calendário de compromissos  
✅ **Dashboard Analytics** - Estatísticas e KPIs  
✅ **Perfil de Usuário** - Dados profissionais  
✅ **Interface Responsiva** - Desktop, tablet e mobile  
✅ **Banco de Dados Relacional** - Relacionamentos estruturados  

---

## 🛠️ STACK TECNOLÓGICO COMPLETO

### Framework Frontend
- **Next.js** `v16.2.6` - Framework React full-stack com SSR/SSG
- **React** `v19.2.6` - Biblioteca para construir UIs
- **React DOM** `v19.2.6` - Renderização de componentes React no navegador

### Linguagem e Tipagem
- **TypeScript** `v5.9.3` - Linguagem tipada para JavaScript
  - Target: ES2017
  - JSX: react-jsx
  - Modo: strict
  - Paths: configurados com `@/*` para imports diretos

### Banco de Dados
- **Prisma** `v5.15.0` - ORM (Object-Relational Mapping)
  - Gerador automático de tipos
  - Migrações e seed automáticas
  - Suporte a SQLite, PostgreSQL, MySQL, MariaDB
- **SQLite** - Banco de dados padrão em desenvolvimento
- **@prisma/client** `v5.15.0` - Cliente para interagir com banco

### Autenticação
- **NextAuth** `v5.0.0-beta.19` - Solução de autenticação para Next.js
  - Providers: Credentials (email/senha)
  - Estratégia: JWT
  - Callbacks: token, session

### Segurança e Hashing
- **bcryptjs** `v2.4.3` - Hashing seguro de senhas
  - Proteção contra ataques de força bruta
  - Salt rounds padrão: 10

### UI e Ícones
- **lucide-react** `v0.395.0` - Biblioteca de ícones SVG
  - Ícones leves e customizáveis
  - Mais de 500 ícones disponíveis

### Estilo
- **CSS Modules** - CSS com escopo local
  - Não há dependência de bibliotecas externas
  - Arquivos: `*.module.css`
  - Design system: Azul, Branco, Azul da Meia Noite

### Ferramentas de Desenvolvimento
- **ESLint** `v9.39.4` - Linter para JavaScript/TypeScript
  - Config: next/core-web-vitals
- **ts-node** `v10.9.2` - Executar TypeScript diretamente

### Dependências de Tipo
- **@types/node** `v20.19.40` - Tipos para Node.js
- **@types/react** `v18` - Tipos para React
- **@types/react-dom** `v18` - Tipos para React DOM
- **@types/bcryptjs** `v2.4.6` - Tipos para bcryptjs

---

## 🏗️ ARQUITETURA DO PROJETO

### Estrutura de Pastas

```
imovel-pro/
│
├── src/
│   ├── app/                          # App Router do Next.js
│   │   ├── layout.tsx                # Layout raiz
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Estilos globais
│   │   │
│   │   ├── (auth)/                   # Grupo de rotas: Autenticação
│   │   │   ├── auth.module.css
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/              # Grupo de rotas: Dashboard (Protegido)
│   │   │   ├── layout.tsx            # Layout com sidebar
│   │   │   ├── dashboard.module.css
│   │   │   ├── dashboard/
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx          # Dashboard principal
│   │   │   ├── clientes/
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── imoveis/
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── visitas/
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   └── perfil/
│   │   │       ├── page.module.css
│   │   │       └── page.tsx
│   │   │
│   │   ├── imoveis/                  # Página pública de imóvel
│   │   │   └── [id]/
│   │   │       ├── page.module.css
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                      # Rotas de API
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts      # Rotas NextAuth
│   │       ├── clientes/
│   │       │   ├── route.ts          # GET/POST clientes
│   │       │   └── [id]/
│   │       │       └── route.ts      # GET/PUT/DELETE cliente
│   │       ├── imoveis/
│   │       │   ├── route.ts          # GET/POST imóveis
│   │       │   └── [id]/
│   │       │       └── route.ts      # GET/PUT/DELETE imóvel
│   │       ├── visitas/
│   │       │   ├── route.ts          # GET/POST visitas
│   │       │   └── [id]/
│   │       │       └── route.ts      # GET/PUT/DELETE visita
│   │       ├── perfil/
│   │       │   └── route.ts          # GET/PUT perfil
│   │       ├── register/
│   │       │   └── route.ts          # POST registro
│   │       └── dashboard/
│   │           └── stats/
│   │               └── route.ts      # GET estatísticas
│   │
│   ├── components/                   # Componentes React Reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Card.tsx
│   │   ├── Card.module.css
│   │   ├── Modal.tsx
│   │   ├── Modal.module.css
│   │   ├── Toast.tsx
│   │   ├── Toast.module.css
│   │   ├── Sidebar.tsx
│   │   ├── Sidebar.module.css
│   │   ├── Skeleton.tsx
│   │   ├── Skeleton.module.css
│   │   └── EmptyState.tsx
│   │       └── EmptyState.module.css
│   │
│   ├── hooks/                        # Hooks Customizados
│   │   ├── index.ts                  # Exporta todos os hooks
│   │   ├── useFetch.ts               # Hook para requisições HTTP
│   │   └── useToast.ts               # Hook para notificações
│   │
│   ├── lib/                          # Utilitários e Configurações
│   │   ├── auth.ts                   # Configuração NextAuth
│   │   ├── db.ts                     # Cliente Prisma
│   │   ├── middleware.ts             # Middleware de autenticação
│   │   ├── securityHeaders.ts        # Headers de segurança
│   │   ├── rateLimit.ts              # Rate limiting
│   │   ├── validation.ts             # Validações
│   │   ├── clientValidation.ts       # Validações do lado cliente
│   │   └── utils.ts                  # Funções utilitárias
│   │
│   ├── types/                        # Tipos TypeScript Globais
│   │   ├── index.ts                  # Tipos de entidades
│   │   ├── next-auth.d.ts            # Tipos estendidos NextAuth
│   │   └── security.ts               # Tipos de segurança
│   │
│   └── middleware.ts                 # Middleware global do Next.js
│
├── prisma/
│   ├── schema.prisma                 # Schema do banco de dados
│   ├── seed.ts                       # Script para popular dados
│   └── dev.db                        # Banco SQLite (produção)
│
├── package.json                      # Dependências e scripts
├── tsconfig.json                     # Configuração TypeScript
├── next.config.js                    # Configuração Next.js
│
└── Documentação/
    ├── README.md                     # Guia rápido de início
    ├── SUMMARY.md                    # Sumário executivo
    ├── DEVELOPMENT.md                # Guia de desenvolvimento
    ├── DEPLOYMENT.md                 # Guia de deployment
    ├── PATTERNS.md                   # Padrões de código
    ├── FILES.md                      # Documentação dos arquivos
    ├── TESTING.md                    # Guia de testes
    └── SECURITY_*.md                 # Documentação de segurança
```

### Padrão Arquitetural: Modelo em Camadas

```
┌─────────────────────────────────────┐
│        Camada Apresentação          │
│    (React Components, Pages)        │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Camada de Negócio            │
│   (Hooks, Validation, Utils)        │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Camada de Dados             │
│    (API Routes, Prisma, DB)         │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      Camada de Persistência         │
│   (SQLite, PostgreSQL, MySQL)       │
└─────────────────────────────────────┘
```

---

## 🗄️ BANCO DE DADOS

### Modelo de Dados (Prisma Schema)

```prisma
// 1. USUÁRIOS (CORRETORES/ADMIN)
model User {
  id        String    @id @default(cuid())
  nome      String?
  email     String    @unique
  password  String
  role      String    @default("CORRETOR")
  phone     String?
  avatar    String?
  creci     String?
  empresa   String?
  
  imoveis   Imovel[]
  clientes  Cliente[]
  visitas   Visita[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// 2. IMÓVEIS
model Imovel {
  id          String   @id @default(cuid())
  titulo      String
  descricao   String?
  preco       Float
  tipo        String   // CASA, APARTAMENTO, TERRENO
  status      String   @default("VENDA")
  
  area        Float?
  quartos     Int?
  banheiros   Int?
  vagas       Int?
  
  endereco    String?
  cidade      String?
  estado      String?
  cep         String?
  
  imagens     String?    @default("[]")
  destaque    Boolean    @default(false)
  
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  visitas     Visita[]
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

// 3. CLIENTES
model Cliente {
  id          String   @id @default(cuid())
  nome        String
  email       String   @unique
  telefone    String?
  tipo        String   // COMPRADOR, VENDEDOR, LOCATARIO
  
  interesse   String?
  orcamento   Float?
  observacoes String?
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  visitas     Visita[]
  
  createdAt   DateTime @default(now())
}

// 4. VISITAS/AGENDAMENTOS
model Visita {
  id          String   @id @default(cuid())
  dataVisita  DateTime
  status      String   @default("AGENDADA")
  observacoes String?
  
  imovelId    String
  imovel      Imovel   @relation(fields: [imovelId], references: [id])
  
  clienteId   String
  cliente     Cliente  @relation(fields: [clienteId], references: [id])
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  createdAt   DateTime @default(now())
}
```

### Tipos de Dados e Relacionamentos

| Entidade | ID | Tipo | Relacionamentos |
|----------|-----|------|-----------------|
| **User** | CUID | Autenticação | 1:N com Imovel, Cliente, Visita |
| **Imovel** | CUID | Propriedade | N:1 com User, 1:N com Visita |
| **Cliente** | CUID | Prospect | N:1 com User, 1:N com Visita |
| **Visita** | CUID | Agendamento | N:1 com User, Imovel, Cliente |

### Índices e Constraints

- `User.email` - UNIQUE
- `Cliente.email` - UNIQUE
- Foreign Keys para integridade referencial
- CUID para IDs descentralizados

---

## 🔌 APIS E ENDPOINTS

### Organização de Endpoints

```
Base URL: /api/
```

### 1. Autenticação

```
POST   /auth/[...nextauth]
  - Signin (Credentials)
  - Callback
  - Session
  - CSRF
```

**Fluxo:**
1. Usuário envia email + senha
2. NextAuth valida com CredentialsProvider
3. JWT é gerado e armazenado em cookie
4. Sessão é criada

### 2. Usuários / Registro

```
POST   /register
  - body: { nome, email, password }
  - response: { id, email, nome }
```

**Validações:**
- Email único
- Senha mínimo 8 caracteres (opcional com força)
- Hashing com bcryptjs

### 3. Imóveis

```
GET    /imoveis
  - Query: ?status=VENDA&tipo=CASA&cidade=SP
  - response: Imovel[]

POST   /imoveis
  - body: { titulo, descricao, preco, tipo, status, ... }
  - response: { id, ... }

GET    /imoveis/[id]
  - response: Imovel

PUT    /imoveis/[id]
  - body: { titulo, descricao, ... }
  - response: { id, ... }

DELETE /imoveis/[id]
  - response: { success: true }
```

### 4. Clientes

```
GET    /clientes
  - Query: ?tipo=COMPRADOR
  - response: Cliente[]

POST   /clientes
  - body: { nome, email, telefone, tipo, ... }
  - response: { id, ... }

GET    /clientes/[id]
  - response: Cliente

PUT    /clientes/[id]
  - body: { nome, email, ... }
  - response: { id, ... }

DELETE /clientes/[id]
  - response: { success: true }
```

### 5. Visitas

```
GET    /visitas
  - Query: ?status=AGENDADA
  - response: Visita[]

POST   /visitas
  - body: { dataVisita, imovelId, clienteId, status, ... }
  - response: { id, ... }

GET    /visitas/[id]
  - response: Visita

PUT    /visitas/[id]
  - body: { dataVisita, status, ... }
  - response: { id, ... }

DELETE /visitas/[id]
  - response: { success: true }
```

### 6. Perfil

```
GET    /perfil
  - response: User (do usuário autenticado)

PUT    /perfil
  - body: { nome, phone, avatar, creci, empresa, ... }
  - response: { id, ... }
```

### 7. Dashboard

```
GET    /dashboard/stats
  - response: {
      totalImoveis: number,
      totalClientes: number,
      totalVisitas: number,
      portfolioTotal: number,
      proximasVisitas: Visita[],
      distribuicaoStatus: { [key]: number }
    }
```

### Padrão de Resposta

**Sucesso (200):**
```json
{
  "id": "cuid123",
  "nome": "Casa Moderna",
  "preco": 450000
}
```

**Erro (400/401/403/500):**
```json
{
  "error": "Mensagem de erro descritiva"
}
```

### Autenticação de Requisições

Todas as rotas de API (exceto `/register` e `/auth`) requerem:

```
Header: Authorization: Bearer <jwt-token>
```

Ou sessão ativa no NextAuth.

---

## ⚛️ COMPONENTES REACT

### Componentes Principais

#### 1. Button

```tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

// Uso:
<Button variant="primary" size="lg" loading={isLoading}>
  Salvar Imóvel
</Button>
```

**Estilos:**
- Primary: Azul brilhante (ação principal)
- Secondary: Azul claro (ações secundárias)
- Danger: Vermelho (destruição de dados)

#### 2. Card

```tsx
interface CardProps {
  children: React.ReactNode
  title?: string
  hoverable?: boolean
  onClick?: () => void
}

// Uso:
<Card hoverable title="Imóvel em Destaque">
  <img src={imageUrl} />
  <p>R$ 450.000,00</p>
</Card>
```

#### 3. Modal

```tsx
interface ModalProps {
  isOpen: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  actions?: React.ReactNode
}

// Uso:
<Modal
  isOpen={showModal}
  title="Confirmar Deleção"
  onClose={() => setShowModal(false)}
  actions={<Button onClick={handleDelete}>Deletar</Button>}
>
  Tem certeza que deseja deletar este imóvel?
</Modal>
```

#### 4. Toast

```tsx
interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

// Uso:
<Toast message="Imóvel salvo com sucesso!" type="success" />
```

#### 5. Sidebar

```tsx
// Menu lateral de navegação
// Links dinâmicos baseados no papel do usuário
// Temas claro/escuro (preparado)
```

#### 6. Skeleton

```tsx
// Componente de carregamento
// Simulação de conteúdo enquanto carrega
```

#### 7. EmptyState

```tsx
interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

// Uso para listas vazias
<EmptyState
  icon={<PlusIcon />}
  title="Nenhum imóvel"
  description="Comece criando um novo imóvel"
  action={<Button>Criar Imóvel</Button>}
/>
```

### Sistema de Estilos com CSS Modules

```css
/* Button.module.css */
.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.button.primary {
  background-color: #0066cc;
  color: white;
}

.button:hover.primary {
  background-color: #0052a3;
}

.button.loading {
  opacity: 0.7;
  pointer-events: none;
}
```

---

## 🎣 HOOKS CUSTOMIZADOS

### useFetch Hook

```typescript
function useFetch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(async <T,>(
    url: string,
    options?: RequestInit
  ): Promise<T | null> => {
    // Lógica de requisição HTTP com tratamento de erro
  }, [])

  return { loading, error, request }
}

// Uso:
const { loading, error, request } = useFetch()

const fetchImoveis = async () => {
  const data = await request('/api/imoveis')
  setImoveis(data)
}
```

### useToast Hook

```typescript
function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return { toast, showToast }
}

// Uso:
const { showToast } = useToast()
showToast('Imóvel salvo!', 'success')
```

### Hooks Nativos Utilizados

- **useState** - Gerenciamento de estado local
- **useCallback** - Memoização de callbacks
- **useEffect** - Efeitos colaterais
- **useContext** - Contexto global (preparado)
- **useReducer** - Gerenciamento complexo de estado (preparado)

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

### Fluxo de Autenticação

```
1. Usuário acessa /login
2. Preenche email + senha
3. Submete formulário → POST /api/auth/signin
4. NextAuth valida com CredentialsProvider
5. Bcryptjs valida senha contra hash no banco
6. JWT é gerado e armazenado em HttpOnly Cookie
7. Usuário é redirecionado para /dashboard
8. Middleware valida token em cada requisição
9. Rotas protegidas verificam sessão ativa
```

### Configuração NextAuth

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      // Email + Senha
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )
        return passwordMatch ? user : null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Adiciona dados ao token
      if (user) token.id = user.id
    },
    async session({ session, token }) {
      // Adiciona dados à sessão
      session.user.id = token.id
    },
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
})
```

### Proteção de Rotas

**Middleware.ts:**
```typescript
export default auth((req) => {
  const isLoggedIn = !!req.auth
  
  if (isDashboardPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
})
```

### Hashing de Senhas

```typescript
import bcrypt from 'bcryptjs'

// Criar hash (ao registrar)
const hash = await bcrypt.hash(password, 10)

// Validar hash (ao fazer login)
const isValid = await bcrypt.compare(password, hash)
```

### Segurança Implementada

✅ **HTTPS em Produção** - Certificado SSL  
✅ **JWT Seguro** - HttpOnly Cookies  
✅ **CSRF Protection** - NextAuth incluso  
✅ **Rate Limiting** - Proteção contra força bruta  
✅ **XSS Protection** - Sanitização de inputs  
✅ **SQL Injection** - Prisma usa parameterização  
✅ **Validação de Entrada** - Schemas customizados  
✅ **Headers de Segurança** - Inclusos no projeto  

---

## 🎨 PADRÕES DE CÓDIGO

### Padrão de Componente React

```typescript
import styles from './MyComponent.module.css'

interface MyComponentProps {
  id: string
  title: string
  children: React.ReactNode
  loading?: boolean
  variant?: 'default' | 'primary'
  onAction?: () => void
}

/**
 * Componente de exemplo
 * @param id - Identificador único
 * @param title - Título do componente
 * @param children - Conteúdo interno
 * @param loading - Estado de carregamento
 * @param variant - Variação visual
 * @param onAction - Callback de ação
 */
export default function MyComponent({
  id,
  title,
  children,
  loading = false,
  variant = 'default',
  onAction,
}: MyComponentProps) {
  return (
    <div className={`${styles.container} ${styles[variant]}`}>
      {loading && <div className={styles.spinner} />}
      <h2>{title}</h2>
      <div>{children}</div>
      {onAction && (
        <button onClick={onAction}>Executar</button>
      )}
    </div>
  )
}
```

### Padrão de API Route

```typescript
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // 1. Validar autenticação
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // 2. Validar input
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    // 3. Buscar dados
    const items = await prisma.imovel.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status }),
      },
    })

    // 4. Retornar resposta
    return NextResponse.json(items)
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

### Padrão de Validação

```typescript
import { validateEmail, sanitizeString, validateNumericString } from '@/lib/validation'

export function validateClienteInput(data: unknown): ValidatedClienteData {
  // Tipagem segura
  if (typeof data !== 'object' || !data) {
    throw new Error('Dados inválidos')
  }

  const obj = data as Record<string, unknown>

  // Validar cada campo
  const nome = sanitizeString(obj.nome as string)
  if (!nome) throw new Error('Nome é obrigatório')

  const email = sanitizeString(obj.email as string)
  if (!validateEmail(email)) throw new Error('Email inválido')

  const telefone = sanitizeString(obj.telefone as string)
  if (!telefone) throw new Error('Telefone é obrigatório')

  return {
    nome,
    email: email || undefined,
    telefone,
    tipo: sanitizeString(obj.tipo as string) || undefined,
  }
}
```

### Padrão de Página

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useFetch } from '@/hooks'
import Card from '@/components/Card'
import Button from '@/components/Button'

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function ClientesPage({ searchParams }: PageProps) {
  const [clientes, setClientes] = useState([])
  const { loading, error, request } = useFetch()

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await request('/api/clientes')
      if (data) setClientes(data)
    }
    fetchClientes()
  }, [request])

  if (error) return <div>Erro: {error}</div>
  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <h1>Clientes</h1>
      {clientes.map(cliente => (
        <Card key={cliente.id}>
          <h2>{cliente.nome}</h2>
          <p>{cliente.email}</p>
        </Card>
      ))}
    </div>
  )
}
```

---

## 🔄 FLUXOS DE TRABALHO

### Fluxo de Registro

```
1. Usuário acessa /register
2. Preenche: nome, email, senha
3. Valida inputs no cliente
4. POST /api/register { nome, email, password }
5. Backend valida email único
6. Hasheia senha com bcryptjs
7. Cria usuário no banco
8. Retorna id + email
9. Redireciona para /login
```

### Fluxo de Criação de Imóvel

```
1. Usuário acessa /dashboard/imoveis
2. Clica "Novo Imóvel"
3. Preenche formulário:
   - Título, descrição
   - Tipo (Casa/Apt/Terreno)
   - Status (Venda/Aluguel)
   - Preço, área, quartos
   - Endereço, cidade, estado
4. Clica "Salvar"
5. POST /api/imoveis { titulo, preco, ... }
6. Backend valida dados
7. Cria Imovel vinculado ao usuário
8. Retorna novo imóvel
9. Toast de sucesso
10. Atualiza lista na tela
```

### Fluxo de Agendamento de Visita

```
1. Usuário acessa /dashboard/visitas
2. Clica "Agendar Visita"
3. Seleciona imóvel (dropdown)
4. Seleciona cliente (dropdown)
5. Escolhe data/hora
6. Preenche observações
7. Clica "Agendar"
8. POST /api/visitas { imovelId, clienteId, dataVisita, ... }
9. Backend verifica disponibilidade
10. Cria Visita no banco
11. Toast de sucesso
12. Visita aparece no calendário
13. Email de notificação (futura feature)
```

### Fluxo de Atualização de Perfil

```
1. Usuário clica na foto/nome no topo
2. Acessa /dashboard/perfil
3. Edita informações:
   - Nome, phone, avatar
   - CRECI (registro profissional)
   - Empresa
   - Senha (opcional)
4. PUT /api/perfil { nome, phone, creci, ... }
5. Backend valida dados
6. Atualiza User no banco
7. Toast de confirmação
8. Informações são atualizadas na sessão
```

---

## 🚀 DEPLOYMENT E PRODUÇÃO

### Pré-requisitos para Deploy

- ✅ Repositório Git (GitHub/GitLab)
- ✅ Conta Vercel ou plataforma similar
- ✅ Banco de dados externo (Supabase, PlanetScale, Neon)
- ✅ Domínio customizado (opcional)

### Passo 1: Preparar Banco de Dados

**Opção 1: Supabase (Recomendado)**
```bash
# 1. Criar conta em https://supabase.com
# 2. Novo projeto
# 3. Copiar string de conexão PostgreSQL
# 4. Adicionar ?schema=public
# 5. Configurar em .env.production
```

**Opção 2: PlanetScale**
```bash
# 1. Criar conta em https://planetscale.com
# 2. Novo banco MySQL
# 3. Copiar string de conexão
```

### Passo 2: Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
# Copiar para .env.production
```

### Passo 3: Deploy no Vercel

```bash
# Via CLI
npm i -g vercel
vercel login
vercel --prod

# Ou via web dashboard:
# 1. https://vercel.com/dashboard
# 2. Import projeto GitHub
# 3. Configure variáveis de ambiente
# 4. Deploy automático
```

### Passo 4: Configurar Banco em Produção

```bash
# Após deploy
vercel env pull .env.production.local

# Rodar migrações
npx prisma migrate deploy --skip-generate

# Seed dados iniciais (opcional)
npx prisma db seed
```

### Variáveis de Ambiente em Produção

```env
# Base de Dados
DATABASE_URL=postgresql://user:password@host:port/db?schema=public

# NextAuth
NEXTAUTH_SECRET=<chave-aleatória-segura>
NEXTAUTH_URL=https://seu-dominio.com

# Node
NODE_ENV=production
```

### Checklist de Produção

- [ ] Banco de dados configurado e testado
- [ ] Variáveis de ambiente seguras
- [ ] Certificado SSL/TLS
- [ ] Email de notificação (opcional)
- [ ] Backups automáticos
- [ ] Monitoring e logs
- [ ] Rate limiting ativo
- [ ] Headers de segurança
- [ ] CORS configurado
- [ ] CDN para assets estáticos

---

## 📖 GUIA DE DESENVOLVIMENTO

### Ambiente de Desenvolvimento

```bash
# 1. Clonar projeto
git clone <repo-url>
cd imovel-pro

# 2. Instalar dependências
npm install

# 3. Configurar .env.local
# DATABASE_URL=file:./prisma/dev.db
# NEXTAUTH_SECRET=<qualquer-coisa>
# NEXTAUTH_URL=http://localhost:3000

# 4. Setup banco de dados
npm run db:push
npm run db:seed

# 5. Iniciar servidor
npm run dev

# 6. Acessar http://localhost:3000
```

### Dados de Teste

```
Email: corretor@example.com
Senha: 123456
```

### Scripts Disponíveis

```bash
npm run dev              # Inicia dev server (port 3000)
npm run build            # Build para produção
npm start                # Inicia servidor prod
npm run lint             # Executa ESLint
npm run db:push          # Sync banco com schema
npm run db:studio        # Abre Prisma Studio
npm run db:seed          # Popula dados de teste
```

### Estrutura de Tipo

```typescript
// Sempre tipar componentes
interface MyComponentProps {
  id: string
  title: string
  children?: React.ReactNode
  loading?: boolean
}

// Tipar hooks
const useMyHook = (): { data: Data; loading: boolean } => {
  // ...
}

// Tipar API responses
interface ApiResponse<T> {
  data?: T
  error?: string
}

// Tipar validações
interface ValidatedData {
  nome: string
  email: string
  // ...
}
```

### Convenções de Nomenclatura

- **Componentes**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase com "use" (`useFetch.ts`)
- **Utilitários**: camelCase (`formatCurrency.ts`)
- **Tipos**: PascalCase (`UserType.ts`)
- **Arquivos de estilo**: `ComponentName.module.css`
- **Variáveis**: camelCase (`userName`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Branches**: lowercase-kebab-case (`feature/add-gallery`)

### Git Workflow

```bash
# Branch de feature
git checkout -b feature/nova-feature

# Commits atômicos
git commit -m "feat: adiciona nova feature"

# Push e create PR
git push origin feature/nova-feature

# Merge após aprovação
```

### Tipos de Commit

- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `perf:` - Performance
- `test:` - Testes
- `chore:` - Tarefas

---

## 📊 RESUMO DE TECNOLOGIAS

| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|----------|
| **Frontend** | React | 19.2.6 | UI Framework |
| | Next.js | 16.2.6 | Full-stack Framework |
| | TypeScript | 5.9.3 | Type safety |
| | CSS Modules | - | Estilização |
| | lucide-react | 0.395.0 | Ícones |
| **Backend** | Next.js API Routes | 16.2.6 | API |
| | NextAuth | 5.0.0-beta.19 | Autenticação |
| **Database** | Prisma | 5.15.0 | ORM |
| | SQLite | - | Dev DB |
| | PostgreSQL | - | Prod DB |
| **Segurança** | bcryptjs | 2.4.3 | Hashing |
| | JWT | (NextAuth) | Tokens |
| **Dev Tools** | ESLint | 9.39.4 | Linter |
| | ts-node | 10.9.2 | TS Runner |

---

## 🎓 PRÓXIMAS ETAPAS DE APRENDIZADO

### Curto Prazo (1-2 semanas)
- [ ] Estudar routing avançado em Next.js
- [ ] Entender app router vs pages router
- [ ] Aprender sobre ISR e SSG
- [ ] Implementar testes com Jest

### Médio Prazo (1 mês)
- [ ] Adicionar upload de imagens (Cloudinary/AWS S3)
- [ ] Integrar Google Maps API
- [ ] Implementar notificações por email
- [ ] Criar relatórios em PDF

### Longo Prazo (3+ meses)
- [ ] Aplicativo mobile (React Native/Expo)
- [ ] Chat em tempo real (WebSocket)
- [ ] Video conferência (Twilio/Jitsi)
- [ ] Integração com CRM

---

## 📝 CONCLUSÃO

ImóvelPro é uma aplicação full-stack moderna, bem estruturada e pronta para escalabilidade. Utiliza as melhores práticas de desenvolvimento web, segurança e performance. Ideal para aprender sobre Next.js, TypeScript, Prisma e construção de SaaS.

**Versão:** 0.1.0  
**Atualizado:** Maio 2026  
**Status:** Pronto para Produção ✅

---

## 📚 REFERÊNCIAS E RECURSOS

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**FIM DO DOCUMENTO DE ESTUDOS**

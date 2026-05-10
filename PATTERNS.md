# 🎨 Padrões de Código e Melhores Práticas - ImóvelPro

## Estrutura de Projeto

### Arquitetura em Camadas

```
src/
├── app/
│   ├── (auth)/              # Grupo de rotas de autenticação
│   ├── (dashboard)/         # Grupo de rotas protegidas
│   ├── api/                 # API Routes
│   └── layout.tsx           # Layout raiz
├── components/              # Componentes reutilizáveis
├── hooks/                   # Hooks customizados
├── lib/                     # Utilitários e configurações
├── types/                   # Tipos TypeScript
└── middleware.ts            # Middleware de autenticação
```

## Componentes

### Padrão de Componente

```tsx
import styles from './MyComponent.module.css'

interface MyComponentProps {
  title: string
  children: React.ReactNode
  variant?: 'default' | 'primary'
  loading?: boolean
}

/**
 * Componente de exemplo
 * @param title - Título do componente
 * @param children - Conteúdo interno
 * @param variant - Estilo visual
 * @param loading - Estado de carregamento
 */
export default function MyComponent({
  title,
  children,
  variant = 'default',
  loading = false,
}: MyComponentProps) {
  return (
    <div className={`${styles.container} ${styles[variant]}`}>
      {loading && <div className={styles.spinner} />}
      <h2>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
```

### CSS Modules

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.content {
  font-size: 14px;
  color: var(--gray-600);
  line-height: 1.6;
}

.primary {
  background: linear-gradient(135deg, var(--blue-mid), var(--midnight-light));
  color: white;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
    gap: 12px;
  }
}
```

## Páginas

### Padrão de Página com API

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Toast from '@/components/Toast'
import styles from './page.module.css'

interface Data {
  id: string
  name: string
}

export default function Page() {
  const [data, setData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/dados')
      if (!res.ok) throw new Error('Erro ao carregar')
      setData(await res.json())
    } catch (err) {
      showToast('Erro ao carregar dados', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <div className={styles.loading}>Carregando...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dados</h1>
        <Button variant="primary">+ Novo</Button>
      </div>

      <Card>
        {data.length === 0 ? (
          <p>Nenhum dado encontrado</p>
        ) : (
          data.map(item => (
            <div key={item.id}>{item.name}</div>
          ))
        )}
      </Card>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
```

## APIs (Route Handlers)

### Padrão de API Route

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Listar
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const items = await prisma.item.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 })
  }
}

// POST - Criar
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const item = await prisma.item.create({
      data: {
        name,
        userId: session.user.id,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 })
  }
}
```

### Padrão de API Dinâmica

```ts
// src/app/api/items/[id]/route.ts

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const item = await prisma.item.update({
      where: { id: params.id, userId: session.user.id },
      data: body,
    })

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    await prisma.item.delete({
      where: { id: params.id, userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 })
  }
}
```

## Hooks Customizados

### Hook de Autenticação

```ts
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuthRequired() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  return { session, isLoading: status === 'loading' }
}
```

### Hook de Formulário

```ts
import { useState, useCallback } from 'react'

interface UseFormOptions {
  onSubmit: (data: any) => Promise<void>
}

export function useForm(initialData: any, { onSubmit }: UseFormOptions) {
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(data)
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Erro' })
    } finally {
      setLoading(false)
    }
  }, [data, onSubmit])

  return { data, setData, handleChange, handleSubmit, errors, loading }
}
```

## Validações

### Validação de Entrada

```ts
// lib/validations.ts

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePhone(phone: string): boolean {
  const regex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/
  return regex.test(phone)
}

export function validateCEP(cep: string): boolean {
  const regex = /^\d{5}-?\d{3}$/
  return regex.test(cep)
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Senha deve conter pelo menos uma letra maiúscula'
  }
  if (!/[0-9]/.test(password)) {
    return 'Senha deve conter pelo menos um número'
  }
  return null
}
```

## Tratamento de Erros

### Padrão de Tratamento

```tsx
'use client'

import { useEffect, useState } from 'react'

interface ErrorState {
  message: string
  code: string
  timestamp: Date
}

export default function Page() {
  const [error, setError] = useState<ErrorState | null>(null)

  const handleError = (err: unknown) => {
    let message = 'Erro desconhecido'
    let code = 'UNKNOWN_ERROR'

    if (err instanceof Error) {
      message = err.message
      code = err.name
    } else if (typeof err === 'string') {
      message = err
    }

    setError({
      message,
      code,
      timestamp: new Date(),
    })

    // Log para monitoramento
    console.error(`[${code}]`, message)
  }

  return (
    <div>
      {error && (
        <div className="error-alert">
          <h3>Erro: {error.code}</h3>
          <p>{error.message}</p>
          <button onClick={() => setError(null)}>Fechar</button>
        </div>
      )}
    </div>
  )
}
```

## Performance

### Otimizações Recomendadas

```tsx
// 1. Memorizar componentes
import { memo } from 'react'

const Item = memo(function Item({ name }: { name: string }) {
  return <div>{name}</div>
})

// 2. Usar useCallback para funções
const handleClick = useCallback(() => {
  // ...
}, [])

// 3. Lazy loading de componentes
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}

// 4. Usar Image do Next.js
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/image.jpg"
      alt="Descrição"
      width={800}
      height={600}
      priority
    />
  )
}
```

## Segurança

### Boas Práticas

1. **Autenticação**: Sempre verificar `await auth()` nas APIs
2. **Autorização**: Validar que o usuário possui permissão
3. **Validação**: Validar sempre os dados de entrada
4. **Sanitização**: Escapar dados antes de exibir
5. **Rate Limiting**: Limitar requisições por IP
6. **CSRF**: Usar tokens CSRF (NextAuth faz automaticamente)

### Exemplo Seguro

```ts
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // 1. Autenticar
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  // 2. Autorizar
  const item = await prisma.item.findUnique({ where: { id: params.id } })
  if (!item || item.userId !== session.user.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  // 3. Deletar
  await prisma.item.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
```

## Testes

### Teste Unitário Exemplo

```tsx
import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Clique</Button>)
    screen.getByText('Clique').click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

## Checklist de Qualidade

- [ ] Código formatado com Prettier
- [ ] Sem eslint warnings
- [ ] TypeScript sem erros
- [ ] Componentes documentados
- [ ] Tratamento de erros implementado
- [ ] Validações de entrada
- [ ] Testes unitários (se aplicável)
- [ ] Responsivo
- [ ] Acessibilidade verificada
- [ ] Performance testada

---

Siga estes padrões para manter a consistência do projeto!

# 📚 Guia de Desenvolvimento - ImóvelPro

## 🚀 Primeiros Passos

### 1. Executar o Projeto

```bash
# Terminal 1: Inicie o servidor de desenvolvimento
npm run dev

# Terminal 2: (Opcional) Abra o Prisma Studio para ver o banco
npm run db:studio
```

### 2. Testar Funcionalidades

#### Login
- Acesse: `http://localhost:3000/login`
- Email: `corretor@example.com`
- Senha: `123456`

#### Registrar Novo Usuário
- Acesse: `http://localhost:3000/register`
- Preencha o formulário e confirme

## 🏗️ Estrutura de Componentes

### Button
```tsx
import Button from '@/components/Button'

export default function Example() {
  return (
    <>
      <Button>Padrão</Button>
      <Button variant="primary">Primário</Button>
      <Button variant="secondary">Secundário</Button>
      <Button variant="danger">Perigo</Button>
      <Button size="sm">Pequeno</Button>
      <Button size="lg">Grande</Button>
      <Button loading>Carregando...</Button>
    </>
  )
}
```

### Modal
```tsx
import Modal from '@/components/Modal'
import { useState } from 'react'

export default function Example() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      <Modal
        isOpen={isOpen}
        title="Meu Modal"
        onClose={() => setIsOpen(false)}
      >
        <p>Conteúdo do modal aqui</p>
      </Modal>
    </>
  )
}
```

### Card
```tsx
import Card from '@/components/Card'

export default function Example() {
  return (
    <Card hoverable>
      <h2>Título</h2>
      <p>Conteúdo aqui</p>
    </Card>
  )
}
```

### Toast
```tsx
import Toast from '@/components/Toast'
import { useState } from 'react'

export default function Example() {
  const [toast, setToast] = useState(null)

  return (
    <>
      <button onClick={() => setToast({ msg: 'Sucesso!', type: 'success' })}>
        Mostrar Toast
      </button>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
```

### Skeleton (Loading)
```tsx
import Skeleton from '@/components/Skeleton'

export default function Example() {
  return (
    <>
      <Skeleton width="100%" height={20} />
      <Skeleton width={200} height={40} borderRadius="12px" />
    </>
  )
}
```

### EmptyState
```tsx
import EmptyState from '@/components/EmptyState'

export default function Example() {
  return (
    <EmptyState
      icon="📋"
      title="Nenhum item encontrado"
      description="Comece criando seu primeiro item"
      action={{
        label: 'Criar Item',
        onClick: () => console.log('Clicado!'),
      }}
    />
  )
}
```

## 🔌 Hooks Customizados

### useToast
```tsx
import { useToast } from '@/hooks'

export default function Example() {
  const { showToast } = useToast()

  return (
    <button
      onClick={() => {
        showToast('Operação realizada!', 'success')
      }}
    >
      Clique aqui
    </button>
  )
}
```

### useFetch
```tsx
import { useFetch } from '@/hooks'
import { useEffect } from 'react'

export default function Example() {
  const { loading, error, request } = useFetch()

  const loadData = async () => {
    const data = await request('/api/dados')
    console.log(data)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <p>Carregando...</p>
  if (error) return <p>Erro: {error}</p>

  return <p>Dados carregados!</p>
}
```

## 📡 Usando as APIs

### GET - Listar Imóveis
```bash
curl http://localhost:3000/api/imoveis
```

### POST - Criar Imóvel
```bash
curl -X POST http://localhost:3000/api/imoveis \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Apartamento 3 quartos",
    "preco": 500000,
    "endereco": "Rua Principal, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "tipo": "APARTAMENTO",
    "status": "VENDA"
  }'
```

### PUT - Atualizar Imóvel
```bash
curl -X PUT http://localhost:3000/api/imoveis/[id] \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Novo título",
    "preco": 550000
  }'
```

### DELETE - Deletar Imóvel
```bash
curl -X DELETE http://localhost:3000/api/imoveis/[id]
```

## 🎯 Fluxos Comuns

### Criar um Novo Imóvel
1. Acesse `/dashboard/imoveis`
2. Clique em "+ Novo Imóvel"
3. Preencha o formulário
4. Clique em "Criar Imóvel"

### Agendar uma Visita
1. Acesse `/dashboard/visitas`
2. Clique em "+ Nova Visita"
3. Selecione o imóvel e cliente
4. Defina data e hora
5. Clique em "Criar Visita"

### Atualizar Perfil
1. Acesse `/dashboard/perfil`
2. Edite as informações
3. Clique em "Salvar Alterações"
4. (Opcional) Altere a senha

## 🎨 Design Tokens

Use as variáveis CSS definidas em `globals.css`:

```css
/* Cores */
--midnight: #0D1B40          /* Azul da meia noite */
--blue-mid: #2563EB          /* Azul médio */
--blue-light: #5DADE2        /* Azul claro */
--white: #FFFFFF             /* Branco */

/* Espaçamento */
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px

/* Sombras */
--shadow-sm: 0 1px 3px rgba(...)
--shadow-md: 0 4px 16px rgba(...)
--shadow-lg: 0 8px 32px rgba(...)
```

## 📝 Padrão de Código

### Componente Exemplo
```tsx
import styles from './Example.module.css'

interface ExampleProps {
  title: string
  children: React.ReactNode
}

export default function Example({ title, children }: ExampleProps) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
```

### Página com API
```tsx
'use client'

import { useEffect, useState } from 'react'

interface Data {
  id: string
  name: string
}

export default function Page() {
  const [data, setData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dados')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando...</p>

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

## 🧪 Testes Manuais

### Checklist de Funcionalidades
- [ ] Criar conta nova
- [ ] Fazer login
- [ ] Alterar perfil
- [ ] Criar imóvel
- [ ] Editar imóvel
- [ ] Deletar imóvel
- [ ] Criar cliente
- [ ] Agendar visita
- [ ] Atualizar visita
- [ ] Ver dashboard com estatísticas
- [ ] Fazer logout

## 🐛 Debug

### Habilitar Logs
Adicione console.log em qualquer lugar:

```tsx
useEffect(() => {
  console.log('Estado:', data)
}, [data])
```

### Verificar Banco de Dados
```bash
npm run db:studio
```

Abrirá uma interface visual para explorar os dados.

## 🚀 Próximos Passos

1. **Adicionar Testes Unitários**: Use Jest + React Testing Library
2. **Testes E2E**: Use Cypress ou Playwright
3. **CI/CD**: Configure GitHub Actions
4. **Analytics**: Integre Plausible ou Mixpanel
5. **Email**: Configure SendGrid ou similar
6. **Storage**: Integre AWS S3 ou similar para imagens

---

Dúvidas? Consule o README.md ou a documentação Next.js oficial.

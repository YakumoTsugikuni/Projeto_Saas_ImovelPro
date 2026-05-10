# 🏠 ImóvelPro - SaaS para Imobiliárias

Uma plataforma moderna e completa para corretores e imobiliárias gerenciarem seus imóveis, clientes e visitas de forma eficiente.

## ✨ Características

- 🔐 **Autenticação Segura**: Sistema de login com NextAuth e bcrypt
- 🏢 **Gestão de Imóveis**: CRUD completo com filtros por tipo e status
- 👥 **Gestão de Clientes**: Cadastro e controle de prospects e clientes
- 📅 **Agendamento de Visitas**: Controle de visitas com status em tempo real
- 📊 **Dashboard Analytics**: Estatísticas e visitas próximas
- 👤 **Perfil de Usuário**: Edição de dados e alteração de senha
- 🎨 **Design Profissional**: Interface moderna com cores Azul, Branco e Azul da Meia Noite
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🚀 Começando Rápido

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone ou extraia o projeto**
```bash
cd imovel-pro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# .env.local já existe, mas você pode modificar se necessário
# Altere NEXTAUTH_SECRET para uma chave segura em produção
```

4. **Configure o banco de dados**
```bash
# Criar e aplicar migrações
npm run db:push

# Popular com dados de exemplo (opcional)
npm run db:seed
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:3000
```

## 📝 Dados de Teste

Se você executou o seed, use:
- **Email**: corretor@example.com
- **Senha**: 123456

## 📁 Estrutura do Projeto

```
imovel-pro/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── app/
│   │   ├── (auth)/            # Páginas de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Dashboard e páginas protegidas
│   │   │   ├── dashboard/
│   │   │   ├── clientes/
│   │   │   ├── imoveis/
│   │   │   ├── visitas/
│   │   │   └── perfil/
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── clientes/
│   │   │   ├── imoveis/
│   │   │   ├── visitas/
│   │   │   ├── perfil/
│   │   │   ├── register/
│   │   │   └── dashboard/
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Sidebar.tsx
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── Card.tsx
│   ├── lib/
│   │   ├── auth.ts            # Configuração NextAuth
│   │   ├── db.ts              # Cliente Prisma
│   │   └── utils.ts           # Funções utilitárias
│   └── types/
│       └── next-auth.d.ts     # Tipos de autenticação
└── package.json
```

## 🎨 Design Tokens

As cores definidas para o projeto:

- **Azul da Meia Noite**: #0D1B40 (principal)
- **Azul Claro**: #5DADE2 (acentos)
- **Branco**: #FFFFFF (fundo)
- **Azul Médio**: #2563EB (botões primários)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Cria build para produção
npm run start            # Inicia servidor em produção

# Banco de Dados
npm run db:push          # Sincroniza schema com banco
npm run db:studio        # Abre Prisma Studio
npm run db:seed          # Popula com dados de exemplo

# Linting
npm run lint             # Verifica código
```

## 🔐 Autenticação

O projeto utiliza NextAuth com autenticação por credenciais (email/senha):

- Senhas são hash com bcrypt
- Sessão baseada em JWT
- Proteção de rotas automática
- Refresh de token automático

## 🛠️ Desenvolvimento

### Adicionando Novas Páginas

1. Crie a pasta em `src/app/(dashboard)/sua-pagina/`
2. Crie `page.tsx` e `page.module.css`
3. Use o layout protegido automaticamente

### Adicionando Novas APIs

1. Crie `src/app/api/sua-api/route.ts`
2. Implemente GET/POST/PUT/DELETE conforme necessário
3. Use `await auth()` para verificar autenticação
4. Use `prisma` para acessar o banco

### Criando Componentes

1. Crie em `src/components/SeuComponente.tsx`
2. Crie o CSS em `src/components/SeuComponente.module.css`
3. Exporte como default
4. Importe nas páginas que usar

## 📦 Dependências Principais

- **Next.js 14**: Framework React moderno
- **React 18**: Biblioteca UI
- **Prisma**: ORM para banco de dados
- **NextAuth**: Autenticação
- **bcryptjs**: Hashing de senhas
- **lucide-react**: Ícones

## 🚢 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Conecte o repositório no Vercel
3. Configure variáveis de ambiente:
   - `DATABASE_URL`: URL do banco (ex: Supabase)
   - `NEXTAUTH_SECRET`: Chave secreta
   - `NEXTAUTH_URL`: URL de produção
4. Deploy automático a cada push

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Node.js 18+.

## 📋 Checklist de Desenvolvimento

- [x] Autenticação (login/registro)
- [x] CRUD de Imóveis
- [x] CRUD de Clientes
- [x] CRUD de Visitas
- [x] Dashboard com estatísticas
- [x] Perfil de usuário
- [x] Responsividade
- [x] Componentes reutilizáveis
- [x] Seed de dados
- [ ] Testes automatizados
- [ ] Relatórios PDF
- [ ] Integração com mapas
- [ ] Notificações por email
- [ ] Upload de imagens

## 🐛 Troubleshooting

### Erro ao conectar ao banco de dados
```bash
# Verifique o .env.local
# Certifique-se que DATABASE_URL está correto
npm run db:push
```

### Erro de autenticação
```bash
# Gere uma nova NEXTAUTH_SECRET
openssl rand -base64 32
# Copie para .env.local
```

### Build falha
```bash
# Limpe cache
rm -rf .next
npm run build
```

## 📞 Suporte

Para problemas e sugestões, entre em contato ou abra uma issue.

## 📄 Licença

Este projeto é de código aberto e disponível sob licença MIT.

---

Desenvolvido com ❤️ para imobiliárias e corretores profissionais.

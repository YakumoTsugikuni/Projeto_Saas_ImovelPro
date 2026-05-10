# 📦 Guia de Deployment - ImóvelPro

## Pré-requisitos

- [ ] Conta no Vercel (https://vercel.com)
- [ ] Repositório GitHub/GitLab
- [ ] Banco de dados externo (Supabase, PlanetScale, Neon, etc)
- [ ] Domínio (opcional)

## Passo 1: Preparar o Banco de Dados

### Opção 1: Supabase (Recomendado)

1. Vá para https://supabase.com
2. Crie uma nova conta
3. Crie um novo projeto
4. Vá para `Database` → `Connection pooling`
5. Copie a string de conexão com `?schema=public`
6. Configure em `.env.production`: `DATABASE_URL="sua-string-aqui"`

### Opção 2: PlanetScale

1. Vá para https://planetscale.com
2. Crie um novo banco MySQL
3. Copie a string de conexão
4. Configure em `.env.production`

## Passo 2: Preparar o Código

```bash
# Limpar localmente
rm -rf .next prisma/dev.db

# Gerar uma nova NEXTAUTH_SECRET
openssl rand -base64 32

# Comitar as alterações
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

## Passo 3: Deploy no Vercel

### Via Interface Web (Recomendado)

1. Vá para https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `DATABASE_URL`: String de conexão do banco
   - `NEXTAUTH_SECRET`: Gere com `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Sua URL de produção (ex: https://seu-app.vercel.app)
5. Clique em "Deploy"
6. Aguarde o deploy completar

### Via CLI

```bash
npm i -g vercel

vercel login

vercel --prod
```

## Passo 4: Configurar o Banco de Dados em Produção

```bash
# Após fazer deploy, execute:
vercel env pull .env.production.local

# Rode as migrações do Prisma
npx prisma migrate deploy --skip-generate

# Opcional: Popule dados iniciais
npx prisma db seed
```

## Passo 5: Verificar o Deploy

1. Acesse a URL do Vercel
2. Teste o login com dados de teste
3. Teste criar um imóvel
4. Verifique se tudo está funcionando

## 🔐 Variáveis de Ambiente em Produção

Configure estas variáveis no Vercel:

```
DATABASE_URL=postgresql://...  # String de conexão do banco
NEXTAUTH_SECRET=sua-chave-secreta-aleatorio
NEXTAUTH_URL=https://seu-dominio.com
NODE_ENV=production
```

## 🚀 Otimizações para Produção

### 1. Habilitar Compressão
Vercel habilita automaticamente

### 2. Configurar Cache
```js
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-cache' }
      ]
    }
  ]
}
```

### 3. Monitoramento
- Habilite "Analytics" no Vercel
- Configure alertas para erros

## 📊 Domínio Customizado

1. Vá para as configurações do projeto no Vercel
2. Clique em "Domains"
3. Adicione seu domínio
4. Siga as instruções para configurar DNS

## 🔄 CI/CD automático

Vercel configura automaticamente:
- Deploy em cada push para main
- Preview URLs para PRs
- Rollback automático se build falhar

## 🐛 Troubleshooting

### Build Falha
```bash
# Aumento do timeout
vercel build --prod
```

### Erro de Conexão com Banco
- Verifique se DATABASE_URL está correto
- Verifique se a IP whitelist permite Vercel
- Teste localmente com a mesma string

### Erro 500 em Produção
- Verifique os logs: `vercel logs`
- Verifique as variáveis de ambiente
- Verifique permissões do banco de dados

## 📈 Escalabilidade

### Limites Gratuitos do Vercel
- Suficiente para até 100k requisições/mês
- 1 GB de saída de dados
- Ideal para teste e pequena escala

### Upgrade necessário quando:
- > 100k requisições/mês
- Precisa de mais poder computacional
- Precisa de mais armazenamento

## 🔒 Backup do Banco de Dados

Configure backups automáticos no seu provedor de banco:
- Supabase: Automático com snapshots diários
- PlanetScale: Automático com backups por 30 dias

## 📝 Checklist de Deployment

- [ ] Código comitado no GitHub
- [ ] Sem `.env.local` no repositório
- [ ] DATABASE_URL configurado
- [ ] NEXTAUTH_SECRET gerado e configurado
- [ ] NEXTAUTH_URL configurado corretamente
- [ ] Build local testado: `npm run build`
- [ ] Projeto criado no Vercel
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy completado
- [ ] Migrações do banco executadas
- [ ] Testes funcionais em produção
- [ ] Monitoramento configurado

## 🎯 Próximos Passos Pós-Deploy

1. Configure CDN (Vercel faz automaticamente)
2. Configure alertas de erro
3. Configure backups
4. Configure domínio customizado
5. Configure SSL/HTTPS (Vercel faz automaticamente)
6. Monitore performance
7. Configure Rate Limiting se necessário

---

Após o deployment, o app estará disponível em `https://seu-projeto.vercel.app`

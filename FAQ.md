# ❓ FAQ e Troubleshooting - ImóvelPro

## ❓ Perguntas Frequentes

### Como Começo?

**R**: Siga estes passos:
```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```
Depois acesse `http://localhost:3000`

### Qual é a Senha de Teste?

**R**: 
- Email: `corretor@example.com`
- Senha: `123456`

### Como Resetar o Banco de Dados?

**R**: Delete o arquivo `prisma/dev.db` e execute:
```bash
npm run db:push
npm run db:seed
```

### Como Criar um Novo Usuário?

**R**: Vá para `http://localhost:3000/register` e preencha o formulário.

### Como Adicionar uma Nova Página?

**R**: 
1. Crie a pasta `src/app/(dashboard)/sua-pagina/`
2. Crie `page.tsx` e `page.module.css`
3. O layout protegido será automático

### Como Adicionar uma Nova API?

**R**: 
1. Crie `src/app/api/sua-api/route.ts`
2. Implemente GET/POST conforme necessário
3. Use `auth()` para verificar autenticação

### Como Mudar as Cores?

**R**: Edite as cores em `src/app/globals.css` na seção `:root`:
```css
:root {
  --midnight: #0D1B40;
  --blue-mid: #2563EB;
  --blue-light: #5DADE2;
  --white: #FFFFFF;
  /* ... */
}
```

### Como Fazer Deploy?

**R**: Siga o arquivo `DEPLOYMENT.md` completamente.

### Preciso Adicionar Upload de Imagens?

**R**: Instale uma biblioteca como:
```bash
npm install next-cloudinary
# ou
npm install aws-sdk
```

Depois integre na página de imóveis.

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/components/Button'"

**Solução**: 
1. Verifique se o arquivo existe em `src/components/Button.tsx`
2. Verifique se `jsconfig.json` ou `tsconfig.json` tem os paths configurados
3. Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro: "Prisma - PrismaClientInitializationError"

**Solução**:
1. Certifique-se que `DATABASE_URL` está em `.env.local`
2. Execute `npm run db:push`
3. Verifique se o arquivo `dev.db` foi criado em `prisma/`

### Erro: "NextAuth - NEXTAUTH_SECRET not provided"

**Solução**:
1. Gere um novo secret:
```bash
openssl rand -base64 32
```
2. Adicione a `.env.local`:
```
NEXTAUTH_SECRET="seu-secret-aqui"
```
3. Reinicie o servidor

### Erro: "Cannot POST /api/clientes"

**Solução**:
1. Verifique se o arquivo `src/app/api/clientes/route.ts` existe
2. Verifique se a função `export async function POST` existe
3. Verifique se você está autenticado
4. Veja os logs no terminal

### Build Falha com "TypeScript error"

**Solução**:
1. Verifique o erro específico
2. Corrija os tipos em `src/types/`
3. Execute `npm run lint` para ver todos os erros
4. Tente `npm run build` novamente

### Banco de Dados Corrompido

**Solução**:
1. Delete `prisma/dev.db`
2. Execute `npm run db:push`
3. Execute `npm run db:seed` para repopular

### Página em Branco

**Solução**:
1. Abra o console do navegador (F12)
2. Veja se há erros
3. Verifique se a rota está protegida
4. Verifique se você está autenticado

### Estilos Não Aparecem

**Solução**:
1. Verifique se o arquivo `.module.css` existe
2. Verifique a importação: `import styles from './page.module.css'`
3. Use `className={styles.classe}` e não `className="classe"`
4. Reinicie o servidor

### Componente Não Renderiza

**Solução**:
1. Verifique se é um componente client: `'use client'`
2. Verifique se está importado corretamente
3. Verifique as props passadas
4. Veja o console para erros

### Requisição à API Falha

**Solução**:
1. Verifique se a rota da API existe
2. Verifique o método HTTP (GET, POST, etc)
3. Verifique os headers enviados
4. Veja a resposta no Network tab (F12)
5. Use `npm run db:studio` para verificar os dados

### Erro 401 "Não autorizado"

**Solução**:
1. Verifique se está logado
2. Verifique se o token ainda é válido
3. Faça logout e login novamente
4. Verifique se `NEXTAUTH_SECRET` está configurado

## 🔧 Ferramentas de Debug

### 1. Prisma Studio
```bash
npm run db:studio
```
Abre interface visual para gerenciar o banco.

### 2. Console do Navegador (F12)
Veja erros e logs em tempo real.

### 3. Terminal
Veja os logs do servidor de desenvolvimento.

### 4. VS Code Extension: Thunder Client
Faz requisições HTTP para testar APIs.

### 5. Next.js DevTools
Automático no modo desenvolvimento.

## 📝 Logs Úteis

### Ver Query do Prisma
```ts
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

### Ver Requisição HTTP
```ts
console.log('URL:', req.url)
console.log('Method:', req.method)
console.log('Body:', await req.json())
```

## ⚡ Performance

### Se o App Está Lento

1. **Verificar bundle size**:
```bash
npm run build
```

2. **Usar React DevTools**:
- Instale extensão do React
- Veja re-renders desnecessários

3. **Otimizar imagens**:
- Use componente `Image` do Next.js
- Reduza tamanho das imagens

4. **Lazy loading**:
```tsx
const Component = lazy(() => import('./Component'))
```

## 📋 Checklist de Debug

Quando algo não funciona:
- [ ] Erro no console? (F12)
- [ ] Erro no terminal?
- [ ] Arquivo existe?
- [ ] Importação correta?
- [ ] Server rodando? (`npm run dev`)
- [ ] Banco de dados OK? (`npm run db:studio`)
- [ ] Está autenticado?
- [ ] Network tab no navegador (F12)?

## 🆘 Quando Nada Funciona

Tente (em ordem):
1. Reiniciar servidor: `Ctrl+C` e `npm run dev`
2. Limpar cache Next.js: `rm -rf .next`
3. Limpar node_modules: `rm -rf node_modules && npm install`
4. Resetar banco: `rm prisma/dev.db && npm run db:push`
5. Limpar cache navegador: `Ctrl+Shift+Delete`
6. Procurar por typos no código
7. Consultar documentação do Next.js/Prisma

## 📞 Onde Pedir Ajuda

### Documentação
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs

### Comunidades
- **Stack Overflow**: Tag com "next.js"
- **GitHub Discussions**: Repos do Next.js/Prisma
- **Discord**: Comunidades de Next.js

## 🎯 Dicas Finais

1. **Leia os arquivos de documentação primeiro** - Economiza tempo
2. **Use TypeScript** - Previne muitos erros
3. **Teste localmente antes de fazer commit**
4. **Use console.log** para debug rápido
5. **Consulte a documentação oficial** antes de procurar em fóruns
6. **Faça commits frequentes** para não perder código
7. **Use git branches** para novas features

---

**Ainda com dúvida?** Releia a documentação ou consulte os arquivos do projeto!

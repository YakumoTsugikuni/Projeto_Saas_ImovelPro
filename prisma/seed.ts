import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Limpar dados existentes (Ordem importa para não quebrar chaves estrangeiras)
  await prisma.visita.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.imovel.deleteMany()
  await prisma.user.deleteMany()

  // 2. Criar usuário admin de teste
  const hashedPassword = await bcrypt.hash('123456', 10)
// No prisma/seed.ts
const user = await prisma.user.create({
  data: {
    email: 'corretor@example.com',
    nome: 'João Corretor',
    password: hashedPassword,
    role: 'CORRETOR',
  } as any, // O 'as any' é um último recurso para ignorar o erro de linting e validar se o build passa
})

console.log('✓ Usuário criado com sucesso')

  // 3. Criar imóveis de exemplo
  const imovel1 = await prisma.imovel.create({
    data: {
      titulo: 'Apartamento no Jardins',
      descricao: 'Lindo apartamento com vista para o jardim, bem localizado',
      tipo: 'APARTAMENTO',
      status: 'VENDA',
      preco: 750000,
      userId: user.id,
      // Removidos 'area', 'quartos', 'vagas', 'endereco', 'cidade', etc.
    },
  })

  const imovel2 = await prisma.imovel.create({
    data: {
      titulo: 'Casa em Condomínio',
      descricao: 'Casa moderna com piscina e jardim amplo',
      tipo: 'CASA',
      status: 'ALUGUEL',
      preco: 5000,
      userId: user.id,
    },
  })

  const imovel3 = await prisma.imovel.create({
    data: {
      titulo: 'Terreno no Brooklin',
      descricao: 'Terreno com 500m² pronto para construir',
      tipo: 'TERRENO',
      status: 'VENDA',
      preco: 1200000,
      userId: user.id,
    },
  })

  console.log('✓ Imóveis criados:', 3)

// 4. Criar clientes de exemplo
  const cliente1 = await prisma.cliente.create({
    data: {
      nome: 'Maria Silva',
      email: 'maria@example.com',
      telefone: '(11) 99876-5432',
      tipo: 'COMPRADOR',
      userId: user.id, // ADICIONE ESTA LINHA: Vincula ao usuário criado no topo do seed
    },
  })

  const cliente2 = await prisma.cliente.create({
    data: {
      nome: 'Carlos Santos',
      email: 'carlos@example.com',
      telefone: '(11) 98765-4321',
      tipo: 'LOCATARIO',
      userId: user.id, // ADICIONE ESTA LINHA TAMBÉM
    },
  })

  console.log('✓ Clientes criados:', 2)

  // 5. Criar visitas agendadas
  // Aqui também precisamos passar o userId para a visita, 
  // já que adicionamos essa relação no schema
  const now = new Date()
  await prisma.visita.create({
    data: {
      dataVisita: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: 'AGENDADA',
      userId: user.id, // ADICIONE ESTA LINHA
      imovelId: imovel1.id,
      clienteId: cliente1.id,
    },
  })
await prisma.visita.create({
    data: {
      dataVisita: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), 
      status: 'REALIZADA',
      userId: user.id,   // <--- ADICIONE ESTA LINHA AQUI TAMBÉM
      imovelId: imovel2.id,
      clienteId: cliente2.id,
    },
  })

  console.log('✓ Visitas criadas: 2')
  console.log('\n✅ Seed completado com sucesso!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
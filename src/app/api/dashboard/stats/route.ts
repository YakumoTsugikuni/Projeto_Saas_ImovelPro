import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  
  // Verificação robusta da sessão e do ID do usuário
  // Usamos 'as any' para evitar o erro de tipagem do NextAuth no campo 'id'
  const userId = (session?.user as any)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const [
      totalImoveis, 
      totalClientes, 
      totalVisitas, 
      imoveisPorStatus, 
      visitasProximas, 
      imoveis
    ] = await Promise.all([
      // 1. Contagem total de imóveis do usuário
      prisma.imovel.count({ where: { userId } }),
      
      // @ts-ignore
      prisma.cliente.count({ where: { userId } }),

      // @ts-ignore
      prisma.visita.count({ where: { userId } }),
      
      // 4. Agrupamento por status (Venda/Aluguel/etc)
      prisma.imovel.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),

      // 5. Próximas visitas agendadas
      prisma.visita.findMany({
        where: { 
          userId, 
          dataVisita: { gte: new Date() }, 
          status: 'AGENDADA' 
        },
        orderBy: { dataVisita: 'asc' }, 
        take: 5,
        include: {
          imovel: { select: { titulo: true } },
          cliente: { select: { nome: true } },
        },
      }),

      // 6. Busca de todos os imóveis para cálculos de receita
      prisma.imovel.findMany({ where: { userId } })
    ])

    // Cálculos baseados nos imóveis retornados
    const receitaVendas = imoveis
      .filter(i => i.status === 'VENDIDO')
      .reduce((acc, i) => acc + i.preco, 0)

    const portfolioTotal = imoveis.reduce((acc, i) => acc + i.preco, 0)

    // Retorno organizado para o Frontend consumir
    return NextResponse.json({
      totalImoveis,
      totalClientes,
      totalVisitas,
      portfolioTotal,
      receitaVendas,
      imoveisPorStatus,
      visitasProximas,
    })

  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar dados do dashboard' }, 
      { status: 500 }
    )
  }
}
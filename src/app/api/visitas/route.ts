import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  
  // Casting 'as any' para acessar o ID que o NextAuth não tipa por padrão
  const userId = (session?.user as any)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const visitas = await prisma.visita.findMany({
      where: { userId: userId },
      // Corrigido: de dataHora para dataVisita
      orderBy: { dataVisita: 'asc' }, 
      include: {
        imovel: { select: { id: true, titulo: true, endereco: true, cidade: true } },
        cliente: { select: { id: true, nome: true, telefone: true } },
      },
    })

    return NextResponse.json(visitas)
  } catch (error) {
    console.error('Erro ao buscar visitas:', error)
    return NextResponse.json({ error: 'Erro ao carregar visitas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = (session?.user as any)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    // Desestruturamos 'dataVisita' do body, mas salvaremos como 'dataVisita'
    const { dataVisita, imovelId, clienteId, observacoes } = body

    if (!dataVisita || !imovelId || !clienteId) {
      return NextResponse.json(
        { error: 'Data, imóvel e cliente são obrigatórios' }, 
        { status: 400 }
      )
    }

    const data = new Date(dataVisita)
    if (Number.isNaN(data.getTime())) {
      return NextResponse.json({ error: 'Data inválida' }, { status: 400 })
    }

    // ✅ SEGURANÇA: imóvel e cliente precisam pertencer ao usuário logado
    const [imovel, cliente] = await Promise.all([
      prisma.imovel.findFirst({ where: { id: String(imovelId), userId }, select: { id: true } }),
      prisma.cliente.findFirst({ where: { id: String(clienteId), userId }, select: { id: true } }),
    ])
    if (!imovel || !cliente) {
      return NextResponse.json({ error: 'Imóvel ou cliente não encontrado' }, { status: 404 })
    }

    const visita = await prisma.visita.create({
      data: {
        dataVisita: data,
        imovelId: imovel.id,
        clienteId: cliente.id,
        observacoes: typeof observacoes === 'string' ? observacoes.slice(0, 1000) : undefined,
        userId: userId,
      },
      include: {
        imovel: { select: { id: true, titulo: true, endereco: true, cidade: true } },
        cliente: { select: { id: true, nome: true, telefone: true } },
      },
    })

    return NextResponse.json(visita, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar visita:', error)
    return NextResponse.json({ error: 'Erro ao criar visita' }, { status: 500 })
  }
}
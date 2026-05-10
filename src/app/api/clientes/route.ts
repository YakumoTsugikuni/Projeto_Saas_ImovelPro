import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')
  const search = searchParams.get('search')

  const where: any = { userId: session.user.id }
  if (tipo) where.tipo = tipo
  if (search) {
    where.OR = [
      { nome: { contains: search } },
      { email: { contains: search } },
      { telefone: { contains: search } },
    ]
  }

  const clientes = await prisma.cliente.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { visitas: true } } },
  })

  return NextResponse.json(clientes)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { nome, email, telefone, tipo, interesse, orcamento, observacoes } = body

    if (!nome || !telefone) {
      return NextResponse.json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 })
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        telefone,
        tipo: tipo || 'COMPRADOR',
        interesse,
        orcamento: orcamento ? parseFloat(orcamento) : null,
        observacoes,
        userId: session.user.id,
      },
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const where: any = { userId: session.user.id }
  if (tipo) where.tipo = tipo
  if (status) where.status = status
  if (search) {
    where.OR = [
      { titulo: { contains: search } },
      { cidade: { contains: search } },
      { endereco: { contains: search } },
    ]
  }

  const imoveis = await prisma.imovel.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { nome: true, email: true } },
      _count: { select: { visitas: true } },
    },
  })

  return NextResponse.json(imoveis)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { titulo, descricao, tipo, status, preco, area, quartos, banheiros, vagas, endereco, cidade, estado, cep, imagens, destaque } = body

    if (!titulo || !preco || !endereco || !cidade || !estado) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const imovel = await prisma.imovel.create({
      data: {
        titulo,
        descricao,
        tipo: tipo || 'APARTAMENTO',
        status: status || 'VENDA',
        preco: parseFloat(preco),
        area: area ? parseFloat(area) : null,
        quartos: quartos ? parseInt(quartos) : null,
        banheiros: banheiros ? parseInt(banheiros) : null,
        vagas: vagas ? parseInt(vagas) : null,
        endereco,
        cidade,
        estado,
        cep,
        imagens: imagens ? JSON.stringify(imagens) : '[]',
        destaque: destaque || false,
        userId: session.user.id,
      },
    })

    return NextResponse.json(imovel, { status: 201 })
  } catch (error) {
    console.error('Error creating imovel:', error)
    return NextResponse.json({ error: 'Erro ao criar imóvel' }, { status: 500 })
  }
}

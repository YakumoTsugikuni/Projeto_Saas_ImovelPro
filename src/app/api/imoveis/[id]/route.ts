import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const imovel = await prisma.imovel.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { visitas: true } },
      },
    })

    if (!imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    // Verifica se o imóvel pertence ao usuário logado
    if (imovel.userId !== (session?.user as any)?.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    return NextResponse.json(imovel)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar imóvel' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { titulo, descricao, tipo, status, preco, area, quartos, banheiros, vagas, endereco, cidade, estado, cep, imagens, destaque } = body

    const imovel = await prisma.imovel.update({
      where: { id: params.id, userId: session.user.id },
      data: {
        titulo,
        descricao,
        tipo,
        status,
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
      },
    })

    return NextResponse.json(imovel)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar imóvel' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    await prisma.visita.deleteMany({ where: { imovelId: params.id } })
    await prisma.imovel.delete({
      where: { id: params.id, userId: session.user.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir imóvel' }, { status: 500 })
  }
}

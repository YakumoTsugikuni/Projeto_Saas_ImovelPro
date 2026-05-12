import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const { status, observacoes } = body

    const visita = await prisma.visita.update({
      where: { id, userId: session.user.id },
      data: { status, observacoes },
      include: {
        imovel: { select: { id: true, titulo: true, endereco: true, cidade: true } },
        cliente: { select: { id: true, nome: true, telefone: true } },
      },
    })

    return NextResponse.json(visita)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar visita' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.visita.delete({ where: { id, userId: session.user.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir visita' }, { status: 500 })
  }
}

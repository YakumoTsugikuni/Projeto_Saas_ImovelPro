import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { nome, email, telefone, tipo, interesse, orcamento, observacoes } = body

const cliente = await prisma.cliente.update({
  where: { id: params.id }, // Removido o userId daqui
  data: { 
    nome, 
    email, 
    telefone, 
    tipo,
    // Remova também 'interesse' e 'orcamento' se eles não estiverem no schema.prisma
  },
})

    return NextResponse.json(cliente)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    await prisma.visita.deleteMany({ where: { clienteId: params.id } })
    await prisma.cliente.delete({ where: { id: params.id, userId: session.user.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir cliente' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { validateClienteInput } from '@/lib/validation'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    // Mesma validação do cadastro de cliente
    const validation = validateClienteInput(body)
    if (!validation.valid || !validation.data) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // ✅ SEGURANÇA: só atualiza se o cliente pertencer ao usuário logado
    const result = await prisma.cliente.updateMany({
      where: { id, userId },
      data: { ...validation.data, email: validation.data.email?.toLowerCase() ?? null },
    })
    if (result.count === 0) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const cliente = await prisma.cliente.findUnique({ where: { id } })
    return NextResponse.json(cliente)
  } catch (error) {
    if ((error as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um cliente com este email' }, { status: 409 })
    }
    console.error('Erro ao atualizar cliente:', error)
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params

    // ✅ SEGURANÇA: confere o dono ANTES de apagar qualquer coisa
    const cliente = await prisma.cliente.findFirst({ where: { id, userId }, select: { id: true } })
    if (!cliente) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.visita.deleteMany({ where: { clienteId: id, userId } }),
      prisma.cliente.delete({ where: { id } }),
    ])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir cliente:', error)
    return NextResponse.json({ error: 'Erro ao excluir cliente' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, nome: true, email: true, phone: true, avatar: true, creci: true, empresa: true, role: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, phone, avatar, creci, empresa, currentPassword, newPassword } = body

    const updateData: any = { name, phone, avatar, creci, empresa }

    if (newPassword && currentPassword) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

      const passwordMatch = await bcrypt.compare(currentPassword, user.password)
      if (!passwordMatch) return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })

      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, nome: true, email: true, phone: true, avatar: true, creci: true, empresa: true, role: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
  }
}

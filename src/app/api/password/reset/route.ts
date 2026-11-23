import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { validatePasswordStrength } from '@/lib/validation'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'

const INVALID = 'Link inválido ou expirado. Peça um novo em "Esqueci minha senha".'

export async function POST(req: NextRequest) {
  if (!checkRateLimit(`${getClientIP(req)}:reset`, 'login').allowed) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const token = typeof body?.token === 'string' ? body.token : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!token || token.length > 200) {
    return NextResponse.json({ error: INVALID }, { status: 400 })
  }

  const strength = validatePasswordStrength(password)
  if (!strength.valid) {
    return NextResponse.json({ error: strength.error }, { status: 400 })
  }

  try {
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } })
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    await prisma.$transaction([
      prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
      // Link de uso único: apaga este e qualquer outro pendente
      prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } }),
    ])

    return NextResponse.json({ message: 'Senha alterada! Entre com a nova senha.' })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json({ error: 'Não foi possível alterar a senha. Tente novamente.' }, { status: 500 })
  }
}

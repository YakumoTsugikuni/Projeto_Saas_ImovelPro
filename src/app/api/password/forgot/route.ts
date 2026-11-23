import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import { prisma } from '@/lib/db'
import { validateEmail } from '@/lib/validation'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'
import { appUrl, passwordResetEmail, sendEmail } from '@/lib/email'

const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hora

// Sempre a mesma resposta: não revela se o email está cadastrado
const OK = { message: 'Se este email estiver cadastrado, você vai receber um link para criar uma nova senha.' }

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Informe um email válido' }, { status: 400 })
  }

  const ip = getClientIP(req)
  if (!checkRateLimit(`${ip}:forgot`, 'register').allowed || !checkRateLimit(`forgot:${email}`, 'register').allowed) {
    return NextResponse.json({ error: 'Muitos pedidos. Tente novamente mais tarde.' }, { status: 429 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, nome: true } })
    if (!user) return NextResponse.json(OK)

    const token = randomBytes(32).toString('base64url')
    await prisma.$transaction([
      // Um pedido novo invalida os links anteriores
      prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: createHash('sha256').update(token).digest('hex'),
          expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
      }),
    ])

    const link = `${appUrl()}/redefinir-senha?token=${token}`
    await sendEmail({ to: email, ...passwordResetEmail(user.nome, link) })
  } catch (error) {
    console.error('Erro ao pedir redefinição de senha:', error)
    return NextResponse.json({ error: 'Não foi possível enviar o email agora. Tente novamente.' }, { status: 500 })
  }

  return NextResponse.json(OK)
}

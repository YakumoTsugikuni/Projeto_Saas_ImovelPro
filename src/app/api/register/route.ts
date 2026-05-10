import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { validatePasswordStrength, validateEmail } from '@/lib/validation'
import { getClientIP, checkRateLimit, setRateLimitHeaders } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    // ✅ SEGURANÇA #1: Rate Limiting no registro
    const clientIP = getClientIP(req)
    const rateLimit = checkRateLimit(clientIP, 'register')

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { error: 'Muitas tentativas de registro. Tente novamente mais tarde.' },
        { status: 429 }
      )
      return setRateLimitHeaders(response, rateLimit)
    }

    const body = await req.json()
    const { name, email, password, phone, empresa, creci } = body

    // ✅ SEGURANÇA #2: Validação de entrada obrigatória
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome é obrigatório e deve ser texto' },
        { status: 400 }
      )
    }

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email é obrigatório e deve ser válido' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Senha é obrigatória' },
        { status: 400 }
      )
    }

    // ✅ SEGURANÇA #3: Validação de força de senha
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    // ✅ SEGURANÇA #4: Verificação de email duplicado
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }, // Normalizar para lowercase
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      )
    }

    // ✅ SEGURANÇA #5: Hash seguro da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // ✅ SEGURANÇA #6: Sanitizar campos de entrada
    const user = await prisma.user.create({
      data: {
        nome: name.trim().slice(0, 255),
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone ? String(phone).slice(0, 20) : null,
        empresa: empresa ? String(empresa).slice(0, 255) : null,
        creci: creci ? String(creci).slice(0, 20) : null,
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    // ✅ SEGURANÇA #7: Não expor detalhes de erro ao cliente
    return NextResponse.json(
      { error: 'Erro ao criar usuário. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}

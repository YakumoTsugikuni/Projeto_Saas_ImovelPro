import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { validateClienteInput } from '@/lib/validation'
import { getClientIP, checkRateLimit, setRateLimitHeaders } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  // ✅ SEGURANÇA: Rate limiting em leitura
  const clientIP = getClientIP(req)
  const rateLimit = checkRateLimit(clientIP, 'api')

  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: 'Muitas requisições. Tente novamente mais tarde.' },
      { status: 429 }
    )
    return setRateLimitHeaders(response, rateLimit)
  }

  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')
  const search = searchParams.get('search')

  const where: any = { userId: (session?.user as any)?.id }
  
  // ✅ SEGURANÇA: Validar parâmetros de query
  if (tipo && typeof tipo === 'string') {
    where.tipo = tipo.slice(0, 50)
  }
  
  if (search && typeof search === 'string') {
    const searchTerm = search.slice(0, 100) // Limita tamanho
    where.OR = [
      { nome: { contains: searchTerm } },
      { email: { contains: searchTerm } },
      { telefone: { contains: searchTerm } },
    ]
  }

  try {
    const clientes = await prisma.cliente.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { visitas: true } } },
    })

    const response = NextResponse.json(clientes)
    return setRateLimitHeaders(response, rateLimit)
  } catch (error) {
    console.error('Error fetching clientes:', error)
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  // ✅ SEGURANÇA: Rate limiting em criação
  const clientIP = getClientIP(req)
  const rateLimit = checkRateLimit(clientIP, 'api')

  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: 'Muitas requisições. Tente novamente mais tarde.' },
      { status: 429 }
    )
    return setRateLimitHeaders(response, rateLimit)
  }

  try {
    const body = await req.json()

    // ✅ SEGURANÇA: Validação completa de entrada
    const validation = validateClienteInput(body)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { nome, email, telefone, tipo, interesse, orcamento, observacoes } = validation.data!

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email: email || null,
        telefone,
        tipo,
        interesse,
        orcamento,
        observacoes,
        userId: (session?.user as any)?.id,
      },
    })

    const response = NextResponse.json(cliente, { status: 201 })
    return setRateLimitHeaders(response, rateLimit)
  } catch (error) {
    console.error('Error creating cliente:', error)
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}

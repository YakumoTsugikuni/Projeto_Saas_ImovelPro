import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { validateImovelInput } from '@/lib/validation'
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
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const where: any = { userId: (session?.user as any)?.id }
  
  // ✅ SEGURANÇA: Validar parâmetros de query
  if (tipo && typeof tipo === 'string') {
    where.tipo = tipo.slice(0, 50)
  }
  
  if (status && typeof status === 'string') {
    where.status = status.slice(0, 50)
  }
  
  if (search && typeof search === 'string') {
    const searchTerm = search.slice(0, 100)
    where.OR = [
      { titulo: { contains: searchTerm } },
      { cidade: { contains: searchTerm } },
      { endereco: { contains: searchTerm } },
    ]
  }

  try {
    const imoveis = await prisma.imovel.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { nome: true, email: true } },
        _count: { select: { visitas: true } },
      },
    })

    const response = NextResponse.json(imoveis)
    return setRateLimitHeaders(response, rateLimit)
  } catch (error) {
    console.error('Error fetching imoveis:', error)
    return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 })
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
    const validation = validateImovelInput(body)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { titulo, descricao, tipo, status, preco, area, quartos, banheiros, vagas, endereco, cidade, estado, cep, imagens, destaque } = validation.data!

    const imovel = await prisma.imovel.create({
      data: {
        titulo,
        descricao,
        tipo, // ✅ Sempre possui valor (validação garante)
        status, // ✅ Sempre possui valor (validação garante)
        preco,
        area,
        quartos,
        banheiros,
        vagas,
        endereco,
        cidade,
        estado,
        cep,
        imagens: imagens ? JSON.stringify(imagens) : '[]',
        destaque,
        userId: (session?.user as any)?.id,
      },
    })

    const response = NextResponse.json(imovel, { status: 201 })
    return setRateLimitHeaders(response, rateLimit)
  } catch (error) {
    console.error('Error creating imovel:', error)
    return NextResponse.json({ error: 'Erro ao criar imóvel' }, { status: 500 })
  }
}

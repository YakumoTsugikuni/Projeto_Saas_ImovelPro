import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { validateImovelInput } from '@/lib/validation'
import { getClientIP, checkRateLimit, setRateLimitHeaders } from '@/lib/rateLimit'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  // ✅ SEGURANÇA: Rate limiting
  const clientIP = getClientIP(req)
  const rateLimit = checkRateLimit(clientIP, 'api')

  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: 'Muitas requisições. Tente novamente mais tarde.' },
      { status: 429 }
    )
    return setRateLimitHeaders(response, rateLimit)
  }

  const { id } = await params
  // ✅ SEGURANÇA: Validar ID
  if (!id || typeof id !== 'string' || id.length === 0) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const imovel = await prisma.imovel.findUnique({
      where: { id },
      include: {
        _count: { select: { visitas: true } },
      },
    })

    if (!imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    // ✅ SEGURANÇA: Verificar autorização
    const userId = (session?.user as any)?.id
    if (imovel.userId !== userId) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const response = NextResponse.json(imovel)
    return setRateLimitHeaders(response, rateLimit)
  } catch (error) {
    console.error('Error fetching imovel:', error)
    return NextResponse.json({ error: 'Erro ao buscar imóvel' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  // ✅ SEGURANÇA: Rate limiting
  const clientIP = getClientIP(req)
  const rateLimit = checkRateLimit(clientIP, 'api')

  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: 'Muitas requisições. Tente novamente mais tarde.' },
      { status: 429 }
    )
    return setRateLimitHeaders(response, rateLimit)
  }

  const { id } = await params
  // ✅ SEGURANÇA: Validar ID
  if (!id || typeof id !== 'string' || id.length === 0) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // ✅ SEGURANÇA: Verificar autorização antes de atualizar
    const existingImovel = await prisma.imovel.findUnique({
      where: { id },
    })

    if (!existingImovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    const userId = (session?.user as any)?.id
    if (existingImovel.userId !== userId) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await req.json()

    // ✅ SEGURANÇA: Validação completa
    const validation = validateImovelInput(body)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { titulo, descricao, tipo, status, preco, area, quartos, banheiros, vagas, endereco, cidade, estado, cep, imagens, destaque } = validation.data!

    const imovel = await prisma.imovel.update({
      where: { id },
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
      },
    })

    const response = NextResponse.json(imovel)
    return setRateLimitHeaders(response, rateLimit)
  } catch (error) {
    console.error('Error updating imovel:', error)
    return NextResponse.json({ error: 'Erro ao atualizar imóvel' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  // ✅ SEGURANÇA: Rate limiting
  const clientIP = getClientIP(req)
  const rateLimit = checkRateLimit(clientIP, 'api')

  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: 'Muitas requisições. Tente novamente mais tarde.' },
      { status: 429 }
    )
    return setRateLimitHeaders(response, rateLimit)
  }

  const { id } = await params
  // ✅ SEGURANÇA: Validar ID
  if (!id || typeof id !== 'string' || id.length === 0) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // ✅ SEGURANÇA: Verificar autorização antes de deletar
    const existingImovel = await prisma.imovel.findUnique({
      where: { id },
    })

    if (!existingImovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    const userId = (session?.user as any)?.id
    if (existingImovel.userId !== userId) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // ✅ SEGURANÇA: Deletar visitas relacionadas
    await prisma.visita.deleteMany({ where: { imovelId: id } })
    await prisma.imovel.delete({
      where: { id },
    })

    const response = NextResponse.json({ success: true })
    return setRateLimitHeaders(response, rateLimit)
  } catch (error) {
    console.error('Error deleting imovel:', error)
    return NextResponse.json({ error: 'Erro ao excluir imóvel' }, { status: 500 })
  }
}

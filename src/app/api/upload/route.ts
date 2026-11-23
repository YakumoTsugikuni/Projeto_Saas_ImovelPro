import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { auth } from '@/lib/auth'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'
import { MAX_IMAGE_BYTES, detectImageType, uploadImage } from '@/lib/storage'

const KINDS = ['imovel', 'avatar'] as const

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  if (!checkRateLimit(`${getClientIP(req)}:${userId}`, 'api').allowed) {
    return NextResponse.json({ error: 'Muitos envios. Tente novamente mais tarde.' }, { status: 429 })
  }

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const kind = form?.get('kind')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  }
  if (typeof kind !== 'string' || !KINDS.includes(kind as (typeof KINDS)[number])) {
    return NextResponse.json({ error: 'Tipo de envio inválido' }, { status: 400 })
  }
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'A imagem deve ter até 4 MB' }, { status: 413 })
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const type = detectImageType(bytes)
  if (!type) {
    return NextResponse.json({ error: 'Formato não suportado. Use JPG, PNG ou WebP.' }, { status: 415 })
  }

  try {
    // Cada usuário só grava dentro da própria pasta; nome aleatório evita sobrescrever arquivos
    const url = await uploadImage(`${kind}/${userId}/${randomUUID()}.${type.ext}`, bytes, type.mime)
    return NextResponse.json({ url }, { status: 201 })
  } catch (error) {
    console.error('Erro no upload de imagem:', error)
    return NextResponse.json({ error: 'Não foi possível enviar a imagem' }, { status: 500 })
  }
}

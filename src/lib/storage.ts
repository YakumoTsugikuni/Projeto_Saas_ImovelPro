/**
 * ARMAZENAMENTO DE IMAGENS (Supabase Storage)
 * Usado só no servidor: a chave service_role NUNCA pode ir para o navegador.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const IMAGE_BUCKET = 'imagens'
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024 // 4 MB (limite de corpo da Vercel é 4,5 MB)

let client: SupabaseClient | null = null
let bucketReady = false

function getAdminClient(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY para enviar imagens')
  }
  client = createClient(url, key, { auth: { persistSession: false } })
  return client
}

/** Cria o bucket público na primeira vez, se ainda não existir. */
async function ensureBucket(supabase: SupabaseClient) {
  if (bucketReady) return
  const { data } = await supabase.storage.getBucket(IMAGE_BUCKET)
  if (!data) {
    const { error } = await supabase.storage.createBucket(IMAGE_BUCKET, {
      public: true,
      fileSizeLimit: MAX_IMAGE_BYTES,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    })
    if (error && !/already exists/i.test(error.message)) throw error
  }
  bucketReady = true
}

/** Descobre o tipo real pelo conteúdo do arquivo (não confia na extensão nem no navegador). */
export function detectImageType(bytes: Uint8Array): { mime: string; ext: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { mime: 'image/png', ext: 'png' }
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return { mime: 'image/webp', ext: 'webp' }
  return null
}

export async function uploadImage(path: string, bytes: Uint8Array, mime: string): Promise<string> {
  const supabase = getAdminClient()
  await ensureBucket(supabase)
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, bytes, { contentType: mime, cacheControl: '31536000', upsert: false })
  if (error) throw error
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

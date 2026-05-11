/**
 * MIDDLEWARE DE SEGURANÇA CENTRALIZADO
 * Tratamento consistente de erros, autorização e validação
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserId } from '@/types/security'
import { getClientIP, checkRateLimit, setRateLimitHeaders } from '@/lib/rateLimit'

/**
 * Resposta de erro padronizada
 */
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Resposta de sucesso padronizada
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Tipo para função de autorização customizada
 */
export type AuthorizeHandler = (req: NextRequest) => Promise<{ userId: string; session: any } | null>

/**
 * Middleware que combina: autenticação + rate limiting + autorização
 */
export async function withAuth(
  req: NextRequest,
  handler: (userId: string, req: NextRequest) => Promise<NextResponse>,
  endpoint: 'login' | 'register' | 'api' | 'default' = 'api'
): Promise<NextResponse> {
  try {
    // 1️⃣ AUTENTICAÇÃO
    const session = await auth()
    if (!session?.user?.id) {
      return errorResponse('Não autorizado', 401)
    }

    // 2️⃣ RATE LIMITING
    const clientIP = getClientIP(req)
    const rateLimit = checkRateLimit(clientIP, endpoint)

    if (!rateLimit.allowed) {
      const response = errorResponse('Muitas requisições. Tente novamente mais tarde.', 429)
      return setRateLimitHeaders(response, rateLimit)
    }

    // 3️⃣ EXECUTA HANDLER
    const result = await handler(session.user.id, req)
    
    // 4️⃣ ADICIONA HEADERS DE RATE LIMIT
    return setRateLimitHeaders(result, rateLimit)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return errorResponse('Erro interno do servidor', 500)
  }
}

/**
 * Middleware para validação de autorização em recurso específico
 */
export async function authorizeResourceAccess(
  resourceOwnerId: string,
  userId: string
): Promise<boolean> {
  return resourceOwnerId === userId
}

/**
 * Extrai parâmetro de query com validação
 */
export function getQueryParam(
  req: NextRequest,
  param: string,
  maxLength: number = 100,
  defaultValue: string = ''
): string {
  const value = new URL(req.url).searchParams.get(param)
  
  if (!value || typeof value !== 'string') {
    return defaultValue
  }

  return value.slice(0, maxLength)
}

/**
 * Middleware para validar JSON body
 */
export async function validateJsonBody(req: NextRequest): Promise<{ valid: boolean; data?: any; error?: string }> {
  try {
    const data = await req.json()
    return { valid: true, data }
  } catch (error) {
    return { valid: false, error: 'Body JSON inválido' }
  }
}

/**
 * Log seguro (não expõe dados sensíveis)
 */
export function logAction(action: string, userId: string, details?: Record<string, any>) {
  const timestamp = new Date().toISOString()
  // Implementar com logger real (Winston, Pino, etc)
  console.log(`[${timestamp}] ACTION: ${action} | USER: ${userId}`, details || {})
}

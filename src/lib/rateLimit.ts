/**
 * MIDDLEWARE DE RATE LIMITING
 * Limita requisições por IP para proteger contra:
 * - Força bruta (login)
 * - DDoS
 * - Spam de requisições
 */

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

const RATE_LIMITS = {
  // Limites específicos por endpoint
  login: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 tentativas em 15 minutos
  register: { requests: 3, windowMs: 60 * 60 * 1000 }, // 3 registros em 1 hora
  api: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requisições em 15 minutos
  default: { requests: 30, windowMs: 1 * 60 * 1000 }, // 30 requisições por minuto (padrão)
}

export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const clientIP = request.headers.get('x-client-ip')
  const realIP = request.headers.get('x-real-ip')

  return forwardedFor?.split(',')[0] || clientIP || realIP || 'unknown'
}

export function checkRateLimit(
  clientIP: string,
  endpoint: keyof typeof RATE_LIMITS = 'default'
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = `${clientIP}:${endpoint}`
  const limit = RATE_LIMITS[endpoint]

  let record = store[key]

  // Se não existe ou expirou, cria novo
  if (!record || now >= record.resetTime) {
    record = {
      count: 1,
      resetTime: now + limit.windowMs,
    }
    store[key] = record
    return { allowed: true, remaining: limit.requests - 1, resetTime: record.resetTime }
  }

  // Se atingiu o limite
  if (record.count >= limit.requests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  // Incrementa contador
  record.count++
  return { allowed: true, remaining: limit.requests - record.count, resetTime: record.resetTime }
}

// Limpar registos antigos a cada 10 minutos
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}, 10 * 60 * 1000)

export function setRateLimitHeaders(response: Response, rateLimit: ReturnType<typeof checkRateLimit>) {
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(rateLimit.resetTime / 1000)))

  if (!rateLimit.allowed) {
    response.headers.set('Retry-After', String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)))
  }

  return response
}

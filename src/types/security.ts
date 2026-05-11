/**
 * TIPOS DE SEGURANÇA
 * Tipagem correta para NextAuth session e outras estruturas de segurança
 * Elimina necessidade de 'as any' em vários lugares
 */

import type { Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

/**
 * Estende o tipo de Session do NextAuth com campos personalizados
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
    }
  }

  interface User {
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
  }
}

/**
 * Tipo para usuário público (sem dados sensíveis)
 */
export interface PublicUserData {
  id: string
  nome: string
  email: string
  role: string
  createdAt: Date
}

/**
 * Tipo para usuário com perfil completo
 */
export interface UserProfile {
  id: string
  nome: string
  email: string
  phone?: string | null
  avatar?: string | null
  creci?: string | null
  empresa?: string | null
  role: string
  createdAt: Date
}

/**
 * Helper para extrair userId da sessão com tipo seguro
 */
export function getUserIdFromSession(session: Session | null): string | null {
  if (!session?.user?.id || typeof session.user.id !== 'string') {
    return null
  }
  return session.user.id
}

/**
 * Helper para extrair userId da sessão sem type casting
 */
export function getUserId(session: Session | null): string {
  const userId = getUserIdFromSession(session)
  if (!userId) throw new Error('User not authenticated')
  return userId
}

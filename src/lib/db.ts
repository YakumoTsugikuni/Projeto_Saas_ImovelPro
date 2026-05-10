import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    process.env.NODE_ENV === 'production'
      ? {} // Sem logs em produção
      : {
          log: ['error', 'warn'], // Apenas erros e warnings em desenvolvimento
        }
  )

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

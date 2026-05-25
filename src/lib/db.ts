import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL environment variable')
}
if (
  !databaseUrl.startsWith('postgres://') &&
  !databaseUrl.startsWith('postgresql://')
) {
  throw new Error(
    'DATABASE_URL must be a PostgreSQL connection string. ' +
      'Do not use the Supabase REST endpoint URL. ' +
      'Example: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public'
  )
}
const pgAdapter = new PrismaPg(databaseUrl)

const clientOptions = { adapter: pgAdapter }

export const prisma = globalForPrisma.prisma ?? new PrismaClient(clientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

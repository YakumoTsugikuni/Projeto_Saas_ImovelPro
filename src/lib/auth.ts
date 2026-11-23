import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'

const DUMMY_HASH = '$2a$12$efTtGzbexkpwsFkF5qXdleBv/B.IDYNk1x0hCEWlJQI.ZYRKTGjHi'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials, request) {
        const email =
          typeof credentials?.email === 'string' ? credentials.email.trim().toLowerCase() : ''
        const password = typeof credentials?.password === 'string' ? credentials.password : ''
        if (!email || !password) return null

        // Limita tentativas por IP + email (proteção contra força bruta)
        const ip = request ? getClientIP(request) : 'unknown'
        if (!checkRateLimit(`${ip}:${email}`, 'login').allowed) return null

        // O cadastro sempre salva o email em minúsculas
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
          // Compara com um hash falso para não revelar, pelo tempo de resposta, se o email existe
          await bcrypt.compare(password, DUMMY_HASH)
          return null
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) return null

        // ✅ Tipagem correta sem 'as any' - ver types/security.ts
        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          image: user.avatar,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  trustHost: true,
})
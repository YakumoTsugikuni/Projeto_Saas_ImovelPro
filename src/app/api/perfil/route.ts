import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { validatePasswordStrength } from '@/lib/validation'
import { getUserId, UserProfile } from '@/types/security'
import { withAuth, errorResponse, successResponse, validateJsonBody, logAction } from '@/lib/middleware'

export async function GET(req: NextRequest) {
  return withAuth(req, async (userId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nome: true,
          email: true,
          phone: true,
          avatar: true,
          creci: true,
          empresa: true,
          role: true,
          createdAt: true,
          // ✅ SEGURANÇA: NÃO RETORNA password em nenhuma circunstância
        },
      })

      if (!user) {
        return errorResponse('Usuário não encontrado', 404)
      }

      logAction('PROFILE_GET', userId)
      return successResponse(user)
    } catch (error) {
      console.error('Error fetching profile:', error)
      return errorResponse('Erro ao buscar perfil')
    }
  })
}

export async function PUT(req: NextRequest) {
  return withAuth(req, async (userId) => {
    try {
      // ✅ SEGURANÇA: Valida JSON body
      const bodyValidation = await validateJsonBody(req)
      if (!bodyValidation.valid) {
        return errorResponse(bodyValidation.error || 'Body inválido', 400)
      }

      const { name, phone, avatar, creci, empresa, currentPassword, newPassword } = bodyValidation.data

      // ✅ SEGURANÇA: Sanitizar inputs
      const updateData: any = {
        nome: name ? String(name).slice(0, 255) : undefined,
        phone: phone ? String(phone).slice(0, 20) : undefined,
        avatar: avatar ? String(avatar).slice(0, 500) : undefined,
        creci: creci ? String(creci).slice(0, 20) : undefined,
        empresa: empresa ? String(empresa).slice(0, 255) : undefined,
      }

      // Remove campos undefined
      Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k])

      // ✅ SEGURANÇA: Validar senha se for alterar
      if (newPassword && currentPassword) {
        if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
          return errorResponse('Senhas devem ser texto', 400)
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { password: true },
        })

        if (!user) {
          return errorResponse('Usuário não encontrado', 404)
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password)
        if (!passwordMatch) {
          logAction('PROFILE_UPDATE_FAILED_PASSWORD', userId, { reason: 'wrong_password' })
          return errorResponse('Senha atual incorreta', 400)
        }

        // Validar força da nova senha
        const passwordValidation = validatePasswordStrength(newPassword)
        if (!passwordValidation.valid) {
          return errorResponse(passwordValidation.error || 'Senha fraca', 400)
        }

        updateData.password = await bcrypt.hash(newPassword, 12)
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          nome: true,
          email: true,
          phone: true,
          avatar: true,
          creci: true,
          empresa: true,
          role: true,
          // ✅ SEGURANÇA: NÃO RETORNA password
        },
      })

      logAction('PROFILE_UPDATE', userId, { fields: Object.keys(updateData) })
      return successResponse(updatedUser)
    } catch (error) {
      console.error('Error updating profile:', error)
      return errorResponse('Erro ao atualizar perfil')
    }
  })
}

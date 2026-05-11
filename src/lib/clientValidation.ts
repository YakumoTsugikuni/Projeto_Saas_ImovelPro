/**
 * VALIDAÇÃO DE CLIENTE (Frontend)
 * Replicação segura das validações do servidor
 * Executa validações locais para melhor UX
 */

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export function validatePasswordStrengthClient(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`,
    }
  }

  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      error: 'Senha deve conter: maiúsculas, minúsculas, números e caracteres especiais (@$!%*?&)',
    }
  }

  return { valid: true }
}

export function validateEmailClient(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < PASSWORD_MIN_LENGTH) return 'weak'
  
  let strength = 0
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[@$!%*?&]/.test(password)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
}

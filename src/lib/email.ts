/**
 * ENVIO DE EMAIL (Resend — https://resend.com, plano grátis: 3.000 emails/mês)
 * Sem RESEND_API_KEY em desenvolvimento, o email é mostrado no terminal em vez de enviado.
 */

interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail(msg: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'ImóvelPro <onboarding@resend.dev>'

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('RESEND_API_KEY não configurada')
    }
    console.log(`\n📧 [email de desenvolvimento] Para: ${msg.to}\nAssunto: ${msg.subject}\n${msg.text}\n`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [msg.to], subject: msg.subject, html: msg.html, text: msg.text }),
  })
  if (!res.ok) {
    throw new Error(`Resend respondeu ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
}

/** URL pública do app. Nunca usa o cabeçalho Host da requisição (poderia ser forjado). */
export function appUrl(): string {
  return (process.env.NEXTAUTH_URL || process.env.AUTH_URL || 'http://localhost:3000').replace(/\/$/, '')
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function passwordResetEmail(nome: string | null, link: string): Omit<EmailMessage, 'to'> {
  const saudacao = nome ? `Olá, ${nome.split(' ')[0]}!` : 'Olá!'
  return {
    subject: 'Redefinir sua senha do ImóvelPro',
    text: `${saudacao}\n\nRecebemos um pedido para redefinir a senha da sua conta.\nCrie uma nova senha neste link (válido por 1 hora):\n${link}\n\nSe não foi você, ignore este email: sua senha continua a mesma.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1E2B4A">
  <h2 style="color:#0D1B40">ImóvelPro</h2>
  <p>${escapeHtml(saudacao)}</p>
  <p>Recebemos um pedido para redefinir a senha da sua conta.</p>
  <p style="margin:28px 0"><a href="${escapeHtml(link)}" style="background:#2563EB;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:bold">Criar nova senha</a></p>
  <p style="font-size:13px;color:#4A5978">O link vale por 1 hora e só pode ser usado uma vez.<br>Se não foi você, ignore este email: sua senha continua a mesma.</p>
</div>`,
  }
}

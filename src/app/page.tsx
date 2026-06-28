import { redirect } from 'next/navigation'

export default function Page() {
  // Redireciona a raiz do site para a página de login
  redirect('/auth/login')
}

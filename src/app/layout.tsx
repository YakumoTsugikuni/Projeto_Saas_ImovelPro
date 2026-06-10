import type { Metadata } from 'next'
import './globals.css'
import OfflineNotice from '@/components/OfflineNotice'

export const metadata: Metadata = {
  title: 'ImóvelPro — Plataforma para Imobiliárias e Corretores',
  description: 'Gerencie seus imóveis, clientes e visitas em um só lugar. A plataforma ideal para imobiliárias e corretores de imóveis.',
  keywords: 'imobiliária, corretor de imóveis, gestão imobiliária, CRM imobiliário, software imobiliário',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <OfflineNotice />
      </body>
    </html>
  )
}

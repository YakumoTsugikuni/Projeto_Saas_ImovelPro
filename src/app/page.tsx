import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: imoveis, error } = await supabase.from('Imovel').select()
  const hasImoveis = Array.isArray(imoveis) && imoveis.length > 0

  return (
    <main style={{ padding: '2rem' }}>
      <h1>ImóvelPro</h1>
      <p>Bem-vindo ao painel. Esta página exibe registros da tabela <code>Imovel</code> do Supabase.</p>

      {error ? (
        <div style={{ color: '#dc2626' }}>
          Erro ao carregar dados: {error.message}
        </div>
      ) : hasImoveis ? (
        <ul>
          {imoveis.map((imovel: any) => (
            <li key={imovel.id}>
              <strong>{imovel.titulo || imovel.id}</strong>
              {imovel.cidade ? ` — ${imovel.cidade}` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          Nenhum registro encontrado na tabela <strong>Imovel</strong>.
          <br />
          Crie imóveis nesta aplicação ou no painel Supabase.
        </div>
      )}
    </main>
  )
}

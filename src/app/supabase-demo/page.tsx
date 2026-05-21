import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: imoveis, error } = await supabase.from('Imovel').select()
  const hasImoveis = Array.isArray(imoveis) && imoveis.length > 0

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Supabase Demo</h1>
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
          Crie imóveis nesta aplicação ou no painel Supabase para testar.
        </div>
      )}
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: imoveis, error } = await supabase.from('Imovel').select()
  const hasImoveis = Array.isArray(imoveis) && imoveis.length > 0

  return (
    <div style={{ padding: '2rem' }} className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--gray-100)', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Supabase Demo</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/todos" className="btn btn-primary btn-sm">Ver Demo Todos</a>
          <a href="/" className="btn btn-secondary btn-sm">Voltar Home</a>
        </div>
      </div>
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

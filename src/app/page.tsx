import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos, error } = await supabase.from('todos').select()
  const hasTodos = Array.isArray(todos) && todos.length > 0

  return (
    <main style={{ padding: '2rem' }}>
      <h1>ImóvelPro</h1>
      <p>Bem-vindo ao painel. Esta página exibe registros da tabela <code>todos</code> do Supabase.</p>

      {error ? (
        <div style={{ color: '#dc2626' }}>
          Erro ao carregar dados: {error.message}
        </div>
      ) : hasTodos ? (
        <ul>
          {todos.map((todo: any) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      ) : (
        <div>
          Nenhum registro encontrado na tabela <strong>todos</strong>.
          <br />
          Verifique o banco Supabase ou navegue para <a href="/supabase-demo">/supabase-demo</a>.
        </div>
      )}
    </main>
  )
}

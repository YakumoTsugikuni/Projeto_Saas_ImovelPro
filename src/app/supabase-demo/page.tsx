import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos, error } = await supabase.from('todos').select()
  const hasTodos = Array.isArray(todos) && todos.length > 0

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Supabase Demo</h1>
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
          Crie alguns registros no Supabase para testar.
        </div>
      )}
    </div>
  )
}

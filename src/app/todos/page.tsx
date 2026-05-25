import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos, error } = await supabase.from('todos').select()

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }} className="animate-fadeIn">
      <div className="page-header" style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Supabase Todos Demo</h1>
          <p className="page-subtitle">Exemplo prático de consulta ao banco de dados Supabase via Server Component.</p>
        </div>
        <Link href="/" className="btn btn-secondary">
          Voltar para Home
        </Link>
      </div>

      {error && (
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          <strong>Erro ao carregar dados:</strong> {error.message}
        </div>
      )}

      <div className="card">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--midnight)' }}>Lista de Tarefas (Todos)</h2>
        
        {!todos || todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>Nenhum todo encontrado</h3>
            <p>Sua tabela de "todos" está vazia ou ainda não foi criada no Supabase.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todos.map((todo) => (
              <li 
                key={todo.id} 
                className="card-hover"
                style={{ 
                  padding: '1rem 1.25rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1.5px solid var(--gray-100)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: 'var(--white)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: todo.completed ? 'var(--success)' : 'var(--blue-mid)' 
                  }} />
                  <span style={{ 
                    fontWeight: 500, 
                    color: 'var(--gray-800)',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    opacity: todo.completed ? 0.6 : 1
                  }}>
                    {todo.name}
                  </span>
                </div>
                <span className={`badge ${todo.completed ? 'badge-green' : 'badge-blue'}`}>
                  {todo.completed ? 'Concluído' : 'Pendente'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

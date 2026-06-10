"use client"

import { useEffect, useState } from 'react'

export default function OfflineNotice() {
  const [open, setOpen] = useState(false)
  const [usingLocal, setUsingLocal] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        if (!data.online && data.usingLocalDb) {
          setUsingLocal(true)
          setOpen(true)
        }
      })
      .catch(() => {
        if (!mounted) return
        setUsingLocal(true)
        setOpen(true)
      })

    return () => {
      mounted = false
    }
  }, [])

  if (!open) return null

  return (
    <div style={{position: 'fixed', left: 16, bottom: 16, zIndex: 9999}}>
      <div style={{background: '#111827', color: '#fff', padding: '12px 16px', borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,0.2)'}}>
        <strong>Aviso:</strong>
        <div style={{marginTop: 6}}>
          A aplicação não está conectada ao banco de dados na nuvem (Supabase). Usando banco local (SQLite).
        </div>
        <div style={{marginTop: 8, textAlign: 'right'}}>
          <button onClick={() => setOpen(false)} style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '6px 10px', borderRadius: 6}}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

import { useCallback, useState } from 'react'

export function useFetch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(async <T,>(
    url: string,
    options?: RequestInit
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro na requisição')
      }

      const data = await res.json()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, request }
}

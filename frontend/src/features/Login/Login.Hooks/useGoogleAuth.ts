import { useCallback, useMemo, useRef, useState } from 'react'
import type { User } from '@/features/Login/Login.Types/User'

type ExchangeResponse = {
  user?: User
  token?: string
  // any additional fields returned by your API
  [k: string]: any
}

function resolveAuthUrl() {
  const fromEnv = import.meta.env.VITE_GOOGLE_AUTH_URL as string | undefined
  const api = import.meta.env.VITE_API_URL as string | undefined
  if (fromEnv) return fromEnv
  if (api) return `${api.replace(/\/$/, '')}/auth/google`
  // Fallback used in the task description
  return '/routes/auth'
}

/**
 * Hook to exchange a Google ID Token (credential) for an app session/JWT
 * - Reads the One Tap credential from localStorage key "google_credential" if not provided
 * - Sends POST to your backend and returns the parsed response
 */
export function useGoogleAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastToken = useRef<string | null>(null)

  const url = useMemo(() => resolveAuthUrl(), [])

  const exchange = useCallback(async (idToken?: string): Promise<ExchangeResponse> => {
    setError(null)
    const token = idToken ?? (() => {
      try { return localStorage.getItem('google_credential') } catch { return null }
    })()
    if (!token) {
      setError('No se encontró idToken de Google.')
      throw new Error('Missing Google idToken')
    }

    // Avoid duplicate exchanges with the same token (double clicks/fast re-renders)
    if (lastToken.current === token) return {}

    setLoading(true)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // allow backend to set session cookie
        body: JSON.stringify({ token }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        const msg = text || `HTTP ${res.status}`
        setError(msg)
        throw new Error(msg)
      }

      const data = (await res.json()) as ExchangeResponse

      // Optional: persist JWT returned by the API
      if (data.token) {
        try { localStorage.setItem('token', data.token) } catch {}
      }
      lastToken.current = token
      return data
    } finally {
      setLoading(false)
    }
  }, [url])

  return { exchange, loading, error }
}

export default useGoogleAuth

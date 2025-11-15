import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type User = {
  id: number
  nombre: string
  correo: string
  apellido?: string
  campus?: string
  usuario?: string
  role?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Restaurar sesión desde localStorage
  useEffect(() => {
    try {
      // Intentar con app_jwt_token primero, luego con token para compatibilidad
      const storedToken = localStorage.getItem('app_jwt_token') || localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (err) {
      console.warn('Error al restaurar sesión', err)
    } finally {
      setLoading(false)
    }
  }, [])

  function login(newToken: string, newUser: User) {
    setToken(newToken)
    setUser(newUser)
    // Guardar en ambas claves para consistencia
    localStorage.setItem('app_jwt_token', newToken)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function logout() {
    setToken(null)
    setUser(null)
    // Limpiar todas las claves de autenticación
    localStorage.removeItem('app_jwt_token')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

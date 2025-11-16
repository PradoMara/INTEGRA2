import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/app/context/AuthContext' // 1. Importa el hook de autenticación

// --- Tipos de TypeScript ---
// (Estos deberían coincidir con tu AuthContext y la respuesta de la API)

// Datos que espera la API /api/auth/login
type FormData = {
  email: string
  password: string
}

// Respuesta de la API en caso de error
type ApiErrorResponse = {
  ok: false
  message: string
}

// Respuesta de la API en caso de éxito
type ApiSuccessResponse = {
  ok: true
  message: string
  token: string
  user: {
    id: number
    email: string
    nombre: string
    role: string
    // ...otros campos
  }
}

/**
 * Componente de prueba para iniciar sesión con email y contraseña.
 */
function LoginTest() {
  // --- Hooks ---
  const { login } = useAuth() // 2. Obtiene la función 'login' del contexto
  const navigate = useNavigate()
  const location = useLocation()

  // --- Estado Local ---
  const [formData, setFormData] = useState<FormData>({
    email: 'prueba.ts@alu.uct.cl',
    password: 'password123',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 3. Determina a dónde redirigir al usuario después del login
  // (Si intentó ir a /perfil, lo manda a /perfil. Si no, a /home)
  const from = location.state?.from?.pathname || '/home'

  // --- Manejadores ---

  /**
   * Actualiza el estado del formulario cuando el usuario escribe.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /**
   * Maneja el envío del formulario al backend.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null) // Limpia errores previos

    try {
      // 4. Llama al endpoint de la API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: ApiSuccessResponse | ApiErrorResponse = await res.json()

      if (data.ok) {
        // 5. ¡Éxito! Llama al contexto para guardar la sesión globalmente
        login(data.token, data.user)
        
        // 6. Redirige al usuario
        navigate(from, { replace: true })
      } else {
        // Error de credenciales
        setError(data.message || 'Credenciales inválidas')
      }
    } catch (err) {
      // Error de red
      console.error(err)
      setError('Error de red. No se pudo conectar al servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Renderizado ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          🔑 Iniciar Sesión (Prueba)
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* Alerta de Error */}
          {error && (
            <div
              className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm font-medium text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-1.5 block font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2.5 px-4 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

          {/* Link a Registrar */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginTest
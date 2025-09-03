import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import { UserRepository } from '../../infrastructure/repositories/UserRepository'
import { LoginUser } from '../../domain/usecases/LoginUser'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const repo = new UserRepository()
  const loginUseCase = new LoginUser(repo)

  async function handleSubmit(email: string, password: string) {
    setError(null)
    setLoading(true)
    try {
      const u = await loginUseCase.execute({ email, password })
      setUser(u)
    } catch (err: any) {
      setError(err.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div>
        <h2>Bienvenido, {user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Token: {user.token}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>video?</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <LoginForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}

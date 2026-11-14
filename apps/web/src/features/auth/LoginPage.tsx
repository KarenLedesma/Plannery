import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { mensajeDeError } from '../../shared/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const ubicacion = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    // Validación en el navegador para dar respuesta rápida. El backend valida igual.
    if (!email.trim() || !password) {
      setError('Completá el email y la contraseña.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      await login(email.trim(), password)
      // Si lo mandaron al login desde una ruta protegida, vuelve a esa ruta
      const destino = (ubicacion.state as { desde?: string } | null)?.desde ?? '/'
      navigate(destino, { replace: true })
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="auth">
      <h1>Iniciar sesión</h1>
      <form onSubmit={enviar} noValidate>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p>
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </main>
  )
}

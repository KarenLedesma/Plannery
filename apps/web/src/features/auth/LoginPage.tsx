import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { mensajeDeError } from '../../shared/api'
import { PasswordInput } from './PasswordInput'

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
    if (!email.trim() || !password) {
      return
    }
    setError('')
    setEnviando(true)
    try {
      await login(email.trim(), password)
      const destino = (ubicacion.state as { desde?: string } | null)?.desde ?? '/'
      navigate(destino, { replace: true })
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="login">
      <aside className="login-hero">
        <div className="login-marca">Plannery</div>
        <h2>Planificá tu Buenos Aires según el clima</h2>
        <p>Armá tu viaje y recibí recomendaciones de lugares para cada día, pensadas para el pronóstico.</p>
        <div className="login-sol" aria-hidden="true" />
        <svg className="login-obelisco" viewBox="0 0 120 420" aria-hidden="true" focusable="false">
          <polygon points="60,10 66,70 80,390 40,390 54,70" fill="#fbf7f0" />
          <rect x="30" y="390" width="60" height="30" fill="#efe6d6" />
          <rect x="56" y="110" width="8" height="14" rx="4" fill="#1b6fa8" opacity="0.35" />
        </svg>
      </aside>

      <section className="login-panel">
        <div className="login-tarjeta">
          <h1>Iniciar sesión</h1>
          <p className="login-sub">Entrá para ver y planificar tus viajes.</p>
          <form onSubmit={enviar} noValidate>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            <label>
              Contraseña
              <PasswordInput
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
            <button type="submit" className="boton" disabled={enviando}>
              {enviando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
          <p className="login-pie">
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
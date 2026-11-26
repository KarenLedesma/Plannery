import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { mensajeDeError } from '../../shared/api'
import { PasswordInput } from './PasswordInput'

function validar(nombre: string, email: string, password: string, repetida: string): string {
  if (nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.'
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Ingresá un email válido.'
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (password.length > 72) return 'La contraseña no puede superar los 72 caracteres.'
  if (password !== repetida) return 'Las contraseñas no coinciden.'
  return ''
}

export function RegisterPage() {
  const { registrar } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetida, setRepetida] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const problema = validar(nombre, email, password, repetida)
    if (problema) {
      setError(problema)
      return
    }
    setError('')
    setEnviando(true)
    try {
      await registrar(nombre.trim(), email.trim(), password)
      navigate('/', { replace: true })
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
        <h2>Empezá a planificar tu Buenos Aires</h2>
        <p>Creá tu cuenta y organizá tus viajes con recomendaciones pensadas para el pronóstico de cada día.</p>
        <div className="login-sol" aria-hidden="true" />
        <svg className="login-obelisco" viewBox="0 0 120 420" aria-hidden="true" focusable="false">
          <polygon points="60,10 66,70 80,390 40,390 54,70" fill="#fbf7f0" />
          <rect x="30" y="390" width="60" height="30" fill="#efe6d6" />
          <rect x="56" y="110" width="8" height="14" rx="4" fill="#1b6fa8" opacity="0.35" />
        </svg>
      </aside>

      <section className="login-panel">
        <div className="login-tarjeta">
          <h1>Crear cuenta</h1>
          <p className="login-sub">Registrate para empezar a planificar tus viajes.</p>
          <form onSubmit={enviar} noValidate>
            <label>
              Nombre
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label>
              Contraseña (mínimo 8 caracteres)
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            <label>
              Repetir contraseña
              <PasswordInput
                value={repetida}
                onChange={(e) => setRepetida(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button type="submit" className="boton" disabled={enviando}>
              {enviando ? 'Creando cuenta…' : 'Registrarme'}
            </button>
          </form>
          <p className="login-pie">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
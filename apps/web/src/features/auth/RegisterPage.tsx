import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { mensajeDeError } from '../../shared/api'

// Mismos límites que el backend (auth.dto.ts)
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
    <main className="auth">
      <h1>Crear cuenta</h1>
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label>
          Repetir contraseña
          <input
            type="password"
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
        <button type="submit" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Registrarme'}
        </button>
      </form>
      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </main>
  )
}

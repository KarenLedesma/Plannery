import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api, ApiError } from '../../shared/api'
import { AuthContext } from './auth-context'
import type { Usuario } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  // Al abrir la app se le pregunta al backend si hay una sesión abierta (cookie válida).
  // Así la sesión sobrevive a recargar la página.
  useEffect(() => {
    api<Usuario>('/auth/me')
      .then(setUsuario)
      .catch((error) => {
        // 401 es lo esperado cuando nadie inició sesión
        if (!(error instanceof ApiError && error.status === 401)) console.error(error)
        setUsuario(null)
      })
      .finally(() => setCargando(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setUsuario(await api<Usuario>('/auth/login', { method: 'POST', body: { email, password } }))
  }, [])

  const registrar = useCallback(
    async (nombre: string, email: string, password: string) => {
      await api('/auth/register', { method: 'POST', body: { nombre, email, password } })
      // Después de registrarse inicia sesión sola
      await login(email, password)
    },
    [login],
  )

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' })
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({ usuario, cargando, login, registrar, logout }),
    [usuario, cargando, login, registrar, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

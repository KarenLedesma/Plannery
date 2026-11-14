import { createContext } from 'react'

export type Rol = 'VIAJERO' | 'ADMIN'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
}

export interface AuthContextValue {
  usuario: Usuario | null
  // true mientras se averigua si hay una sesión abierta al cargar la página
  cargando: boolean
  login: (email: string, password: string) => Promise<void>
  registrar: (nombre: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

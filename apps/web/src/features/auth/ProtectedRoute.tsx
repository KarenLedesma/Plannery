import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import type { Rol } from './auth-context'

// Muestra las rutas hijas solo si hay sesión (y, si se indica, el rol correcto).
// Ojo: esto es comodidad de uso. La seguridad real la hace el backend con 401 y 403.
export function ProtectedRoute({ roles }: { roles?: Rol[] }) {
  const { usuario, cargando } = useAuth()
  const ubicacion = useLocation()

  if (cargando) return <p className="estado">Cargando…</p>
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />
  return <Outlet />
}

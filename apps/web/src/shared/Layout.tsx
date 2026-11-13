import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

// Estructura común de las pantallas con sesión: barra superior y contenido
export function Layout() {
  const { usuario, logout } = useAuth()

  return (
    <>
      <header className="barra">
        <Link to="/" className="marca">
          Plannery
        </Link>
        <span>
          {usuario?.nombre} · {usuario?.rol === 'ADMIN' ? 'Administrador/a' : 'Viajero/a'}
        </span>
        {/* Al cerrar sesión, ProtectedRoute detecta que no hay usuario y redirige al login */}
        <button type="button" onClick={() => logout()}>
          Cerrar sesión
        </button>
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </>
  )
}

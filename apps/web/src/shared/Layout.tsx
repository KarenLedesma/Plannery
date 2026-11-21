import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import './sidebar-cards.css'

export function Layout() {
  const { usuario, logout } = useAuth()
  const inicial = usuario?.nombre?.charAt(0).toUpperCase() ?? 'U'

  return (
    <div>
      <aside className="pl-sidebar">
        <Link to="/" className="pl-sidebar-logo" title="Plannery">
          P
        </Link>

        <nav className="pl-sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `pl-sidebar-item ${isActive ? 'active' : ''}`}
            title="Inicio"
          >
            🏠
          </NavLink>
          <NavLink
            to="/viajes"
            className={({ isActive }) => `pl-sidebar-item ${isActive ? 'active' : ''}`}
            title="Mis Viajes"
          >
            🧳
          </NavLink>
          <NavLink
            to="/viajes/nuevo"
            className={({ isActive }) => `pl-sidebar-item ${isActive ? 'active' : ''}`}
            title="Nuevo Viaje"
          >
            ➕
          </NavLink>
          {usuario?.rol === 'ADMIN' && (
            <NavLink
              to="/admin/catalogo"
              className={({ isActive }) => `pl-sidebar-item ${isActive ? 'active' : ''}`}
              title="Catálogo Admin"
            >
              ⚙️
            </NavLink>
          )}
        </nav>

        {usuario && (
          <div className="pl-sidebar-footer">
            <div
              className="pl-sidebar-avatar"
              title={`${usuario.nombre} · ${usuario.rol === 'ADMIN' ? 'Administrador/a' : 'Viajero/a'}`}
            >
              {inicial}
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="pl-sidebar-item"
              title="Cerrar sesión"
            >
              🚪
            </button>
          </div>
        )}
      </aside>

      <main className="pl-main-area">
        <Outlet />
      </main>
    </div>
  )
}
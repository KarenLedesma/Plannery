import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { Layout } from './shared/Layout'
import { Inicio } from './shared/Inicio'

// Cada funcionalidad agrega sus rutas dentro del bloque que le corresponde:
// - Bloque 1: cualquier persona con sesión (F2 viajes, F4 gastos, F5 resumen).
// - Bloque 2: solo ADMIN (F3 catálogo).
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          {/* F2, F4 y F5 agregan sus rutas acá */}
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route element={<Layout />}>{/* F3 agrega las rutas del catálogo acá */}</Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

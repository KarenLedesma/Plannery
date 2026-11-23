import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { Layout } from './shared/Layout'
import { Inicio } from './shared/Inicio'
import { RecomendacionesPage } from './features/recomendaciones/RecomendacionesPage'
import { CatalogoAdminPage } from './features/catalogo/CatalogoAdminPage'
import { ViajeListComponent, ViajeFormComponent, ViajeDetallePage } from './features/viajes'
import { ItinerarioPage } from './features/itinerario'
import { GastosPage, ComparacionPage } from './features/gastos'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="viajes" element={<ViajeListComponent />} />
          <Route path="viajes/nuevo" element={<ViajeFormComponent />} />
          <Route path="viajes/:id" element={<ViajeDetallePage />} />
          <Route path="viajes/:id/itinerario" element={<ItinerarioPage />} />
          <Route path="viajes/:id/recomendaciones" element={<RecomendacionesPage />} />
          <Route path="viajes/:id/gastos" element={<GastosPage />} />
          <Route path="viajes/:id/gastos/comparacion" element={<ComparacionPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route element={<Layout />}>
          <Route path="admin/catalogo" element={<CatalogoAdminPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
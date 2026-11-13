import { useAuth } from '../features/auth/useAuth'

// Pantalla provisoria. F2 la reemplaza por la lista de viajes.
export function Inicio() {
  const { usuario } = useAuth()
  return (
    <section>
      <h1>Hola, {usuario?.nombre}</h1>
      <p>Iniciaste sesión correctamente. Acá va a aparecer tu lista de viajes.</p>
    </section>
  )
}

import { useAuth } from '../features/auth/useAuth'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarViajes, type Viaje } from '../features/viajes/viajes.service'

// Helper para categorizar un viaje
const categorizarViaje = (viaje: Viaje, hoy: Date) => {
  const inicio = new Date(viaje.fechaInicio)
  const fin = new Date(viaje.fechaFin)
  if (fin < hoy) return 'terminados'
  if (inicio > hoy) return 'pendientes'
  return 'en_curso'
}

export function Inicio() {
  const { usuario } = useAuth()

  const [viajes, setViajes] = useState<Viaje[]>([])
  const [cargar, setCargar] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarViajes() {
      try {
        // El backend filtra por la sesión (cookie): no hace falta mandar el id del usuario
        const data = await listarViajes()
        setViajes(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setCargar(false)
      }
    }
    cargarViajes()
  }, [])

  const hoy = new Date()

  const [filtro, setFiltro] = useState<'todos' | 'pendientes' | 'en_curso' | 'terminados'>('todos')
  const viajesFiltrados = viajes.filter((viaje) => categorizarViaje(viaje, hoy) === filtro || filtro === 'todos')

  if (cargar) return <p>Cargando...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <section>
      <h1>Hola, {usuario?.nombre}</h1>
      <p>Iniciaste sesión correctamente. Acá va a aparecer tu lista de viajes.</p>

      <nav aria-label="Filtro de viajes">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setFiltro('todos')}
            style={{ padding: '0.25rem 0.5rem', border: filtro === 'todos' ? '1px solid #0066cc' : 'none', borderRadius: '4px', background: filtro === 'todos' ? '#e6f7ff' : 'transparent', cursor: 'pointer' }}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('pendientes')}
            style={{ padding: '0.25rem 0.5rem', border: filtro === 'pendientes' ? '1px solid #0066cc' : 'none', borderRadius: '4px', background: filtro === 'pendientes' ? '#e6f7ff' : 'transparent', cursor: 'pointer' }}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFiltro('en_curso')}
            style={{ padding: '0.25rem 0.5rem', border: filtro === 'en_curso' ? '1px solid #0066cc' : 'none', borderRadius: '4px', background: filtro === 'en_curso' ? '#e6f7ff' : 'transparent', cursor: 'pointer' }}
          >
            En curso
          </button>
          <button
            onClick={() => setFiltro('terminados')}
            style={{ padding: '0.25rem 0.5rem', border: filtro === 'terminados' ? '1px solid #0066cc' : 'none', borderRadius: '4px', background: filtro === 'terminados' ? '#e6f7ff' : 'transparent', cursor: 'pointer' }}
          >
            Terminados
          </button>
        </div>
      </nav>

      <Link to="/viajes/nuevo" style={{ marginBottom: '1rem', display: 'inline-block', padding: '0.5rem 1rem', background: '#0066cc', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Nuevo Viaje
      </Link>

      {viajesFiltrados.length === 0 && <p style={{ color: 'gray' }}>No tienes viajes {filtro === 'todos' ? 'registrados' : filtro === 'pendientes' ? 'pendientes' : filtro === 'en_curso' ? 'en curso' : 'terminados'}.</p>}

      <ul>
        {viajesFiltrados.map((viaje) => (
          <li key={viaje.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
            <h3>{viaje.nombre}</h3>
            <p><strong>Destino:</strong> {viaje.destinoId}</p>
            <p><strong>Fechas:</strong> {viaje.fechaInicio} - {viaje.fechaFin}</p>
            <p><strong>Presupuesto:</strong> {viaje.presupuesto}</p>
            <Link to={`/viajes/${viaje.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>Ver detalle</Link>
            <Link to={`/viajes/${viaje.id}/itinerario`} style={{ marginLeft: '1rem', color: 'green', textDecoration: 'none' }}>Modificar Itinerario</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

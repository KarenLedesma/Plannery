import { useAuth } from '../features/auth/useAuth'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarViajes, type Viaje } from '../features/viajes/viajes.service'

type Estado = 'pendientes' | 'en_curso' | 'terminados'
type Filtro = 'todos' | Estado

const FILTROS: { valor: Filtro; texto: string }[] = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'pendientes', texto: 'Pendientes' },
  { valor: 'en_curso', texto: 'En curso' },
  { valor: 'terminados', texto: 'Terminados' },
]

const ETIQUETAS: Record<Estado, string> = {
  pendientes: 'Pendiente',
  en_curso: 'En curso',
  terminados: 'Terminado',
}

const MENSAJE_VACIO: Record<Filtro, string> = {
  todos: 'No tenés viajes registrados.',
  pendientes: 'No tenés viajes pendientes.',
  en_curso: 'No tenés viajes en curso.',
  terminados: 'No tenés viajes terminados.',
}

// Helper para categorizar un viaje
const categorizarViaje = (viaje: Viaje, hoy: Date): Estado => {
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
  const [filtro, setFiltro] = useState<Filtro>('todos')

  useEffect(() => {
    async function cargarViajes() {
      try {
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
  const viajesFiltrados = viajes.filter(
    (viaje) => filtro === 'todos' || categorizarViaje(viaje, hoy) === filtro,
  )

  if (cargar) return <p>Cargando...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <section>
      <h1 className="pl-inicio-titulo">Hola, {usuario?.nombre}</h1>
      <p className="pl-inicio-sub">
        {viajes.length} {viajes.length === 1 ? 'viaje' : 'viajes'} en total
      </p>

      <div className="pl-toolbar">
        <nav aria-label="Filtro de viajes" className="pl-filtros">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              onClick={() => setFiltro(f.valor)}
              className={filtro === f.valor ? 'pl-filtro activo' : 'pl-filtro'}
            >
              {f.texto}
            </button>
          ))}
        </nav>

        <Link to="/viajes/nuevo" className="pl-btn-nuevo">
          + Nuevo viaje
        </Link>
      </div>

      {viajesFiltrados.length === 0 && (
        <p style={{ color: 'gray', marginTop: '1.5rem' }}>{MENSAJE_VACIO[filtro]}</p>
      )}

      <ul className="pl-viajes-grid">
        {viajesFiltrados.map((viaje) => {
          const estado = categorizarViaje(viaje, hoy)
          return (
            <li key={viaje.id} className="pl-viaje-card">
              <div>
                <div className="pl-viaje-head">
                  <h3 className="pl-viaje-title">{viaje.nombre}</h3>
                  <span className={`pl-badge ${estado}`}>{ETIQUETAS[estado]}</span>
                </div>
                <p className="pl-viaje-meta">
                  <strong>Destino:</strong> {viaje.destino?.nombre ?? viaje.destinoId}
                </p>
                <p className="pl-viaje-meta">
                  <strong>Fechas:</strong> {viaje.fechaInicio?.slice(0, 10)} - {viaje.fechaFin?.slice(0, 10)}
                </p>
                <p className="pl-viaje-meta">
                  <strong>Presupuesto:</strong> ${viaje.presupuesto}
                </p>
              </div>

              <div className="pl-viaje-links">
                <Link to={`/viajes/${viaje.id}`}>Ver detalle</Link>
                <Link to={`/viajes/${viaje.id}/itinerario`}>Itinerario</Link>
                <Link to={`/viajes/${viaje.id}/recomendaciones`} className="principal">
                  Ver recomendaciones
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
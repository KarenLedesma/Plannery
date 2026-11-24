import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { mensajeDeError } from '../../shared/api'
import { crearItinerario, listarItinerario } from '../itinerario/itinerario.service'
import { obtenerRecomendaciones, quitarDelItinerario } from './recomendaciones.service'
import type { DiaRecomendado, Recomendaciones } from './tipos'
import './recomendaciones.css'

const POR_DIA = 5

const ETIQUETA_DIA = { BUENO: 'Día bueno', LLUVIOSO: 'Día lluvioso', EXTREMO: 'Clima extremo' } as const
const ETIQUETA_TIPO = { INTERIOR: 'Interior', EXTERIOR: 'Exterior', MIXTA: 'Mixta' } as const
const ICONO_DIA = { BUENO: '☀️', LLUVIOSO: '🌧️', EXTREMO: '🌡️' } as const
const ICONO_TIPO = { INTERIOR: '🏛️', EXTERIOR: '🌳', MIXTA: '🔀' } as const

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

// Clave para saber si una actividad ya está en el itinerario ese día
const clave = (actividadId: string, fecha: string) => `${actividadId}|${fecha.slice(0, 10)}`

// "2026-11-17" -> "martes, 17 de noviembre". Se usa el mediodía en UTC para que la fecha no se corra un día.
function formatearFecha(fecha: string) {
  return new Date(`${fecha}T12:00:00Z`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

function BotonAgregar({
  viajeId,
  actividadId,
  fecha,
  itemId,
  onAgregada,
  onQuitada,
}: {
  viajeId: string
  actividadId: string
  fecha: string
  itemId: string | undefined // si tiene valor, la actividad ya está en el itinerario
  onAgregada: (clave: string, itemId: string) => void
  onQuitada: (clave: string) => void
}) {
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const yaAgregada = itemId !== undefined

  async function agregar() {
    setOcupado(true)
    setError('')
    try {
      const item = await crearItinerario(viajeId, { actividadId, fecha })
      onAgregada(clave(actividadId, fecha), item.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo agregar al itinerario.')
    } finally {
      setOcupado(false)
    }
  }

  async function quitar() {
    if (!itemId) return
    setOcupado(true)
    setError('')
    try {
      await quitarDelItinerario(viajeId, itemId)
      onQuitada(clave(actividadId, fecha))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo quitar del itinerario.')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="agregar">
      {yaAgregada ? (
        <>
          <span className="btn-agregar agregada">✓ Agregada al itinerario</span>
          <button type="button" className="btn-quitar" onClick={quitar} disabled={ocupado}>
            {ocupado ? 'Quitando…' : 'Quitar'}
          </button>
        </>
      ) : (
        <button type="button" className="btn-agregar" onClick={agregar} disabled={ocupado}>
          {ocupado ? 'Agregando…' : '+ Agregar al itinerario'}
        </button>
      )}
      {error && (
        <p role="alert" className="agregar-error">
          {error}
        </p>
      )}
    </div>
  )
}

function DiaTarjeta({
  dia,
  viajeId,
  agregadas,
  onAgregada,
  onQuitada,
}: {
  dia: DiaRecomendado
  viajeId: string
  agregadas: Map<string, string>
  onAgregada: (clave: string, itemId: string) => void
  onQuitada: (clave: string) => void
}) {
  const [verTodas, setVerTodas] = useState(false)
  const visibles = verTodas ? dia.actividades : dia.actividades.slice(0, POR_DIA)
  const { clima } = dia

  return (
    <article className={`dia dia-${clima.tipoDia.toLowerCase()}`}>
      <header>
        <div>
          <h3>{capitalizar(formatearFecha(dia.fecha))}</h3>
          <p className="clima">
            🌡️ {clima.tempMin}° a {clima.tempMax}° · 🌧️ {clima.probLluvia}% de lluvia
          </p>
        </div>
        <span className="etiqueta">
          {ICONO_DIA[clima.tipoDia]} {ETIQUETA_DIA[clima.tipoDia]}
        </span>
      </header>

      {dia.actividades.length === 0 ? (
        <p>No hay actividades para recomendar este día.</p>
      ) : (
        <>
          <ul>
            {visibles.map((a) => (
              <li key={a.id}>
                <div className="act-cab">
                  <strong>{a.nombre}</strong>
                  <span className="tipo">
                    {ICONO_TIPO[a.tipo]} {ETIQUETA_TIPO[a.tipo]}
                  </span>
                </div>
                {a.direccion && <div className="direccion">📍 {a.direccion}</div>}
                {a.descripcion && <p>{a.descripcion}</p>}
                <BotonAgregar
                  viajeId={viajeId}
                  actividadId={a.id}
                  fecha={dia.fecha}
                  itemId={agregadas.get(clave(a.id, dia.fecha))}
                  onAgregada={onAgregada}
                  onQuitada={onQuitada}
                />
              </li>
            ))}
          </ul>
          {dia.actividades.length > POR_DIA && (
            <button type="button" className="ver-todas" onClick={() => setVerTodas(!verTodas)}>
              {verTodas ? 'Ver menos' : `Ver todas (${dia.actividades.length})`}
            </button>
          )}
        </>
      )}
    </article>
  )
}

export function RecomendacionesPage() {
  const { id } = useParams<{ id: string }>()
  const [datos, setDatos] = useState<Recomendaciones | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  // clave (actividad + día) -> id del ítem del itinerario, necesario para poder quitarla
  const [agregadas, setAgregadas] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    if (!id) return
    setCargando(true)
    obtenerRecomendaciones(id)
      .then((respuesta) => {
        setDatos(respuesta)
        setError(null)
      })
      .catch((e) => setError(mensajeDeError(e)))
      .finally(() => setCargando(false))
  }, [id])

  // Qué actividades ya están en el itinerario (para marcarlas). Si falla, simplemente no se marcan.
  useEffect(() => {
    if (!id) return
    listarItinerario(id)
      .then((items) => setAgregadas(new Map(items.map((i) => [clave(i.actividadId, i.fecha), i.id]))))
      .catch(() => {})
  }, [id])

  const marcarAgregada = (c: string, itemId: string) =>
    setAgregadas((anteriores) => new Map(anteriores).set(c, itemId))

  const marcarQuitada = (c: string) =>
    setAgregadas((anteriores) => {
      const nuevo = new Map(anteriores)
      nuevo.delete(c)
      return nuevo
    })

  return (
    <section className="pl-inicio recomendaciones">
      <Link to={`/viajes/${id}`} className="pl-back-link">
        ← Volver al viaje
      </Link>
      <h1 className="pl-inicio-titulo">Recomendaciones según el clima</h1>

      {cargando && <p>Consultando el pronóstico...</p>}
      {error && <p role="alert" className="error">{error}</p>}

      {datos && (
        <>
          <p className="pl-inicio-tagline">📍 Destino: {datos.destino}</p>
          {datos.dias.length === 0 && (
            <p>Todavía no hay pronóstico para las fechas de este viaje.</p>
          )}
          <div className="dias">
            {datos.dias.map((dia) => (
              <DiaTarjeta
                key={dia.fecha}
                dia={dia}
                viajeId={datos.viajeId}
                agregadas={agregadas}
                onAgregada={marcarAgregada}
                onQuitada={marcarQuitada}
              />
            ))}
          </div>
          {datos.sinPronostico.length > 0 && (
            <p className="aviso">
              Sin pronóstico para: {datos.sinPronostico.map(formatearFecha).join(', ')}. El servicio
              cubre unos 16 días desde hoy.
            </p>
          )}
          <p className="atribucion">
            Pronóstico: <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo.com</a> (CC BY 4.0).
            Lugares: BA Data, Gobierno de la Ciudad de Buenos Aires.
          </p>
        </>
      )}
    </section>
  )
}
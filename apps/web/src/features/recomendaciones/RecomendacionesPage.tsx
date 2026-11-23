import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { mensajeDeError } from '../../shared/api'
import { obtenerRecomendaciones } from './recomendaciones.service'
import type { DiaRecomendado, Recomendaciones } from './tipos'
import './recomendaciones.css'

const POR_DIA = 5

const ETIQUETA_DIA = { BUENO: 'Día bueno', LLUVIOSO: 'Día lluvioso', EXTREMO: 'Clima extremo' } as const
const ETIQUETA_TIPO = { INTERIOR: 'Interior', EXTERIOR: 'Exterior', MIXTA: 'Mixta' } as const
const ICONO_DIA = { BUENO: '☀️', LLUVIOSO: '🌧️', EXTREMO: '🌡️' } as const
const ICONO_TIPO = { INTERIOR: '🏛️', EXTERIOR: '🌳', MIXTA: '🔀' } as const

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

// "2026-11-17" -> "martes, 17 de noviembre". Se usa el mediodía en UTC para que la fecha no se corra un día.
function formatearFecha(fecha: string) {
  return new Date(`${fecha}T12:00:00Z`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

function DiaTarjeta({ dia }: { dia: DiaRecomendado }) {
  const [verTodas, setVerTodas] = useState(false)
  const visibles = verTodas ? dia.actividades : dia.actividades.slice(0, POR_DIA)
  const { clima } = dia

  return (
    <article className={`dia dia-${clima.tipoDia.toLowerCase()}`}>
      <header>
        <div>
          <h3>{capitalizar(formatearFecha(dia.fecha))}</h3>
          <p className="clima">
            🌡️ {clima.tempMin}° a {clima.tempMax}° · 🌧️ {clima.probLluvia}% de probabilidad de lluvia
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
              <DiaTarjeta key={dia.fecha} dia={dia} />
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
import { useEffect, useState } from 'react'
import { mensajeDeError } from '../../shared/api'
import { listarActividades } from './catalogo.api'
import type { Actividad } from './catalogo.api'
import './catalogo.css'

const ETIQUETA_TIPO = { INTERIOR: 'Interior', EXTERIOR: 'Exterior', MIXTA: 'Mixta' }

interface Props {
  id?: string
  value: string
  onChange: (actividadId: string) => void
  className?: string
}

// Desplegable con las actividades activas del catálogo. Devuelve el id de la elegida.
export function ActividadSelect({ id, value, onChange, className }: Props) {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true
    listarActividades({ tipo: '', activa: 'true' })
      .then((datos) => vigente && setActividades(datos))
      .catch((e) => vigente && setError(mensajeDeError(e)))
      .finally(() => vigente && setCargando(false))
    return () => {
      vigente = false
    }
  }, [])

  if (error) {
    return (
      <p className="catalogo-error" role="alert">
        {error}
      </p>
    )
  }

  return (
    <select
      id={id}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      disabled={cargando}
    >
      <option value="">{cargando ? 'Cargando actividades…' : 'Elegí una actividad'}</option>
      {actividades.map((a) => (
        <option key={a.id} value={a.id}>
          {a.nombre} · {ETIQUETA_TIPO[a.tipo]}
        </option>
      ))}
    </select>
  )
}
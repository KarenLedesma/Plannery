import { useEffect, useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import type { Actividad, DatosActividad, Destino, TipoActividad } from './catalogo.api'

interface Props {
  destinos: Destino[]
  inicial: Actividad | null // null = actividad nueva
  guardando: boolean
  error: string | null
  onGuardar: (datos: DatosActividad) => void
  onCancelar: () => void
}

// Vacío -> null. Con coma decimal también anda (-34,6 -> -34.6)
function textoOpcional(texto: string) {
  const limpio = texto.trim()
  return limpio === '' ? null : limpio
}
function numeroOpcional(texto: string) {
  const limpio = texto.trim().replace(',', '.')
  return limpio === '' ? null : Number(limpio)
}

export function ActividadForm({ destinos, inicial, guardando, error, onGuardar, onCancelar }: Props) {
  const [destinoId, setDestinoId] = useState(inicial?.destinoId ?? destinos[0]?.id ?? '')
  const [nombre, setNombre] = useState(inicial?.nombre ?? '')
  const [tipo, setTipo] = useState<TipoActividad>(inicial?.tipo ?? 'EXTERIOR')
  const [categoria, setCategoria] = useState(inicial?.categoria ?? '')
  const [direccion, setDireccion] = useState(inicial?.direccion ?? '')
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '')
  const [latitud, setLatitud] = useState(inicial?.latitud?.toString() ?? '')
  const [longitud, setLongitud] = useState(inicial?.longitud?.toString() ?? '')
  const [activa, setActiva] = useState(inicial?.activa ?? true)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)
    // Al abrir el formulario, la pantalla sube sola hasta él
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  function enviar(evento: SyntheticEvent) {
    evento.preventDefault()
    if (nombre.trim() === '') {
      setErrorLocal('El nombre es obligatorio.')
      return
    }
    const lat = numeroOpcional(latitud)
    const lng = numeroOpcional(longitud)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setErrorLocal('La latitud y la longitud tienen que ser números.')
      return
    }
    setErrorLocal(null)
    onGuardar({
      destinoId,
      nombre: nombre.trim(),
      tipo,
      descripcion: textoOpcional(descripcion),
      categoria: textoOpcional(categoria),
      direccion: textoOpcional(direccion),
      latitud: lat,
      longitud: lng,
      activa,
    })
  }

  const mensaje = errorLocal ?? error

  return (
    <form ref={formRef} className="catalogo-form" onSubmit={enviar}>
      <h2>{inicial ? 'Editar actividad' : 'Nueva actividad'}</h2>

      <div className="catalogo-form-grilla">
        <label>
          Nombre *
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={150} />
        </label>

        <label>
          Tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoActividad)}>
            <option value="INTERIOR">Interior</option>
            <option value="EXTERIOR">Exterior</option>
            <option value="MIXTA">Mixta</option>
          </select>
        </label>

        <label>
          Destino
          <select value={destinoId} onChange={(e) => setDestinoId(e.target.value)}>
            {destinos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoría
          <input value={categoria} onChange={(e) => setCategoria(e.target.value)} maxLength={100} />
        </label>

        <label className="catalogo-form-ancho">
          Dirección
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} maxLength={200} />
        </label>

        <label className="catalogo-form-ancho">
          Descripción
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={1000} rows={3} />
        </label>

        <label>
          Latitud
          <input value={latitud} onChange={(e) => setLatitud(e.target.value)} inputMode="decimal" placeholder="-34.6037" />
        </label>

        <label>
          Longitud
          <input value={longitud} onChange={(e) => setLongitud(e.target.value)} inputMode="decimal" placeholder="-58.3816" />
        </label>

        {inicial && (
          <label className="catalogo-form-check">
            <input type="checkbox" checked={activa} onChange={(e) => setActiva(e.target.checked)} />
            Activa (se puede recomendar)
          </label>
        )}
      </div>

      {mensaje && <p className="catalogo-error" role="alert">{mensaje}</p>}

      <div className="catalogo-form-botones">
        <button type="submit" className="catalogo-guardar" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
        <button type="button" className="catalogo-cancelar" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
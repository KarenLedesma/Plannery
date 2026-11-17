import React, { useState, useEffect } from 'react'
import { crearViaje, type CrearViajeDto, type Viaje } from './viajes.service'

type Destino = {
  id: string
  nombre: string
}

export function ViajeFormComponent: React.FC = () => {
  const [datos, setDatos] = useState<CrearViajeDto>({
    nombre: '',
    destinoId: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
  })
  const [exito, setExito] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [destinos, setDestinos] = useState<Destino[]>([])

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value as any } as CrearViajeDto)
  }

  const cargarDestinos = async () => {
    try {
      const respuesta = await fetch('/api/destinos', {
        credentials: 'include',
      })
      const destinos = await respuesta.json()
      if (!Array.isArray(destinos)) {
        console.warn('Expected destinations array but got:', destinos)
        setDestinos([])
        return
      }
      setDestinos(destinos)
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => {
    cargarDestinos()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!datos.destinoId) {
      setError('Por favor, selecciona un destino o ingresa un destinoId válido')
      setLoading(false)
      return
    }

    try {
      const creado = await crearViaje(datos)
      setExito(true)
      setDatos({
        nombre: '',
        destinoId: '',
        fechaInicio: '',
        fechaFin: '',
        presupuesto: 0,
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Nuevo Viaje</h2>
      {exito && <p style={{ color: 'green' }}>Viaje creado exitosamente!</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={datos.nombre}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Destino *</label>
          <select
            onChange={(e) => setDatos({ ...datos, destinoId: e.target.value } as any)}
            style={{ width: '100%', marginBottom: '0.5rem' }}
            required
          >
            <option value="">-- Seleccionar destino --</option>
            {destinos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Fecha Inicio *</label>
          <input
            type="date"
            name="fechaInicio"
            value={datos.fechaInicio}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Fecha Fin *</label>
          <input
            type="date"
            name="fechaFin"
            value={datos.fechaFin}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Presupuesto *</label>
          <input
            type="number"
            name="presupuesto"
            value={String(datos.presupuesto)}
            onChange={manejarCambio}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Guardando...' : 'Crear Viaje'}
        </button>
      </form>
    </section>
  )
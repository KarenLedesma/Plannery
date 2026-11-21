import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { crearViaje, type CrearViajeDto } from './viajes.service';

type Destino = {
  id: string;
  nombre: string;
};

export function ViajeFormComponent() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<CrearViajeDto>({
    nombre: '',
    destinoId: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinos, setDestinos] = useState<Destino[]>([]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value as any } as CrearViajeDto);
  };

  useEffect(() => {
    async function cargarDestinos() {
      try {
        const respuesta = await fetch('/api/destinos', {
          credentials: 'include',
        });
        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los destinos');
        }
        const data = await respuesta.json();
        setDestinos(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message);
      }
    }
    cargarDestinos();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!datos.destinoId) {
      setError('Por favor, selecciona un destino válido');
      setLoading(false);
      return;
    }

    try {
      await crearViaje({ ...datos, presupuesto: Number(datos.presupuesto) });
      navigate('/viajes');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Nuevo Viaje</h2>
        <Link to="/viajes">← Volver a Mis Viajes</Link>
      </div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={datos.nombre}
            onChange={manejarCambio}
            minLength={2}
            maxLength={80}
            required
          />
        </div>
        <div>
          <label>Destino *</label>
          <select
            name="destinoId"
            value={datos.destinoId}
            onChange={(e) => setDatos({ ...datos, destinoId: e.target.value })}
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
            min={datos.fechaInicio || undefined}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Presupuesto *</label>
          <input
            type="number"
            name="presupuesto"
            min={0}
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
  );
}
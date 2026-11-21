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

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
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
    <div className="pl-form-container">
      <div className="pl-form-header">
        <h2>Nuevo Viaje</h2>
        <Link to="/viajes" className="pl-back-link">
          ← Volver a Mis Viajes
        </Link>
      </div>

      <form onSubmit={onSubmit} className="pl-form-card">
        {error && <div className="pl-error-box">{error}</div>}

        <div className="pl-field">
          <label htmlFor="nombre" className="pl-label">
            Nombre del viaje *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className="pl-input"
            placeholder="Ej: Escapada de fin de semana"
            autoComplete="off"
            value={datos.nombre}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="pl-field">
          <label htmlFor="destinoId" className="pl-label">
            Destino *
          </label>
          <select
            id="destinoId"
            name="destinoId"
            className="pl-select"
            value={datos.destinoId}
            onChange={manejarCambio}
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

        <div className="pl-field-row">
          <div className="pl-field">
            <label htmlFor="fechaInicio" className="pl-label">
              Fecha Inicio *
            </label>
            <input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              className="pl-input"
              value={datos.fechaInicio}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="pl-field">
            <label htmlFor="fechaFin" className="pl-label">
              Fecha Fin *
            </label>
            <input
              id="fechaFin"
              name="fechaFin"
              type="date"
              className="pl-input"
              value={datos.fechaFin}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        <div className="pl-field">
          <label htmlFor="presupuesto" className="pl-label">
            Presupuesto estimado ($)
          </label>
          <input
            id="presupuesto"
            name="presupuesto"
            type="number"
            min="0"
            className="pl-input"
            placeholder="Ej: 150000"
            value={datos.presupuesto}
            onChange={manejarCambio}
          />
        </div>

        <button type="submit" className="pl-btn-submit" disabled={loading}>
          {loading ? 'Creando viaje...' : 'Crear Viaje'}
        </button>
      </form>
    </div>
  );
}
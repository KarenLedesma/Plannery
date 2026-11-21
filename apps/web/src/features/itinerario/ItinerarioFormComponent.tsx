import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { crearItinerario } from './itinerario.service';

export const ItinerarioFormComponent: React.FC = () => {
  const { id: itinerarioId } = useParams<{ id: string }>();
  const [actividadId, setActividadId] = useState<string>('');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notas, setNotas] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar actividades disponibles (podría traerlas de una API o del catálogo)
    // Por ahora dejamos el formulario vacío para ingreso manual
  }, [itinerarioId]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itinerarioId) return;
    setLoading(true);
    setError(null);

    try {
      const dto: any = {
        actividadId,
        fecha,
      };
      if (notas.trim()) {
        dto.notas = notas;
      }
      await crearItinerario(itinerarioId, dto);
      setActividadId('');
      setFecha(new Date().toISOString().split('T')[0]);
      setNotas('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit} className="pl-form-card">
      <h3 style={{ margin: 0, color: '#1e293b' }}>Añadir ítem al itinerario</h3>

      {error && <div className="pl-error-box">Error: {error}</div>}

      <div className="pl-field">
        <label htmlFor="actividadId" className="pl-label">
          Actividad ID *
        </label>
        <input
          id="actividadId"
          type="text"
          className="pl-input"
          value={actividadId}
          onChange={(e) => setActividadId(e.target.value)}
          required
          autoComplete="off"
          placeholder="ID de la actividad"
        />
      </div>

      <div className="pl-field-row">
        <div className="pl-field">
          <label htmlFor="fecha" className="pl-label">
            Fecha *
          </label>
          <input
            id="fecha"
            type="date"
            className="pl-input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <div className="pl-field">
          <label htmlFor="notas" className="pl-label">
            Notas (opcional)
          </label>
          <input
            id="notas"
            type="text"
            className="pl-input"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            autoComplete="off"
            placeholder="Notas del ítem"
          />
        </div>
      </div>

      <button type="submit" className="pl-btn-submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Añadir ítem'}
      </button>
    </form>
  );
};
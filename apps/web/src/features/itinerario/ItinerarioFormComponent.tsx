import React, { useEffect, useState } from 'react';
import { crearItinerario, type ItinerarioDia } from './itinerario.service';

export const ItinerarioFormComponent: React.FC = () => {
  const { itinerarioId } = window.location.pathname.match(/\/viajes\/([^/]+)\/itinerario/) || [];
  const [actividadId, setActividadId] = useState<string>('');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notas, setNotas] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar actividads disponibles (podría traerlas de una API o del catálogo)
    // Por ahora dejamos el formulario vacío para ingreso manual
  }, [itinerarioId]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await crearItinerario(itinerarioId!, dto);
      setActividadId('');
      setFecha(new Date().toISOString().split('T')[0]);
      setNotas('');
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Añadir ítem al itinerario</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={manejarSubmit}>
        <div>
          <label>Actividad ID *</label>
          <input
            type="text"
            value={actividadId}
            onChange={(e) => setActividadId(e.target.value)}
            required
            placeholder="ID de la actividad"
          />
        </div>
        <div>
          <label>Fecha *</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Notas (opcional)</label>
          <input
            type="text"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas del ítem"
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Guardando...' : 'Añadir ítem'}
        </button>
      </form>
    </section>
  );
};
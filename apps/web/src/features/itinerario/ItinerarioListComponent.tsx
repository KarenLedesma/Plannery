import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listarItinerario, type ItinerarioDia } from './itinerario.service';

export const ItinerarioListComponent: React.FC = () => {
  const { id: itinerarioId } = useParams<{ id: string }>();
  const [itinerarioItems, setItinerarioItems] = useState<ItinerarioDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItinerario() {
      try {
        const data = await listarItinerario(itinerarioId!);
        setItinerarioItems(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (itinerarioId) fetchItinerario();
  }, [itinerarioId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <section>
      <h2>Itinerario</h2>
      {itinerarioItems.length === 0 && <p>No hay ítems en el itinerario.</p>}
      <ul>
        {itinerarioItems.map((item) => (
          <li key={item.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
            <h3>{item.actividadId}</h3>
            <p><strong>Fecha:</strong> {item.fecha}</p>
            <p><strong>Notas:</strong> {item.notas || 'Ninguna'}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
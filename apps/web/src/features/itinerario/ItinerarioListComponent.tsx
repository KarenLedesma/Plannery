import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listarItinerario, type ItinerarioDia } from './itinerario.service';

// 2026-11-23T00:00:00.000Z -> 23/11/2026
function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

interface Props {
  // Cambia cada vez que se agrega un ítem: obliga a pedir la lista de nuevo
  version?: number;
}

export const ItinerarioListComponent: React.FC<Props> = ({ version = 0 }) => {
  const { id: itinerarioId } = useParams<{ id: string }>();
  const [itinerarioItems, setItinerarioItems] = useState<ItinerarioDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItinerario() {
      try {
        const data = await listarItinerario(itinerarioId!);
        setItinerarioItems(data);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (itinerarioId) fetchItinerario();
  }, [itinerarioId, version]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <section>
      <h2>Itinerario</h2>
      {itinerarioItems.length === 0 && <p>No hay ítems en el itinerario.</p>}
      <ul>
        {itinerarioItems.map((item) => (
          <li key={item.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
            <h3>{item.actividad?.nombre ?? item.actividadId}</h3>
            <p><strong>Fecha:</strong> {formatearFecha(item.fecha)}</p>
            <p><strong>Notas:</strong> {item.nota || 'Ninguna'}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
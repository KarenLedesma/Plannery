import React, { useEffect, useState } from 'react';
import { listarItinerario } from './itinerario.service';

type ItinerarioListProps = {
  voyageId: string;
};

export const ItinerarioListComponent: React.FC<ItinerarioListProps> = ({
  voyageId
}: ItinerarioListProps) => {
  const [itinerario, setItinerario] = useState<Array<{id: string; actividadId: string; fecha: string; notas?: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItinerario() {
      try {
        const data = await listarItinerario(voyageId);
        setItinerario(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItinerario();
  }, [voyageId]);

  if (loading) return <p>Cargando itinerario...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <section>
      <h3>Itinerario por Día</h3>
      <ul>
        {itinerario.map((item) => (
          <li key={item.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
            <div>
              <strong>Fecha:</strong> {item.fecha}
            </div>
            <div>
              <strong>Actividad ID:</strong> {item.actividadId}
            </div>
            {item.notas && <div><strong>Notas:</strong> {item.notas}</div>}
            <a href={`/viajes/${voyageId}/itinerario/${item.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>Ver detalle</a>
          </li>
        ))}
      </ul>
      {itinerario.length === 0 && <p>No hay actividades en el itinerario aún.</p>}
    </section>
  );
};
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listarItinerario, type ItinerarioDia } from './itinerario.service';

const ETIQUETA_TIPO: Record<string, string> = {
  INTERIOR: 'Interior',
  EXTERIOR: 'Exterior',
  MIXTA: 'Mixta',
};

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
  if (error) return <p className="pl-error-box">Error: {error}</p>;

  return (
    <section>
      <h2>Itinerario</h2>

      {itinerarioItems.length === 0 ? (
        <p>No hay ítems en el itinerario.</p>
      ) : (
        <div className="pl-detalle-datos">
          {itinerarioItems.map((item) => {
            const tipo = item.actividad?.tipo;
            return (
              <article key={item.id} className="pl-dato">
                <p className="pl-dato-label">
                  📅 {formatearFecha(item.fecha)}
                  {tipo ? ` · ${ETIQUETA_TIPO[tipo] ?? tipo}` : ''}
                </p>
                <p className="pl-dato-valor">
                  {item.actividad?.nombre ?? item.actividadId}
                </p>
                {item.nota && (
                  <p className="pl-dato-label" style={{ marginTop: '0.4rem' }}>
                    {item.nota}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
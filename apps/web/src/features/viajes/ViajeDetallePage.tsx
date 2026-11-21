import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Viaje } from './tipos';

export function ViajeDetallePage() {
  const { id } = useParams<{ id: string }>();
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarViaje() {
      try {
        const res = await fetch(`/api/viajes/${id}`, { credentials: 'include' });
        if (!res.ok) throw new Error('No se pudo cargar el viaje');
        setViaje(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) cargarViaje();
  }, [id]);

  if (loading) return <p>Cargando viaje...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!viaje) return <p>Viaje no encontrado.</p>;

  return (
    <section>
      <h2>{viaje.nombre}</h2>
      <p><strong>Fechas:</strong> {viaje.fechaInicio} - {viaje.fechaFin}</p>
      <p><strong>Presupuesto:</strong> ${viaje.presupuesto}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to={`/viajes/${viaje.id}/itinerario`}>Ver Itinerario</Link>
        <Link to={`/viajes/${viaje.id}/recomendaciones`}>Ver Recomendaciones</Link>
        <Link to="/viajes">Volver a Mis Viajes</Link>
      </div>
    </section>
  );
}
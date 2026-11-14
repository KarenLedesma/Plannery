import React, { useEffect, useState } from 'react';
import { listarViajes, type Viaje } from './viajes.service';

export const ViajeListComponent: React.FC = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchViajes() {
      try {
        const data = await listarViajes();
        setViajes(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchViajes();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <section>
      <h2>Mis Viajes</h2>
      <ul>
        {viajes.map((viaje) => (
          <li key={viaje.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
            <h3>{viaje.nombre}</h3>
            <p><strong>Destino:</strong> {viaje.destinoId}</p>
            <p><strong>Fechas:</strong> {viaje.fechaInicio} - {viaje.fechaFin}</p>
            <p><strong>Presupuesto:</strong> {viaje.presupuesto}</p>
            <a href={`/viajes/${viaje.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>Ver detalle</a>
          </li>
        ))}
      </ul>
    </section>
  );
};
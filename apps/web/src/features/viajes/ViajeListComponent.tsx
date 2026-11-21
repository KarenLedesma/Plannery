import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Mis Viajes</h2>
        <Link to="/viajes/nuevo">Nuevo Viaje</Link>
      </div>
      {viajes.length === 0 ? (
        <p>No tienes viajes registrados todavía.</p>
      ) : (
        <ul>
          {viajes.map((viaje: any) => (
            <li key={viaje.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
              <h3>{viaje.nombre}</h3>
              <p><strong>Destino:</strong> {viaje.destino?.nombre ?? viaje.destinoId}</p>
              <p><strong>Fechas:</strong> {viaje.fechaInicio?.slice(0, 10)} - {viaje.fechaFin?.slice(0, 10)}</p>
              <p><strong>Presupuesto:</strong> ${viaje.presupuesto} {viaje.moneda ?? 'ARS'}</p>
              <Link to={`/viajes/${viaje.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>Ver detalle</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Viaje } from './tipos';
import { ResumenViajePanel } from '../resumen/ResumenViajePanel';

// "2026-11-22T00:00:00.000Z" -> "22/11/2026" (sin pasar por Date, para evitar corrimientos de zona horaria)
const formatearFecha = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/');

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
    <section className="pl-inicio">
      <Link to="/viajes" className="pl-back-link">
        ← Volver a Mis viajes
      </Link>

      <h1 className="pl-inicio-titulo">{viaje.nombre}</h1>

      <div className="pl-detalle-datos">
        <div className="pl-dato">
          <p className="pl-dato-label">📅 Fechas</p>
          <p className="pl-dato-valor">
            {formatearFecha(viaje.fechaInicio)} - {formatearFecha(viaje.fechaFin)}
          </p>
        </div>
        <div className="pl-dato">
          <p className="pl-dato-label">💵 Presupuesto</p>
          <p className="pl-dato-valor">${Number(viaje.presupuesto).toLocaleString('es-AR')}</p>
        </div>
      </div>

      <div className="pl-detalle-acciones">
        <Link to={`/viajes/${viaje.id}/itinerario`} className="pl-btn-sec">
          Ver itinerario
        </Link>
        <Link to={`/viajes/${viaje.id}/gastos`} className="pl-btn-sec">
          💰 Gastos
        </Link>
        <Link to={`/viajes/${viaje.id}/recomendaciones`} className="pl-btn-recs">
          ✨ Ver recomendaciones
        </Link>
      </div>

      <ResumenViajePanel viajeId={viaje.id} />
    </section>
  );
}
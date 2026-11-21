import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarViajes, type Viaje } from './viajes.service';

const categorizarViaje = (viaje: Viaje, hoy: Date) => {
  const inicio = new Date(viaje.fechaInicio);
  const fin = new Date(viaje.fechaFin);
  if (fin < hoy) return 'terminados';
  if (inicio > hoy) return 'pendientes';
  return 'en_curso';
};

export function ViajeListComponent() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [cargar, setCargar] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'pendientes' | 'en_curso' | 'terminados'>('todos');

  useEffect(() => {
    async function cargarViajes() {
      try {
        const data = await listarViajes();
        setViajes(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setCargar(false);
      }
    }
    cargarViajes();
  }, []);

  const hoy = new Date();
  const viajesFiltrados = viajes.filter(
    (viaje) => categorizarViaje(viaje, hoy) === filtro || filtro === 'todos'
  );

  if (cargar) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <section>
      <h1>Mis Viajes</h1>
      <p>Administrá tus escapadas, itinerarios y recomendaciones.</p>

      <nav aria-label="Filtro de viajes">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setFiltro('todos')}
            style={{
              padding: '0.35rem 0.75rem',
              border: filtro === 'todos' ? '1px solid #164e78' : '1px solid #e4ddd0',
              borderRadius: '8px',
              background: filtro === 'todos' ? '#ffffff' : 'transparent',
              fontWeight: filtro === 'todos' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('pendientes')}
            style={{
              padding: '0.35rem 0.75rem',
              border: filtro === 'pendientes' ? '1px solid #164e78' : '1px solid #e4ddd0',
              borderRadius: '8px',
              background: filtro === 'pendientes' ? '#ffffff' : 'transparent',
              fontWeight: filtro === 'pendientes' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFiltro('en_curso')}
            style={{
              padding: '0.35rem 0.75rem',
              border: filtro === 'en_curso' ? '1px solid #164e78' : '1px solid #e4ddd0',
              borderRadius: '8px',
              background: filtro === 'en_curso' ? '#ffffff' : 'transparent',
              fontWeight: filtro === 'en_curso' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            En curso
          </button>
          <button
            onClick={() => setFiltro('terminados')}
            style={{
              padding: '0.35rem 0.75rem',
              border: filtro === 'terminados' ? '1px solid #164e78' : '1px solid #e4ddd0',
              borderRadius: '8px',
              background: filtro === 'terminados' ? '#ffffff' : 'transparent',
              fontWeight: filtro === 'terminados' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            Terminados
          </button>
        </div>
      </nav>

      <Link
        to="/viajes/nuevo"
        style={{
          marginBottom: '1rem',
          display: 'inline-block',
          padding: '0.55rem 1.1rem',
          background: '#164e78',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        }}
      >
        Nuevo Viaje
      </Link>

      {viajesFiltrados.length === 0 && (
        <p style={{ color: 'gray' }}>
          No tienes viajes{' '}
          {filtro === 'todos'
            ? 'registrados'
            : filtro === 'pendientes'
            ? 'pendientes'
            : filtro === 'en_curso'
            ? 'en curso'
            : 'terminados'}
          .
        </p>
      )}

      <ul className="pl-viajes-grid">
        {viajesFiltrados.map((viaje) => (
          <li key={viaje.id} className="pl-viaje-card">
            <div>
              <h3 className="pl-viaje-title">{viaje.nombre}</h3>
              <p className="pl-viaje-meta">
                <strong>Destino:</strong> {viaje.destino?.nombre ?? viaje.destinoId}
              </p>
              <p className="pl-viaje-meta">
                <strong>Fechas:</strong> {viaje.fechaInicio?.slice(0, 10)} -{' '}
                {viaje.fechaFin?.slice(0, 10)}
              </p>
              <p className="pl-viaje-meta">
                <strong>Presupuesto:</strong> ${viaje.presupuesto}
              </p>
            </div>

            <div className="pl-viaje-links">
              <Link to={`/viajes/${viaje.id}`}>Ver detalle</Link>
              <Link to={`/viajes/${viaje.id}/itinerario`} style={{ color: '#15803d' }}>
                Modificar Itinerario
              </Link>
              <Link to={`/viajes/${viaje.id}/recomendaciones`} style={{ color: '#6d28d9' }}>
                Ver recomendaciones
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
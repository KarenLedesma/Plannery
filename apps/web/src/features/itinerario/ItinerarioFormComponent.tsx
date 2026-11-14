import React, { useState } from 'react';
import { crearItinerarioItem } from './itinerario.service';

type ItinerarioFormProps = {
  voyageId: string;
};

export const ItinerarioFormComponent: React.FC<ItinerarioFormProps> = ({
  voyageId
}: ItinerarioFormProps) => {
  const [datos, setDatos] = useState<{actividadId: string; fecha: string}>({
    actividadId: '',
    fecha: '',
  });
  const [exito, setExito] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value as any });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const creado = await crearItinerarioItem(voyageId, datos);
      setExito(true);
      setDatos({
        actividadId: '',
        fecha: '',
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      {exito && <p style={{ color: 'green' }}>Itinerario creado exitosamente!</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Actividad ID *</label>
          <input
            type="text"
            name="actividadId"
            value={datos.actividadId}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Fecha *</label>
          <input
            type="date"
            name="fecha"
            value={datos.fecha}
            onChange={manejarCambio}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Guardando...' : 'Crear Itinerario'}
        </button>
      </form>
    </section>
  );
};
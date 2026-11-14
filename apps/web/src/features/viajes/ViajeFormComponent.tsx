import React, { useState } from 'react';
import { crearViaje, type CrearViajeDto, type Viaje } from './viajes.service';

export const ViajeFormComponent: React.FC = () => {
  const [datos, setDatos] = useState<CrearViajeDto>({
    nombre: '',
    destinoId: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
  });
  const [exito, setExito] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value as any } as CrearViajeDto);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const creado = await crearViaje(datos);
      setExito(true);
      setDatos({
        nombre: '',
        destinoId: '',
        fechaInicio: '',
        fechaFin: '',
        presupuesto: 0,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Nuevo Viaje</h2>
      {exito && <p style={{ color: 'green' }}>Viaje creado exitosamente!</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={datos.nombre}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Destino ID *</label>
          <input
            type="text"
            name="destinoId"
            value={datos.destinoId}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Fecha Inicio *</label>
          <input
            type="date"
            name="fechaInicio"
            value={datos.fechaInicio}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Fecha Fin *</label>
          <input
            type="date"
            name="fechaFin"
            value={datos.fechaFin}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Presupuesto *</label>
          <input
            type="number"
            name="presupuesto"
            value={String(datos.presupuesto)}
            onChange={manejarCambio}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Guardando...' : 'Crear Viaje'}
        </button>
      </form>
    </section>
  );
};
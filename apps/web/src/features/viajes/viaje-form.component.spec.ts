import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ViajeFormComponent } from './ViajeFormComponent';
import { CrearViajeDto } from './viajes.service';

describe('ViajeFormComponent', () => {
  beforeEach(() => {
    vi.doMock('./viajes.service', () => ({
      crearViaje: vi.fn().mockResolvedValue({ id: 'uuid-1', ...({} as any) }),
    }));
  });

  it('debe renderizar el formulario de creación de viaje', () => {
    render(<ViajeFormComponent />);
    expect(screen.getByText('Nuevo Viaje')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre *')).toBeInTheDocument();
    expect(screen.getByLabelText('Destino ID *')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha Inicio *')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha Fin *')).toBeInTheDocument();
    expect(screen.getByLabelText('Presupuesto *')).toBeInTheDocument();
  });

  it('debe crear un viaje exitosamente', async () => {
    const user = userEvent.setup();
    render(<ViajeFormComponent />);

    await user.type(screen.getByLabelText('Nombre *'), 'Viaje de prueba');
    await user.type(screen.getByLabelText('Destino ID *'), 'dest-1');
    await user.type(screen.getByLabelText('Fecha Inicio *'), '2025-12-01');
    await user.type(screen.getByLabelText('Fecha Fin *'), '2025-12-07');
    await user.type(screen.getByLabelText('Presupuesto *'), '10000');
    await user.click(screen.getByText('Crear Viaje'));

    await waitFor(() => {
      expect(screen.getByText('Viaje creado exitosamente!')).toBeInTheDocument();
    });
  });

  it('debe mostrar errores de validación', async () => {
    const user = userEvent.setup();
    render(<ViajeFormComponent />);

    await user.click(screen.getByText('Crear Viaje'));

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });
});
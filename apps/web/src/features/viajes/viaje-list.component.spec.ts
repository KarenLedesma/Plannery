import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ViajeListComponent } from './ViajeListComponent';
import { Viaje } from './viajes.service';

describe('ViajeListComponent', () => {
  beforeEach(() => {
    // Mock the service
    vi.doMock('./viajes.service', () => ({
      listarViajes: vi.fn().mockResolvedValue([]),
    }));
  });

  it('debe renderizar el componente y mostrar título', () => {
    render(<ViajeListComponent />);
    expect(screen.getByText('Mis Viajes')).toBeInTheDocument();
  });

  it('debe mostrar estado de carga inicialmente', () => {
    const { rerender } = render(<ViajeListComponent />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    rerender(<ViajeListComponent />);
  });

  it('debe listar viajes cuando los datos están disponibles', async () => {
    const mockViajes: Viaje[] = [
      {
        id: 'uuid-1',
        nombre: 'Viaje a CABA',
        destinoId: 'dest-1',
        fechaInicio: '2025-12-01',
        fechaFin: '2025-12-07',
        presupuesto: '150000',
        moneda: 'ARS',
        createdAt: '2025-11-10T12:34:56.789Z',
        updatedAt: '2025-11-10T12:34:56.789Z',
        destino: { id: 'dest-1', nombre: 'Ciudad de Buenos Aires', slug: 'caba' },
      },
    ];

    vi.mocked(listarViajes).mockResolvedValue(mockViajes);

    render(<ViajeListComponent />);

    await waitFor(() => {
      expect(screen.getByText('Viaje a CABA')).toBeInTheDocument();
    });
  });

  it('debe manejar errores de la API', async () => {
    const mockError = new Error('Network error');
    vi.mocked(listarViajes).mockRejectedValue(mockError);

    render(<ViajeListComponent />);

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });
});
import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItinerarioListComponent } from './ItinerarioListComponent';

describe('ItinerarioListComponent', () => {
  beforeEach(() => {
    vi.doMock('./itinerario.service', () => ({
      listarItinerario: vi.fn().mockResolvedValue([]),
    }));
  });

  it('debe renderizar el componente y mostrar título', () => {
    render(<ItinerarioListComponent voyageId="uuid-1" />);
    expect(screen.getByText('Itinerario por Día')).toBeInTheDocument();
  });

  it('debe mostrar estado de carga inicialmente', () => {
    const { rerender } = render(<ItinerarioListComponent voyageId="uuid-1" />);
    expect(screen.getByText('Cargando itinerario...')).toBeInTheDocument();
    rerender(<ItinerarioListComponent voyageId="uuid-1" />);
  });

  it('debe listar actividades del itinerario', async () => {
    const mockItinerario = [
      {
        id: 'item-1',
        actividadId: 'act-1',
        fecha: '2025-12-01',
        notas: 'Visita al Museo',
      },
    ];

    vi.mocked(listarItinerario).mockResolvedValue(mockItinerario);

    render(<ItinerarioListComponent voyageId="uuid-1" />);

    await waitFor(() => {
      expect(screen.getByText('Fecha: 2025-12-01')).toBeInTheDocument();
      expect(screen.getByText('Actividad ID: act-1')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay actividades', () => {
    render(<ItinerarioListComponent voyageId="uuid-1" />);
    expect(screen.getByText('No hay actividades en el itinerario aún.')).toBeInTheDocument();
  });
});
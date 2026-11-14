import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItinerarioFormComponent } from './ItinerarioFormComponent';

describe('ItinerarioFormComponent', () => {
  beforeEach(() => {
    vi.doMock('./itinerario.service', () => ({
      crearItinerarioItem: vi.fn().mockResolvedValue({ id: 'item-1', ...({} as any) }),
    }));
  });

  it('debe renderizar el formulario de creación de itinerario', () => {
    render(<ItinerarioFormComponent voyageId="uuid-1" />);
    expect(screen.getByLabelText('Actividad ID *')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha *')).toBeInTheDocument();
  });

  it('debe crear un itinerario item exitosamente', async () => {
    const user = userEvent.setup();
    render(<ItinerarioFormComponent voyageId="uuid-1" />);

    await user.type(screen.getByLabelText('Actividad ID *'), 'act-1');
    await user.type(screen.getByLabelText('Fecha *'), '2025-12-01');
    await user.click(screen.getByText('Crear Itinerario'));

    await waitFor(() => {
      expect(screen.getByText('Itinerario creado exitosamente!')).toBeInTheDocument();
    });
  });

  it('debe mostrar errores al crear', async () => {
    const user = userEvent.setup();
    render(<ItinerarioFormComponent voyageId="uuid-1" />);

    await user.click(screen.getByText('Crear Itinerario'));

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });
});